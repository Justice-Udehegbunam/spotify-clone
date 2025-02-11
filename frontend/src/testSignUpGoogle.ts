import { supabase } from "./lib/supabase";

export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Google login error:", error.message);
  }
}
