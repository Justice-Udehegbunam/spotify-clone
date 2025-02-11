import { Router } from "express";
import { getAllAlbums, getSingleAlbum } from "../controllers/album.controller";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumid", getSingleAlbum);

export default router;
