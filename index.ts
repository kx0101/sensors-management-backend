import express from "express";
import { connectDB } from "./config/db";
import { logger } from "./config/logger";
import { router as userRoutes } from "./routes/userRoutes";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { typeDefs, resolvers } from "./config/apollo";
import { gatewayClient } from "./config/gateway";

const app = express();

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: true,
});
const PORT = process.env.PORT || 3000;

apolloServer.start().then(async () => {
	app.use("/graphql", express.json(), expressMiddleware(apolloServer));

	logger.info("Apollo Server is running on /graphql");

	connectDB();
	gatewayClient.connect();

	app.use(express.urlencoded({ extended: true }));

	app.use("/v1/users", userRoutes);

	app.use(notFound);
	app.use(errorHandler);

	app.listen(PORT, () => {
		logger.info(`Express Server is running on port ${PORT}`);
	});
});
