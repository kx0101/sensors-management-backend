import express from 'express';
import { connectDB } from './config/db'
import { logger } from './config/logger'
import { router as liakosRoutes } from './routes/liakosRoutes'
import { errorHandler, notFound } from './middleware/errorMiddleware';

const app = express();

connectDB();

app.use(express.json())

app.use('/v1/liakos', liakosRoutes);
// app.use('/v1/sensors', sensorsRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    logger.error(`Server is running on port ${PORT}`)
})
