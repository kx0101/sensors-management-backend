import mongoose from "mongoose";
import { logger } from "../config/logger";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URL ?? "", {
			replicaSet: "rs0",
			dbName: "sensors",
			auth: {
				username: process.env.MONGODB_USERNAME,
				password: process.env.MONGODB_PASSWORD,
			},
		});

		logger.info(
			`MongoDB Connected at: ${conn.connection.host}:${conn.connection.port}`,
		);
	} catch (error) {
		logger.error(`Error: ${error}`);
		process.exit(1);
	}
};
