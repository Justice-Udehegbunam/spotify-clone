import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";
import { NextFunction, Request, Response } from "express";

import userRoutes from "./src/routes/user.route.ts";
import authRoutes from "./src/routes/auth.route.ts";
import adminRoutes from "./src/routes/admin.route.ts";
import songRoutes from "./src/routes/song.route.ts";
import albumRoutes from "./src/routes/album.route.ts";
import statRoutes from "./src/routes/stat.route.ts";
import deleteAllUsers from "./src/routes/delete.users.route.ts";
import { connectDB } from "./src/lib/db.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_ANON_KEY);

const __dirname = path.resolve();

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, //  this means 10mb max file size
    },
  })
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res
    .status(500)
    .json({
      message:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message,
    });
});

// This exposes all the APIs from SuperTokens to the client.
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/delete-users", deleteAllUsers);

// This endpoint can be accessed regardless of
// having a session with SuperTokens
app.get("/hello", async (_req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`API Server listening on port ${PORT}`);
  connectDB();
});
