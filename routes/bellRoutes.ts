import express from "express";
import { testBell } from "../controllers/bellsController";

export const router = express.Router();

router.route("/test-bell").post(testBell);
