import { auth } from "../../firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { supabase } from "./supabaseClient.js";


const signOutBtn = document.getElementById("signOutBtn");
if (signOutBtn) {
  signOutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      window.location.href = "signup.html";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  });
}

async function addToWatchlist(userId, movie) {
  try {
    const { error } = await supabase
      .from("watchlist") 
      .insert([
        {
          user_id: userId,
          movie_id: movie.imdbID,
          title: movie.Title,
          year: movie.Year,
          poster: movie.Poster,
        },
      ]);

    if (error) throw error;
    console.log("Movie added to watchlist");
  } catch (err) {
    console.error("Error adding movie:", err.message);
  }
}

async function getWatchedList(userId) {
  try {
    const { data, error } = await supabase
      .from("watched")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching watched list:", err.message);
    return [];
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.uid);
    getWatchedList(user.uid).then((list) => console.log(list));
  } else {
    console.log("No user signed in");
    window.location.href = "signup.html";
  }
});

export { addToWatchlist, getWatchedList };

