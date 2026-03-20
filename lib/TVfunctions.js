const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

// Get episodes for a TV show
// id = full slug e.g. watch-the-madison-movies-free-147781
export const getEpisodes = async (id, season) => {
  try {
    const res = await fetch(`${API_BASE}/api/episodes/${id}`, {
      cache: "no-cache"
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    const allSeasons = data.results?.seasons || [];

    // If season requested, return that season's episodes
    if (season && allSeasons.length > 0) {
      const seasonData = allSeasons[season - 1] || allSeasons[0];
      return {
        episodes: seasonData?.episodes || [],
        seasonName: seasonData?.seasonName || `Season ${season}`,
      };
    }

    return data.results;
  } catch (error) {
    console.error(error);
    return { episodes: [] };
  }
};

// Get servers for a TV episode
export const getServers = async (episodeId) => {
  try {
    const res = await fetch(`${API_BASE}/api/servers/${episodeId}`, {
      cache: "no-cache"
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Get stream URL for a TV episode
export const getStream = async (episodeId, server = "UpCloud", type = "tv") => {
  try {
    const res = await fetch(
      `${API_BASE}/api/stream?id=${episodeId}&server=${server}&type=${type}`,
      { cache: "no-cache" }
    );
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return data.results?.streamingLink || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
