import { supabase } from "./supabaseClient.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const auth = getAuth();
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadMovies();
  } else {
    alert("Please log in.");
    window.location.href = "signup.html";
  }
});

function loadMovies() {
  const API_KEY = "f207cd12";
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");

  document.getElementById("queryText").textContent = query;

  const grid = document.getElementById("grid");
  const status = document.getElementById("status");
  status.textContent = "Loading...";

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
    .then((res) => res.json())
    .then((data) => {
      status.remove();

      if (!data.Search || data.Search.length === 0) {
        grid.insertAdjacentHTML("beforebegin", "<p>No results found.</p>");
        return;
      }

      data.Search.forEach((m) => {
        const poster = m.Poster !== "N/A" ? m.Poster : "no-image.png";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img class="poster" src="${poster}" alt="Poster">
          <p>${m.Title}</p>
          <p>${m.Year}</p>
          <button class="watch-btn">To Watch</button>
          <button class="watch-btn">Watched</button>
        `;

        card.querySelectorAll(".watch-btn")[0].addEventListener("click", () =>
          addToWatchlist(m)
        );
        card.querySelectorAll(".watch-btn")[1].addEventListener("click", () =>
          addToWatched(m)
        );

        grid.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error fetching movies:", err);
      status.textContent = "Failed to load movies.";
    });
}

async function addToWatchlist(movie) {
  if (!currentUser) {
    alert("Please log in.");
    return;
  }

  const { error } = await supabase.from("watchlist").insert([
    {
      user_id: currentUser.uid,
      movie_id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    },
  ]);

  if (error) {
    console.error("Error adding to watchlist:", error.message);
    alert("Failed to add to watchlist.");
  } else {
    alert("Movie added to watchlist!");
  }
}

async function addToWatched(movie) {
  if (!currentUser) {
    alert("Please log in.");
    return;
  }

  const { error } = await supabase.from("watched").insert([
    {
      user_id: currentUser.uid,
      movie_id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    },
  ]);

  if (error) {
    console.error("Error adding to watched list:", error.message);
    alert("Failed to add to watched list.");
  } else {
    alert("Movie added to watched list!");
  }
}

