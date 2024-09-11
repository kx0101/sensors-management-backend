import { UserRepo, type User } from "../../models/users";

export const userResolvers = {
	Query: {
		users: async (): Promise<User[]> => {
			return await UserRepo.find();
		},
		user: async (
			_: unknown,
			{ id }: { id: string },
		): Promise<User | null> => {
			return await UserRepo.findById(id);
		},
		userByUsername: async (
			_: unknown,
			{ username }: { username: string },
		): Promise<User | null> => {
			return await UserRepo.findOne({ username });
		},
	},
};
