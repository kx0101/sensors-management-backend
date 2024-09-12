import express from "express";
import { connectDB } from "./config/db";
import { logger } from "./config/logger";
import { router as userRoutes } from "./routes/userRoutes";
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
import cors from "cors";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
	server: httpServer,
	path: "/subscriptions",
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

apolloServer.start().then(async () => {
	app.use(
		"/graphql",
		express.json(),
		cors<cors.CorsRequest>(),
		expressMiddleware(apolloServer),
	);

	logger.info("Apollo Server is running on /graphql");

	connectDB();
	gatewayClient.connect();

	app.use(express.urlencoded({ extended: true }));

	app.use("/v1/users", userRoutes);

	app.use(notFound);
	app.use(errorHandler);

	// app.listen(PORT, () => {
	// 	logger.info(`Express Server is running on port ${PORT}`);
	// });

	httpServer.listen(PORT, () => {
		logger.info(`Http Server is running on port ${PORT}`);
	});
	wsServer.once("listening", () => {
		logger.info(`WebSocket: Server is running `);
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
});
