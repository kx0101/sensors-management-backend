import { SensorRepo, type Sensor } from "../../models/sensor.ts";
import type { SensorCreate, SensorUpdate } from "./sensors.d.ts";

export const sensorsResolvers = {
	Query: {
		sensors: async () => {
			return await SensorRepo.find();
		},
		sensor: async (location: string) => {
			return await SensorRepo.findOne({ location: location });
		},
	},
	Mutation: {
		createSensor: async (sensorInput: SensorCreate): Promise<Sensor> => {
			const sensor = await SensorRepo.create(sensorInput).catch(
				(err: Error) => {
					console.log(err.message);
				},
			);
			return sensor as unknown as Sensor;
		},
		updateSensor: async (sensorInput: SensorUpdate): Promise<Sensor> => {
			const data = { ...sensorInput };
			const updateSensor = await SensorRepo.findOneAndUpdate(
				{ _id: sensorInput._id },
				data,
				{ new: true },
			).catch((err: Error) => {
				console.log(err.message);
			});
			return updateSensor as unknown as Sensor;
		},
		deleteSensor: async (_id: string): Promise<Sensor> => {
			const deleteSensor = await SensorRepo.findOneAndDelete({
				_id: _id,
			}).catch((err: Error) => {
				console.log(err.message);
			});
			return deleteSensor as unknown as Sensor;
		},
	},
};
