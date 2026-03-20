"use client";

import React, { useEffect, useState } from "react";
import { useWatchContext } from "@/context/Watch";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

const Server = () => {
  const { MovieId, setWatchInfo, watchInfo, MovieInfo, episode, episodes } = useWatchContext();
  const [servers, setServers] = useState([]);
  const [loadingServers, setLoadingServers] = useState(true);

  const numericId = MovieId?.split("-").pop();

  // Fetch servers when episode or type changes
  useEffect(() => {
    if (!MovieInfo || !numericId) return;

    const fetchServers = async () => {
      setLoadingServers(true);
      try {
        if (MovieInfo.type === "movie") {
          const res = await fetch(`${API_BASE}/api/servers/${numericId}?type=movie`);
          const json = await res.json();
          setServers(json.results || []);
        } else {
          const currentEp = episodes.find(ep => ep.episode_number === episode);
          if (currentEp?.episodeId) {
            const res = await fetch(`${API_BASE}/api/servers/${currentEp.episodeId}`);
            const json = await res.json();
            setServers(json.results || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch servers:", err);
        setServers([]);
      } finally {
        setLoadingServers(false);
      }
    };

    fetchServers();
  }, [MovieInfo, numericId, episode, episodes]);

  // Auto select preferred or first server
  useEffect(() => {
    if (!servers.length) return;
    const preferred = localStorage.getItem("preferredServer");
    const selected = servers.find(s => s.serverName === preferred) || servers[0];
    if (selected) fetchStream(selected);
  }, [servers]);

  const fetchStream = async (server) => {
    if (!server) return;
    setWatchInfo(prev => ({ ...prev, loading: true, url: null }));

    try {
      let streamId = server.dataId;

      if (MovieInfo.type === "tv") {
        const currentEp = episodes.find(ep => ep.episode_number === episode);
        if (currentEp?.episodeId) streamId = currentEp.episodeId;
      }

      const type = MovieInfo.type === "tv" ? "tv" : "movie";
      const res = await fetch(
        `${API_BASE}/api/stream?id=${streamId}&server=${encodeURIComponent(server.serverName)}&type=${type}`
      );
      const json = await res.json();
      const streamData = json.results?.streamingLink;
      
      setWatchInfo({
      url: streamData?.link?.file || null,
      loading: false,
      serverName: server.serverName,
      tracks: streamData?.tracks || [],
      iframe: streamData?.link?.file ? false : true,
    });

      localStorage.setItem("preferredServer", server.serverName);
    } catch (err) {
      console.error("Stream fetch error:", err);
      setWatchInfo(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="bg-[#323044] h-full w-full px-4 flex items-center gap-8 max-[880px]:py-2 max-[515px]:flex-col max-[515px]:gap-5">
        <div>Server</div>
        <div className="flex gap-2 flex-wrap max-[515px]:justify-center">
          {loadingServers ? (
            <div className="text-slate-400 text-sm">Loading servers...</div>
          ) : servers.length === 0 ? (
            <div className="text-slate-400 text-sm">No servers available</div>
          ) : (
            servers.map((server) => (
              <div
                key={server.serverName}
                onClick={() => fetchStream(server)}
                style={{
                  background: watchInfo?.serverName === server.serverName ? "#4a446c" : undefined,
                }}
                className="px-4 py-[6px] text-[15px] bg-[#413d57] hover:bg-[#4a446c] border border-[#5b5682] rounded-md cursor-pointer"
              >
                {server.serverName}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Server;
