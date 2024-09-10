import mongoose from 'mongoose'
import { logger } from '../config/logger'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL ?? '');
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error: ${error}`);
        process.exit(1);
    }
}
