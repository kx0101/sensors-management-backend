import jwt, { type JwtPayload } from 'jsonwebtoken';
import { logger } from '../config/logger';

type TokenData = {
    time: Date;
    username: string;
    role: string;
};

interface CustomJwtPayload extends JwtPayload {
    username: string;
}

const jwtSecretKey: string = process.env.JWT_SECRET_KEY ?? 'SECRET';

export const generateToken = (username: string, role: string) => {
    let data: TokenData = {
        time: new Date(),
        username,
        role
    };

    return jwt.sign(data, jwtSecretKey, {
        expiresIn: '24h',
    });
};

export const validateToken = (token: string): CustomJwtPayload | null => {
    try {
        return jwt.verify(token, jwtSecretKey) as CustomJwtPayload;
    } catch (error) {
        logger.error("JWT validation error:", error);
        return null;
    }
};
