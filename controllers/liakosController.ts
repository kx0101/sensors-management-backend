import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const liakos = async (_req: Request, res: Response) => {
    return res.json({
        message: "Done"
    });
};
