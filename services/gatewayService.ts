import { binaryParser, sensorCache } from "../config/gateway";
import { logger } from "../config/logger";
import { Sensor } from "../models/sensor";
import { alarmResolvers } from "../resolver/alarms/alarmResolvers";
import { entriesResolvers } from "../resolver/entries/entryResolvers";
import { sensorsResolvers } from "../resolver/sensors/sensorResolvers";

const prevSensorMap = new Map<string, IData>();
export interface IData {
	address: string;
	type: number;
	order: number;
	id: number;
	value: number;
	status: boolean;
}

export const createEntry = async (data: Buffer) => {
	const parsedData = binaryParser.parse(data) as unknown as IData;
	let currSensor: Sensor =
		await sensorsResolvers.Query.getSensorByAddressAndId(null, {
			address: parsedData.address,
			sensor_id: parsedData.id,
		});
	parsedData.status = currSensor.status;

	const sensorKey = `${parsedData.address}-${parsedData.id}`;
	const prevSensor = prevSensorMap.get(sensorKey);

	if (shouldSkip(prevSensor, parsedData)) {
		console.log("skipping");
		logger.info("skipping");
		return;
	}

	const currentDate = Date.now();
	const lastAdded = sensorCache.get(sensorKey)!;
	if (
		currentDate - lastAdded <= 60000 &&
		prevSensor.status === parsedData.status
	) {
		return;
	}

	prevSensorMap.set(sensorKey, parsedData);
	sensorCache.set(sensorKey, currentDate);

	console.log("creating entry...");
	logger.info("creating entry...");
	await entriesResolvers.Mutation.createEntry(null, {
		entryInput: {
			address: parsedData.address,
			sensor: parsedData.id,
			value: parsedData.value,
		},
	});

	console.log("fetching sensor...");
	logger.info("fetching sensor...");
	const { status: sensorStatus, down_limit, up_limit } = currSensor;

	if (!sensorStatus) {
		return;
	}

	console.log("fetching alarm...");
	logger.info("fetching alarm...");
	const alarm = await alarmResolvers.Query.getAlarmByAddressAndId(null, {
		address: parsedData.address,
		sensor: parsedData.id,
	});

	if (alarm && !alarm.aknowledged && !sensorStatus) {
		console.log("alarm: ", alarm);
		logger.info(`alarm: ${alarm}`);
		return;
	}

	if (parsedData.value > up_limit || parsedData.value < down_limit) {
		const reason = getAlarmReason(parsedData.value, currSensor);

		console.log("creating alarm...");
		logger.info("creating alarm...");
		await alarmResolvers.Mutation.createAlarm(null, {
			alarmInput: {
				address: parsedData.address,
				sensor: parsedData.id,
				reason,
			},
		});

		console.log("updating sensor's status to false...");
		logger.info("updating sensor's status to false...");
		await sensorsResolvers.Mutation.updateStatusSensor(null, {
			_id: currSensor._id.toString(),
			status: false,
		});
	}
};

function getAlarmReason(value: number, sensor: Sensor): string {
	switch (sensor.type) {
		case "Gauge":
			return value > sensor.up_limit
				? "Υψηλή Θερμοκρασία"
				: "Χαμηλή Θερμοκρασία";
		case "Digital":
			return "Ανίχνευση Πλημμύρας";
		case "Relay":
			return "Σφάλμα";
		default:
			return "An error occurred";
	}
}

function shouldSkip(prev: IData | undefined, next: IData): boolean {
	if (!prev) return false;

	const valuesMatch =
		Number(prev.value.toFixed(1)) === Number(next.value.toFixed(1));

	return (
		prev.id === next.id &&
		prev.address === next.address &&
		prev.status === next.status &&
		valuesMatch
	);
}
