import { logger } from "../../config/logger";
import { SensorRepo } from "../../models/sensor";
import type { SensorCreate, SensorUpdate } from "./sensors.d";

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
