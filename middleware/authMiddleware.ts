import type { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/jwt";
import { logger } from "../config/logger";
import { StatusCodes } from "http-status-codes";

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const jwtHeader = process.env.JWT_HEADER ?? "jwt-secret";
	const token = req.header(jwtHeader);

	if (!token) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.json({ message: "Not authorized, no token" });
	}

	try {
		const decoded = validateToken(token);
		if (!decoded) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: "Not authorized, invalid token" });
		}

		const { role } = decoded;

		if (role != "admin") {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: "Not authorized, user not an admin" });
		}

		next();
	} catch (error) {
		logger.error("Token validation error:", error);
		return res
			.status(StatusCodes.FORBIDDEN)
			.json({ message: "Not authorized" });
	}
};
