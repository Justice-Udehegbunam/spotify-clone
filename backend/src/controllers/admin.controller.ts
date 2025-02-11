import { NextFunction, Request, Response } from "express";
import Song from "../lib/models/song.model";
import Album from "../lib/models/album.model";
import cloudinary from "../lib/cloudinary";

// what type is file param
const uploadToCloudinary = async (file: any) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadCloudinary", error);
    throw new Error("Error uploading to cloudinary!");
  }
};

export const createSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || req.files.audioFile || req.files.imageFile)
      return res.status(400).json({ message: "Please upload all files" });

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile as any;
    const imageFile = req.files.imageFile as any;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      imageUrl,
      audioUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    //  if song belongs to an album update the albums songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });

      res.status(201).json(song);
    }
  } catch (error) {
    console.log("Error in creating song", error);
    next(error);
  }
};

export const deleteSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);
    if (song?.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }
    await Song.findByIdAndDelete(id);
  } catch (error) {
    console.log("Error in deleteSong!", error);
    next(error);
  }
};

export const createAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const imageFile = req.files! as any;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });
    await album.save();

    res.status(200).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

export const deleteAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Successfully deleted the album" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ admin: true });
  } catch (error) {
    console.log("Error in checkAdmin", error);
    next(error);
  }
};
