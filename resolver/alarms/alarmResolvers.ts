import { AlarmRepo, type Alarm } from "../../models/alarm.ts";
import type {
	AlarmCreate,
	AlarmUpdate,
	SensorID,
	SensorInput,
} from "./alarms.d.ts";

export const alarmResolvers = {
	Query: {
		alarms: async () => {
			return await AlarmRepo.find();
		},
		alarm: async (sensor: SensorInput) => {
			return await AlarmRepo.find({ sensor: sensor.id });
		},
	},
	Mutation: {
		createAlarm: async (alarmInput: AlarmCreate): Promise<Alarm> => {
			const alarm = await AlarmRepo.create({
				address: alarmInput.address,
				sensor: alarmInput.sensor,
				reason: alarmInput.reason,
			}).catch((err: Error) => {
				console.log(err.message);
			});
			return alarm as unknown as Alarm;
		},
		updateAlarm: async (alarmInput: AlarmUpdate) => {
			const data = { ...alarmInput };
			const updateAlarm = await AlarmRepo.findOneAndUpdate(
				{ _id: alarmInput._id },
				data,
				{ new: true },
			).catch((err: Error) => {
				console.log(err.message);
			});
			return updateAlarm as unknown as Alarm;
		},
		deleteAlarms: async (sensor: SensorID) => {
			const deleteAlarms = await AlarmRepo.deleteMany({
				sensor: sensor.sensor,
			});
			return `${deleteAlarms.deletedCount} alarms deleted`;
		},
	},
};
