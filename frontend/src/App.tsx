import { Button } from "./components/ui/button";
import { useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (type: string) => {
    setLoading(true);
    setError("");

    console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("VITE_SUPABASE_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

    try {
      let { data, error } =
        type === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email || "" });
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      setError("An unexpected error occured");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      let { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      setError("An unexpected error occured");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          {user ? (
            <div>
              <p className="text-lg font-semibold">
                Welcome, {user.email || "User"}!
              </p>
              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4">
                Supabase Auth
              </h2>
              {error && <p className="text-red-500">{error}</p>}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <button
                onClick={() => handleAuth("signup")}
                className="w-full bg-blue-500 text-white py-2 rounded mb-2 hover:bg-blue-600"
                disabled={loading}
              >
                Sign Up
              </button>
              <button
                onClick={() => handleAuth("login")}
                className="w-full bg-green-500 text-white py-2 rounded mb-2 hover:bg-green-600"
                disabled={loading}
              >
                Login
              </button>
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
                disabled={loading}
              >
                Sign in with Google
              </button>
            </>
          )}
        </div>
      </div>
      <Button variant="outline">Shadcn</Button>
    </>
  );
}

export default App;
