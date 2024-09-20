import { logger } from "../../config/logger";
import { BellRepo } from "../../models/bell";
import type { BellUpdate } from "./bell.d";

export const bellResolvers = {
	Query: {
		bell: async () => {
			return (await BellRepo.find()).pop();
		},
	},
	Mutation: {
		updateBell: async (
			_: unknown,
			{ bellInput }: { bellInput: BellUpdate },
		) => {
			return await BellRepo.findByIdAndUpdate(bellInput._id, {
				status: bellInput.status,
			}).catch((err: Error) => {
				logger.error(err.message);
			});
		},
	},
};
