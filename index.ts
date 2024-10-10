import express from "express";
import { connectDB } from "./config/db";
import { logger } from "./config/logger";
import { router as userRoutes } from "./routes/userRoutes";
import { router as bellRoutes } from "./routes/bellRoutes";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";
import { typeDefs, resolvers } from "./config/apollo";
import { gatewayClient } from "./config/gateway";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Alarmbell } from "./config/alarmbell";
import cors from "cors";
import dotnev from "dotenv";

dotnev.config();
export let alarmBell = null;

connectDB().then(() => {
	gatewayClient.connect();
	alarmBell = new Alarmbell();
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
	server: httpServer,
	path: "/graphql",
});
const serverCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({
	schema,
	introspection: true,
	plugins: [
		// Proper shutdown for the HTTP server.
		ApolloServerPluginDrainHttpServer({ httpServer }),

		// Proper shutdown for the WebSocket server.
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose();
					},
				};
			},
		},
	],
});

const PORT = process.env.PORT || 3000;

apolloServer.start().then(() => {
	app.use(
		"/graphql",
		express.json(),
		cors<cors.CorsRequest>(),
		expressMiddleware(apolloServer),
	);

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cors());
	app.get("/test", (req, res) => {
		res.status(200).json({ message: "Test route working!" });
	});

	app.use("/v1/users", userRoutes);
	app.use("/v1/bells", bellRoutes);
	//Temporary fix for favicon.ico on playground
	app.use("/favicon.ico", (_req, res) => res.status(204));

	app.use(notFound);
	app.use(errorHandler);

	logger.info("Apollo Server is running on /graphql");

	httpServer.listen(PORT, () => {
		logger.info(`http Server is running on port ${PORT}`);
	});

	wsServer.once("listening", () => {
		logger.info(`WebSocket: Server is running on /graphql`);
	});

	wsServer.on("connection", (socket) => {
		logger.info(`WebSocket: Client Connecting`);

		switch (socket.readyState) {
			case 0:
				logger.info(`WebSocket: Client Connecting`);
				break;
			case 1:
				logger.info(`WebSocket: Client Open`);
				break;
			case 2:
				logger.warn(`WebSocket: Client Closing`);
				break;
			case 3:
				logger.warn(`WebSocket: Client Closed`);
				break;
		}
	});

	wsServer.on("error", (error) => {
		logger.error(`WebSocket: ${error.message}`);
	});

	process.on("SIGINT", () => {
		logger.warn("Gracefully closing serial connection...");
		alarmBell.close();
	});
});
