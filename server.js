import "dotenv/config";  // load environment variables

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Supabase client (server-side, secure)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// --- API Routes ---
app.post("/api/watchlist", async (req, res) => {
  const { userId, movie } = req.body;
  try {
    const { error } = await supabase.from("watchlist").insert([
      {
        user_id: userId,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
      },
    ]);
    if (error) throw error;
    res.json({ success: true, message: "Movie added to watchlist" });
  } catch (error) {
    console.error("Error adding to watchlist:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/watched", async (req, res) => {
  const { userId, movie } = req.body;
  try {
    const { error } = await supabase.from("watched").insert([
      {
        user_id: userId,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
      },
    ]);
    if (error) throw error;
    res.json({ success: true, message: "Movie added to watched list" });
  } catch (error) {
    console.error("Error adding to watched:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/watchlist", async (req, res) => {
  const userId = req.query.userId;
  try {
    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    res.json({ success: true, movies: data });
  } catch (error) {
    console.error("Error fetching watchlist:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/watched", async (req, res) => {
  const userId = req.query.userId;
  try {
    const { data, error } = await supabase
      .from("watched")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    res.json({ success: true, movies: data });
  } catch (error) {
    console.error("Error fetching watched:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

