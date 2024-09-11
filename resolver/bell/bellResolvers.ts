import { logger } from "../../config/logger.ts";
import { BellRepo } from "../../models/bell.ts";
import type { BellUpdate } from "./bell.d.ts";

export const bellResolvers = {
	Query: {
		bell: async () => {
			return (await BellRepo.find()).pop();
		},
	},
	Mutation: {
		bellUpdate: async (bellInput: BellUpdate) => {
			return await BellRepo.findByIdAndUpdate(bellInput._id, {
				status: bellInput.status,
			}).catch((err: Error) => {
				logger.error(err.message);
			});
		},
	},
};
