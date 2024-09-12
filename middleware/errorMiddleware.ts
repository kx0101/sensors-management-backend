import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const notFound = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const error = new Error(`Not found - ${req.originalUrl}`);

	res.sendStatus(StatusCodes.NOT_FOUND);

	next(error);
};

export const errorHandler = async (
	err: Error,
	_req: Request,
	res: Response,
) => {
	const status = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(status);

	res.send({
		message: err,
		stack: err.stack,
	});
};
