import { NextFunction, Request, Response } from "express";

import User from "../lib/models/user.models";
import { supabase } from "../lib/supabase";

// Corrected SupabaseUser type
interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    firstName?: string;
    lastName?: string;
    avatar_url?: string;
    role?: string;
  };
}

export const authCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { access_token } = req.body; // Get the user's access token from the frontend

    // Verify the user using Supabase
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const supabaseUser = data.user as SupabaseUser;
    console.log(
      "Supabase User Metadata:",
      JSON.stringify(supabaseUser.user_metadata, null, 2)
    );
    console.log("Supabase User ID:", supabaseUser.id);

    // Debugging: Check what data we are getting

    // // Extract user metadata
    // //const { full_name, avatar_url } = user_metadata || {};
    // const nameParts = (full_name || "").split(" ");
    // const firstName = nameParts[0] || ""; // First word is first name
    // const lastName = nameParts.slice(1).join(" ") || ""; // Everything else is last name

    const queryId = supabaseUser.id;
    // console.log("Querying DB with supabaseId:", queryId);

    let existingUser = await User.findOne({ supabaseId: queryId });
    console.log("Existing User from DB:", existingUser);

    const allUsers = await User.find({});
    console.log("All Users in DB:", allUsers);

    if (!existingUser) {
      existingUser = new User({
        firstName: supabaseUser.user_metadata.firstName,
        lastName: supabaseUser.user_metadata.lastName,
        email: supabaseUser.email || "",
        imageUrl: supabaseUser.user_metadata.avatar_url || "",
        supabaseId: supabaseUser.id,
        role: supabaseUser.user_metadata.role || "user", // Set default role
      });
    }
    await existingUser.save();

    // console.log("Returning User:", existingUser);
    res.status(200).json(existingUser);
  } catch (error) {
    console.error(error);
    //  res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};
