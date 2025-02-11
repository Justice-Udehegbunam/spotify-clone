import { Request, Response, NextFunction } from "express";
import Album from "src/lib/models/album.model";

export const getAllAlbums = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const albums = await Album.find();

    res.status(200).json(albums);
  } catch (error) {
    console.log("Error in getAllAlbums", error);
    next(error);
  }
};

export const getSingleAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { albumId } = req.params;

    // populate function is used to relate two tables provided that the value is relatable in the model.
    const album = await Album.findById(albumId).populate("songs");

    if (!album) {
      return res.status(404).json({ message: "Album not found!" });
    }

    res.status(200).json(album);
  } catch (error) {
    console.log("Error in getSingleAlbum", error);
    next(error);
  }
};
