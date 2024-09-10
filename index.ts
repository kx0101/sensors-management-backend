import express from 'express';
import { connectDB } from './config/db'
import { logger } from './config/logger'
import { router as liakosRoutes } from './routes/liakosRoutes'
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from './config/apollo';

const app = express();

const apolloServer = new ApolloServer({ typeDefs, resolvers });
const PORT = process.env.PORT || 3000;

apolloServer.start().then(() => {
    app.use('/graphql', expressMiddleware(apolloServer));

    logger.info('Apollo Server is running on /graphql');

    connectDB();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/v1/liakos', liakosRoutes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () => {
        logger.info(`Express Server is running on port ${PORT}`);
    });
});
