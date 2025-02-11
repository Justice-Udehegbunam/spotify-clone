import { Router } from "express";
import { requireAdmin } from "../middlewares/admin.auth.protect.middleware";
import {
  createSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  checkAdmin,
} from "../controllers/admin.controller";
const router = Router();

// instead of putting it every where
router.use(requireAdmin);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/song/:id", deleteSong);

router.post("/album", createAlbum);
router.delete("/album/:id", deleteAlbum);

export default router;
