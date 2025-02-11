import { Router } from "express";
import { requireAuth } from "src/middlewares/auth.protect.middleware";
import { getAllUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", requireAuth, getAllUsers);

export default router;
