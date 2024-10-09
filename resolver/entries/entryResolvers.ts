import { logger } from "../../config/logger";
import { EntryRepo, type Entry } from "../../models/entry";
import { SensorRepo } from "../../models/sensor";
import type { EntryCreate, EntryID } from "./entries.d";
import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();
export const entriesResolvers = {
	Query: {
		entries: async (_: unknown, { sensor }: { sensor: Entry }) => {
			const res = await EntryRepo.find({
				sensor: sensor.sensor,
				address: sensor.address,
			}).catch((err: Error) => {
				logger.error(err.message);
			});

			if (!res) return [];

			return res;
		},
		entry: async (
			_: unknown,
			{
				sensorAddress,
				sensorId,
			}: { sensorAddress: string; sensorId: number },
		) => {
			try {
				const res = await EntryRepo.find({
					sensor: sensorId,
					address: sensorAddress,
				})
					.sort({ createdAt: -1 })
					.limit(1);

				if (!res || res.length === 0) return null;

				return res[0];
			} catch (err) {
				logger.error(err.message);
				return null;
			}
		},
	},
	Mutation: {
		createEntry: async (
			_: unknown,
			{ entryInput }: { entryInput: EntryCreate },
		) => {
			const entry = await EntryRepo.create({
				address: entryInput.address,
				sensor: entryInput.sensor,
				value: entryInput.value,
				expireAt: Date.now(),
			}).catch((err: Error) => {
				logger.error(err.message);
			});

			const sensor = await SensorRepo.findOneAndUpdate(
				{ _id: entryInput.sensor_id },
				{ timeout: Date.now() },
				{ new: true },
			).catch((err: Error) => {
				logger.error(err.message);
				throw new Error("Failed to update sensor");
			});

			if (!sensor) {
				throw new Error("Sensor not found or failed to update");
			}

			pubsub.publish("ENTRY_CREATED", { entryCreated: entry });
			pubsub.publish("TIMEOUT_CREATED", {
				timeoutCreated: {
					sensor_id: sensor._id,
					timeout: sensor.timeout ?? Date.now(),
				},
			});

			return entry;
		},
		deleteEntries: async (
			_: unknown,
			{ entryInput }: { entryInput: EntryID },
		) => {
			const date = new Date();
			const pastDate = new Date(date.getDate() - entryInput.period);

			await EntryRepo.find({
				sensor: entryInput.sensor,
				address: entryInput.address,
			})
				.where({ createdAt: { $lt: pastDate } })
				.deleteMany();

			return `Deleted all entries older than ${entryInput.period} days`;
		},
	},
	Subscription: {
		entryCreated: {
			subscribe: () => pubsub.asyncIterator(["ENTRY_CREATED"]),
		},
		timeoutCreated: {
			subscribe: () => pubsub.asyncIterator(["TIMEOUT_CREATED"]),
		},
	},
};
