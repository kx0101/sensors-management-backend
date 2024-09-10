import type { Request } from 'express';
import jwt from 'jsonwebtoken'

type TokenData = {
    time: Date,
    userId: string,
}

const jwtSecretKey: string = process.env.JWT_SECRET_KEY ?? 'SECRET';

export const generateToken = (userId: string) => {
    let data: TokenData = {
        time: new Date(),
        userId,
    }

    return jwt.sign(data, jwtSecretKey, {
        expiresIn: '24h'
    })
}

export const validateToken = (userId: string, req: Request): boolean => {
    const token = req.header(process.env.JWT_HEADER ?? 'jwt-secret')
    if (!token) {
        return false;
    }

    const decoded = jwt.verify(token, jwtSecretKey);
    if (decoded.id != userId) {
        return false;
    }

    return true;
}
