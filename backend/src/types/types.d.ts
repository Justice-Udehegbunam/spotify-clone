import { User } from "@supabase/supabase-js"; // Import the Supabase user type

declare module "express" {
  export interface Request {
    user?: User; // Add user property to Request
  }
}
//  this fixes the req.user error
