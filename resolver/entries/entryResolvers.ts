import { logger } from "../../config/logger";
import { EntryRepo, type Entry } from "../../models/entry";
import type { EntryCreate, EntryID } from "./entries.d";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
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
			pubsub.publish("ENTRY_CREATED", { entryCreated: entry });
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
	},
};
