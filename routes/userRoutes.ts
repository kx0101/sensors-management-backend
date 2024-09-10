import express from 'express';
import {
    login,
    admin,
} from '../controllers/usersController'
import { protect } from '../middleware/authMiddleware';

export const router = express.Router();

router.route("/login").post(login)
router.route("/admin").get(protect, admin)
