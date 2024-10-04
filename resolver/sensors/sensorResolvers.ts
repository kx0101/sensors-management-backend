import { logger } from "../../config/logger";
import { EntryRepo } from "../../models/entry";
import { SensorRepo } from "../../models/sensor";
import type {
	SensorBatchInput,
	SensorCreate,
	SensorUpdate,
	AverageData,
} from "./sensors.d";

export const sensorsResolvers = {
	Query: {
		sensors: async () => {
			return await SensorRepo.find();
		},
		sensor: async (_: unknown, { location }: { location: string }) => {
			return await SensorRepo.findOne({ location: location }).catch(
				(err: Error) => {
					logger.error(err.message);
				},
			);
		},
		getSensorByAddressAndId: async (
			_: unknown,
			{ address, sensor_id }: { address: string; sensor_id: number },
		) => {
			try {
				return await SensorRepo.findOne({
					address: address,
					sensor_id: sensor_id,
				});
			} catch (err) {
				logger.error(err.message);
				throw new Error(
					`Failed to fetch sensor with address ${address} and sensor_id ${sensor_id}`,
				);
			}
		},
		getSensorUniqueBuildings: async (_: unknown) => {
			try {
				const sensors = await SensorRepo.find();

				const uniqueBuildings = new Set();
				for (let i = 0; i < sensors.length; i++) {
					uniqueBuildings.add(sensors[i].building);
				}

				return Array.from(uniqueBuildings);
			} catch (err) {
				logger.error(err.message);
				throw new Error(`Failed to fetch sensor with unique buildings`);
			}
		},
		getSensorsByBuilding: async (
			_: unknown,
			{ building }: { building: string },
		) => {
			try {
				return await SensorRepo.find({
					building,
				});
			} catch (err) {
				logger.error(err.message);
				throw new Error(
					`Failed to fetch sensor with building ${building}`,
				);
			}
		},
		getSensorsByBatch: async (
			_: any,
			{ inputs }: { inputs: Array<SensorBatchInput> },
		) => {
			const sensorPromises = inputs.map((input) =>
				sensorsResolvers.Query.getSensorByAddressAndId(null, {
					address: input.address,
					sensor_id: input.sensor_id,
				}),
			);

			return Promise.all(sensorPromises);
		},
		getSensorEntriesLast24Hours: async (
			_: unknown,
			{ sensors }: { sensors: { address: string; sensor_id: number }[] },
		) => {
			const twentyFourHoursAgo = new Date(
				Date.now() - 24 * 60 * 60 * 1000,
			);
			const sensorIds = sensors.map((sensor) => sensor.sensor_id);
			const addresses = sensors.map((sensor) => sensor.address);

			const entries = await EntryRepo.find({
				address: { $in: addresses },
				sensor: { $in: sensorIds },
				createdAt: { $gte: twentyFourHoursAgo },
			}).exec();

			const averageResults: Record<string, AverageData> = {};

			entries.forEach((entry) => {
				const createdAt = new Date(entry.createdAt);
				const hour = createdAt.getHours();
				const sensorId = entry.sensor;
				const address = entry.address;

				if (!averageResults[sensorId]) {
					averageResults[sensorId] = {
						averages: new Array(24).fill(0),
						counts: new Array(24).fill(0),
						address: address,
					};
				}

				averageResults[sensorId].averages[hour] += entry.value;
				averageResults[sensorId].counts[hour] += 1;
			});

			return Object.entries(averageResults).map(
				([sensorId, { averages, counts, address }]) => {
					const finalAverages = averages.map((total, hour) => {
						return counts[hour] > 0 ? total / counts[hour] : 0;
					});

					return {
						sensorId: parseInt(sensorId),
						averages: finalAverages,
						address: address,
					};
				},
			);
		},
	},
	Mutation: {
		createSensor: async (
			_: unknown,
			{ sensorInput }: { sensorInput: SensorCreate },
		) => {
			const sensor = await SensorRepo.create(sensorInput).catch(
				(err: Error) => {
					logger.error(err.message);
				},
			);
			return sensor;
		},
		updateSensor: async (
			_: unknown,
			{ sensorInput }: { sensorInput: SensorUpdate },
		) => {
			const data = { ...sensorInput };
			const updateSensor = await SensorRepo.findOneAndUpdate(
				{ _id: sensorInput._id },
				data,
				{ new: true },
			).catch((err: Error) => {
				logger.error(err.message);
			});
			return updateSensor;
		},
		updateStatusSensor: async (
			_: unknown,
			{ _id, status }: { _id: string; status: boolean },
		) => {
			try {
				const updatedSensor = await SensorRepo.findOneAndUpdate(
					{ _id },
					{ status },
					{ new: true },
				);
				return updatedSensor;
			} catch (err) {
				logger.error(err.message);
				throw new Error("Failed to update sensor status");
			}
		},
		deleteSensor: async (_: unknown, { _id }: { _id: string }) => {
			const deleteSensor = await SensorRepo.findOneAndDelete({
				_id: _id,
			}).catch((err: Error) => {
				logger.error(err.message);
			});
			return deleteSensor;
		},
	},
};
