import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { loginUser, getAdminPage } from "../services/usersService";

export const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	try {
		const {
			username: user,
			role,
			token,
		} = await loginUser(username, password);
		res.header(process.env.JWT_HEADER ?? "jwt-secret", token);

		return res.status(StatusCodes.OK).json({
			username: user,
			role,
			token,
		});
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "User not found") {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: error.message });
			}
			if (error.message === "Incorrect password") {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: error.message });
			}
		}

		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: error.message });
	}
};

export const admin = async (_req: Request, res: Response) => {
	const response = getAdminPage();
	return res.status(StatusCodes.OK).json(response);
};
