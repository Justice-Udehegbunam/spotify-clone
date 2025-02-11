import { Request, Response, NextFunction } from "express";
import Song from "../lib/models/song.model";

export const getAllSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // this tells it to sort by the newest first
    const songs = await Song.find({ createdAt: -1 });

    if (!songs || songs.length === 0) {
      return res.status(200).json({ message: "No songs in the database!" });
    }

    res.status(200).json({ message: {} });
  } catch (error) {
    console.log("Error in getAllAlbums", error);
    next(error);
  }
};

export const getFeaturedSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //  fetch 6 random songs using mongodb aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    console.log("Error in getFeaturedSongs", error);
    next(error);
  }
};

export const getMadeForYouSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    console.log("Error in getMadeForYouSongs", error);
    next(error);
  }
};

export const getTrendingSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    console.log("Error in getTrendingSongs", error);
    next(error);
  }
};
