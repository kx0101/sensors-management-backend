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
