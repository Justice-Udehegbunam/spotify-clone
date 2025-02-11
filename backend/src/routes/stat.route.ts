import { Router } from "express";
import { statController } from "../controllers/stat.controller";
import { requireAdmin } from "src/middlewares/admin.auth.protect.middleware";

const router = Router();

router.get("/", requireAdmin, statController);

export default router;
