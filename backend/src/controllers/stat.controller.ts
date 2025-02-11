import { NextFunction, Request, Response } from "express";
import Song from "../lib/models/song.model";
import Album from "../lib/models/album.model";
import User from "src/lib/models/user.models";

export const statController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, uniqueArtist] =
      await Promise.all([
        Song.countDocuments(),
        Album.countDocuments(),
        User.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    res.status(200).json({
      totalSongs,
      totalAlbums,
      totalUsers,
      totalArtist: uniqueArtist.length || 0,
    });
  } catch (error) {
    console.error("Error in statController", error);
    //  res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};
