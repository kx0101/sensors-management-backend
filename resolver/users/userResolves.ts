import { UserRepo, type User } from "../../models/users";

export const userResolvers = {
    Query: {
        users: async (): Promise<User[]> => {
            return await UserRepo.find();
        },
        user: async (id: string): Promise<User | null> => {
            return await UserRepo.findById(id);
        },
        userByUsername: async (username: string): Promise<User | null> => {
            return await UserRepo.findOne({ username });
        },
    }
};
