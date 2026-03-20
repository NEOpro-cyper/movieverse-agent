const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

// Multi search — searches both movies and TV
export const getMultiSearch = async (query, page = 1) => {
  try {
    const res = await fetch(
      `${API_BASE}/api/search?keyword=${encodeURIComponent(query)}&page=${page}`,
      { cache: "no-cache" }
    );
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return {
      results: data.results?.data || [],
      total_pages: data.results?.totalPage || 1,
    };
  } catch (error) {
    console.error(error);
    return { results: [], total_pages: 1 };
  }
};

// Single search
export const getSearch = async (query, page = 1, isAdult = false, type = "movie") => {
  try {
    const res = await fetch(
      `${API_BASE}/api/search?keyword=${encodeURIComponent(query)}&page=${page}`,
      { cache: "no-cache" }
    );
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return {
      results: data.results?.data || [],
      total_pages: data.results?.totalPage || 1,
    };
  } catch (error) {
    console.error(error);
    return { results: [], total_pages: 1 };
  }
};
