import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcrypt';
import { type User } from "../models/users";
import { generateToken } from "../utils/jwt";
import { userResolvers } from "../resolver/users/userResolves";

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "username and password must be both provided"
        })
    }

    const user: User | null = await userResolvers.Query.userByUsername(username);

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "user not found"
        })
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "incorrect password"
        })
    }

    let token = generateToken(user.username, user.role)
    res.header(process.env.JWT_HEADER ?? 'jwt-secret', token)

    return res.status(StatusCodes.OK).json({
        username: user.username,
        role: user.role,
        token
    })
};

export const admin = async (_req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json({
        message: "Admin page"
    })
}
