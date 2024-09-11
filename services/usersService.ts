import bcrypt from "bcrypt";
import { type User } from "../models/users";
import { userResolvers } from "../resolver/users/userResolves";
import { generateToken } from "../utils/jwt";

export const loginUser = async (username: string, password: string) => {
	if (!username || !password) {
		throw new Error("Username and password must be provided");
	}

	const user: User | null = await userResolvers.Query.userByUsername(null, {
		username: username,
	});

	if (!user) {
		throw new Error("User not found");
	}

	if (!(await bcrypt.compare(password, user.password))) {
		throw new Error("Incorrect password");
	}

	const token = generateToken(user.username, user.role);

	return {
		username: user.username,
		role: user.role,
		token,
	};
};

export const getAdminPage = () => {
	return { message: "Admin page" };
};
