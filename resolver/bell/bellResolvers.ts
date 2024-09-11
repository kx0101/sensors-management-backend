import { BellRepo, type Bell } from "../../models/bell.ts";
import type { BellUpdate } from "./bell.d.ts";

export const bellResolvers = {
	Query: {
		bell: async () => {
			return (await BellRepo.find()).pop() as unknown as Bell;
		},
	},
	Mutation: {
		bellUpdate: async (bellInput: BellUpdate) => {
			return await BellRepo.findByIdAndUpdate(bellInput._id, {
				status: bellInput.status,
			});
		},
	},
};
