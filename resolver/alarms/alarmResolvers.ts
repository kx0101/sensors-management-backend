import { PubSub } from "graphql-subscriptions";
import { logger } from "../../config/logger";
import { Alarm, AlarmRepo } from "../../models/alarm";
import type {
	AlarmCreate,
	AlarmUpdate,
	SensorID,
	SensorInput,
} from "./alarms.d";

const pubsub = new PubSub();
export const alarmResolvers = {
	Query: {
		alarms: async () => {
			const result = await AlarmRepo.find().catch((err: Error) => {
				logger.error(err.message);
			});
			return result;
		},
		alarm: async (_: unknown, { sensor }: { sensor: SensorInput }) => {
			return await AlarmRepo.find({
				sensor: sensor.id,
				address: sensor.address,
			});
		},
		getAlarmByAddressAndId: async (
			_: unknown,
			{ address, sensor }: { address: string; sensor: number },
		) => {
			return await AlarmRepo.findOne({
				sensor,
				address,
			});
		},
	},
	Mutation: {
		createAlarm: async (
			_: unknown,
			{ alarmInput }: { alarmInput: AlarmCreate },
		) => {
			const alarm = await AlarmRepo.create({
				address: alarmInput.address,
				sensor: alarmInput.sensor,
				reason: alarmInput.reason,
			}).catch((err: Error) => {
				logger.error(err.message);
			});
			pubsub.publish("ALARM_CREATED", { alarmCreated: alarm });
			return alarm;
		},
		updateAlarm: async (
			_: unknown,
			{ alarmInput }: { alarmInput: AlarmUpdate },
		) => {
			const data = { ...alarmInput };
			const updateAlarm = await AlarmRepo.findOneAndUpdate(
				{ _id: alarmInput._id },
				data,
				{ new: true },
			).catch((err: Error) => {
				logger.error(err.message);
			});
			return updateAlarm;
		},
		deleteAlarms: async (_: unknown, { sensor }: { sensor: SensorID }) => {
			const deleteAlarms = await AlarmRepo.deleteMany({
				sensor: sensor.sensor,
			});
			return `${deleteAlarms.deletedCount} alarms deleted`;
		},
	},
	Subscription: {
		alarmCreated: {
			subscribe: () => pubsub.asyncIterator(["ALARM_CREATED"]),
		},
	},
};
