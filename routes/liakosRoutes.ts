import express from 'express';
import {
    liakos
} from '../controllers/liakosController'

export const router = express.Router();

router.route("/hi").get(liakos)
