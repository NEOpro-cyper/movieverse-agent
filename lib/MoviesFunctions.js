const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

// Trending Movies and TV
export const getTrendingMovies = async (type = "all", page = 1) => {
  try {
    const res = await fetch(`${API_BASE}/api`, {
      next: { revalidate: 3600 * 24 }
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();

    if (type === "movies") return { results: data.results?.trending?.movies || [] };
    if (type === "tv") return { results: data.results?.trending?.tvShows || [] };
    const movies = data.results?.trending?.movies || [];
    const tvShows = data.results?.trending?.tvShows || [];
    return { results: [...movies, ...tvShows] };
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
};

// Popular Movies (Latest Movies from home)
export const getPopularMovies = async (page = 1) => {
  try {
    const res = await fetch(`${API_BASE}/api/movie?page=${page}`, {
      next: { revalidate: 3600 * 24 }
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return {
      results: data.results?.data || [],
      total_pages: data.results?.totalPages || 1,
    };
  } catch (error) {
    console.error(error);
    return { results: [], total_pages: 1 };
  }
};

// Top Rated = Top IMDB
export const getTopRatedMovies = async (page = 1) => {
  try {
    const res = await fetch(`${API_BASE}/api/top-imdb?page=${page}`, {
      next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return {
      results: data.results?.data || [],
      total_pages: data.results?.totalPages || 1,
    };
  } catch (error) {
    console.error(error);
    return { results: [], total_pages: 1 };
  }
};

// Movie / TV Info
// id = movie/watch-wake-up-dead-man-a-knives-out-mystery-movies-free-138514
// or  tv/watch-the-madison-movies-free-147781
export const getInfoTMDB = async (id, media_type) => {
  try {
    if (!id) return null;
    const res = await fetch(`${API_BASE}/api/info?id=${id}`, {
      cache: "no-store"
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.data || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Recommendations = Related from info page
export const getRecommendation = async (id, type) => {
  try {
    if (!id) return { results: [] };
    const res = await fetch(`${API_BASE}/api/info?id=${id}`, {
      next: { revalidate: 21600 }
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    const related = data.results?.data?.related || [];
    if (related.length > 0) return { results: related };

    // fallback to trending
    return getTrendingMovies();
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
};

// Reviews — FlixHQ has no reviews, return empty
export const getReviews = async (id, type, page = 1) => {
  return {
    results: [],
    total_pages: 1,
    total_results: 0,
  };
};
