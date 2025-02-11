import { supabase } from "../lib/supabaseAdmin";
import { Request, Response } from "express";
import User from "../lib/models/user.models";

import { Router } from "express";

const router = Router();

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return res
        .status(500)
        .json({ error: "Error fetching users", details: error });
    }

    if (data?.users && Array.isArray(data.users) && data.users.length > 0) {
      for (const user of data.users) {
        await User.deleteOne({ supabaseId: user.id }); // Assuming `supabaseId` is stored in your MongoDB model
        console.log(`Deleted MongoDB user: ${user.email}`);

        await supabase.auth.admin.deleteUser(user.id);
        console.log(`Deleted user: ${user.email}`);
      }

      return res.json({ message: "All users deleted successfully" });
    } else {
      return res.json({ message: "No users found" });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
});

export default router;
