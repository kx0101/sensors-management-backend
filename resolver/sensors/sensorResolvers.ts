import { logger } from "../../config/logger.ts";
import { SensorRepo } from "../../models/sensor.ts";
import type { SensorCreate, SensorUpdate } from "./sensors.d.ts";

export const sensorsResolvers = {
	Query: {
		sensors: async () => {
			return await SensorRepo.find();
		},
		sensor: async (location: string) => {
			console.log(location);
			return await SensorRepo.findOne({ location: location }).catch(
				(err: Error) => {
					logger.error(err.message);
				},
			);
		},
	},
	Mutation: {
		createSensor: async (sensorInput: SensorCreate) => {
			const sensor = await SensorRepo.create(sensorInput).catch(
				(err: Error) => {
					logger.error(err.message);
				},
			);
			return sensor;
		},
		updateSensor: async (sensorInput: SensorUpdate) => {
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
		deleteSensor: async (_id: string) => {
			const deleteSensor = await SensorRepo.findOneAndDelete({
				_id: _id,
			}).catch((err: Error) => {
				logger.error(err.message);
			});
			return deleteSensor;
		},
	},
};
