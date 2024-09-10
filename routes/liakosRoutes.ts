import express from 'express';
import {
    login,
    admin,
} from '../controllers/liakosController'
import { protect } from '../middleware/authMiddleware';

export const router = express.Router();

router.route("/hi").post(login)
router.route("/admin").get(protect, admin)
