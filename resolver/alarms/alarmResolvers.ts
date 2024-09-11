import { logger } from "../../config/logger.ts";
import { AlarmRepo } from "../../models/alarm.ts";
import type {
	AlarmCreate,
	AlarmUpdate,
	SensorID,
	SensorInput,
} from "./alarms.d.ts";

export const alarmResolvers = {
	Query: {
		alarms: async () => {
			const result = await AlarmRepo.find().catch((err: Error) => {
				logger.error(err.message);
			});
			return result;
		},
		alarm: async ({ sensor }: { sensor: SensorInput }) => {
			return await AlarmRepo.find({ sensor: sensor.id });
		},
	},
	Mutation: {
		createAlarm: async (alarmInput: AlarmCreate) => {
			const alarm = await AlarmRepo.create({
				address: alarmInput.address,
				sensor: alarmInput.sensor,
				reason: alarmInput.reason,
			}).catch((err: Error) => {
				logger.error(err.message);
			});
			return alarm;
		},
		updateAlarm: async (alarmInput: AlarmUpdate) => {
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
		deleteAlarms: async (sensor: SensorID) => {
			const deleteAlarms = await AlarmRepo.deleteMany({
				sensor: sensor.sensor,
			});
			return `${deleteAlarms.deletedCount} alarms deleted`;
		},
	},
};
