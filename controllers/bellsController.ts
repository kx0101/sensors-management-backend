import type { Request, Response } from "express";
import { alarmBell } from "../index";
import { StatusCodes } from "http-status-codes";

export const testBell = async (_req: Request, res: Response) => {
	try {
		if (!alarmBell.isOpen) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: "Serial port is not open. Unable to test bell.",
			});
		}

		alarmBell.testBell();
		res.status(StatusCodes.OK).json({
			message: "Bell is being tested.",
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: "Failed to test the bell.",
			error: error.message,
		});
	}
};
