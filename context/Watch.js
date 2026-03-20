'use client';

import { saveWatchProgress } from '@/utils/ProgressHandler';
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useUserInfoContext } from './UserInfoContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

export const WatchAreaContext = createContext(null);

export function WatchAreaContextProvider({ children, MovieInfo, MovieId }) {
  const searchparam = useSearchParams();
  const { userInfo, isUserLoggedIn } = useUserInfoContext();

  const [episode, setEpisode] = useState(() => parseInt(searchparam.get('ep')) || 1);
  const [season, setSeason] = useState(() => parseInt(searchparam.get('se')) || 1);
  const [episodes, setEpisodes] = useState([]);
  const [episodeLoading, setEpisodeLoading] = useState(true);
  const [watchInfo, setWatchInfo] = useState({ loading: true });
  const [allSeasons, setAllSeasons] = useState([]);

  // Sync with URL params
  useEffect(() => {
    const ep = parseInt(searchparam.get('ep')) || 1;
    const se = parseInt(searchparam.get('se')) || 1;
    setEpisode(ep);
    setSeason(se);
  }, [searchparam]);

  // Fetch episodes
  useEffect(() => {
    if (!MovieInfo) return;
    setEpisodeLoading(true);

    if (MovieInfo.type !== 'tv') {
      // Movie — single episode
      setEpisodes([{
        episodeId: null, // will be set from movie servers
        episode_no: 1,
        title: MovieInfo.title,
        season_number: 1,
        episode_number: 1,
      }]);
      setEpisodeLoading(false);
      return;
    }

    // TV Show — fetch seasons and episodes
    const fetchEpisodes = async () => {
      try {
        const type = MovieInfo.type || "tv";
        const res = await fetch(`${API_BASE}/api/episodes/${MovieId}?type=${type}`);
        const json = await res.json();
        const data = json.results;

        if (!data?.seasons?.length) {
          toast('No episodes found');
          setEpisodes([]);
          return;
        }

        setAllSeasons(data.seasons);

        // Get episodes for current season
        const currentSeason = data.seasons[season - 1] || data.seasons[0];
        if (currentSeason?.episodes?.length) {
          // Normalize to expected format
          const normalized = currentSeason.episodes.map((ep, i) => ({
            episodeId: ep.episodeId,
            episode_no: ep.episode_no || i + 1,
            episode_number: ep.episode_no || i + 1,
            season_number: season,
            title: ep.title,
            name: ep.title,
          }));
          setEpisodes(normalized);
        } else {
          setEpisodes([]);
        }
      } catch (err) {
        console.error(err);
        toast('Failed to fetch episodes');
      } finally {
        setEpisodeLoading(false);
      }
    };

    fetchEpisodes();
  }, [MovieInfo, MovieId, season]);

  // Save progress - now includes user ID for Firebase storage
  useEffect(() => {
    if (episodes.length && MovieInfo) {
      const uid = isUserLoggedIn ? userInfo?.uid : null;
      saveWatchProgress(MovieInfo, episodes, episode, season, uid);
    }
  }, [episode, season, episodes, MovieInfo, isUserLoggedIn, userInfo?.uid]);

  const contextValue = useMemo(() => ({
    episode,
    setEpisode,
    season,
    setSeason,
    episodes,
    allSeasons,
    watchInfo,
    setWatchInfo,
    episodeLoading,
    MovieInfo,
    MovieId,
  }), [
    episode,
    season,
    episodes,
    allSeasons,
    watchInfo,
    episodeLoading,
    MovieInfo,
    MovieId,
  ]);

  return (
    <WatchAreaContext.Provider value={contextValue}>
      {children}
    </WatchAreaContext.Provider>
  );
}

export function useWatchContext() {
  const ctx = useContext(WatchAreaContext);
  if (!ctx) throw new Error('useWatchContext must be used inside WatchAreaContextProvider');
  return ctx;
}
