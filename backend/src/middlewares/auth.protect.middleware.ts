import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the access token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    const accessToken = authHeader.split(" ")[1]; // Extract token after "Bearer "

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    // Attach user to request for further processing
    req.user = data.user;
    next(); // Allow access to the next middleware or route
  } catch (err) {
    console.error("Auth Error:", err);
    // res.status(500).json({ error: "Internal Server Error" });
    next(err);
  }
};
