import { Router } from "express";

import { authCallback } from "../middlewares/auth.middleware";

const router = Router();

router.post("/callback", authCallback);

export default router;
