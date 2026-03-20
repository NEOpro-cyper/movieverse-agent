"use client";

import { useWatchContext } from "@/context/Watch";
import EpInfo from "./EpInfo";
import Option from "./Option"
import Server from "./Server";
import { useUserInfoContext } from "@/context/UserInfoContext";
import { useWatchSettingContext } from "@/context/WatchSetting";
import { AnimatePresence, motion } from "framer-motion"
import JWPlayer from "@/components/HSLplayer";
import { useEffect, useState } from "react";

const MainVideo = () => {
  const { MovieInfo, watchInfo, episode } = useWatchContext();
  const { watchSetting, setWatchSetting } = useWatchSettingContext();
  const { userInfo, isUserLoggedIn } = useUserInfoContext();
  const [isMovieExists, setIsMovieExists] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!isUserLoggedIn || !MovieInfo?.id) return;
      
      try {
        const res = await fetch('/api/watchlist');
        const data = await res.json();
        const isInList = data.watchlist?.some(item => item.movieId === MovieInfo.id);
        setIsMovieExists(isInList);
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };
    
    checkWatchlist();
  }, [isUserLoggedIn, MovieInfo?.id]);

  return (
    <div className="w-full bg-[#22212c] rounded-md p-2 !pb-0 flex flex-col">

      {watchInfo?.loading ? (
        <div className="aspect-video bg-[#1a1a24] flex items-center justify-center text-slate-400 text-sm">
          Loading stream...
        </div>
      ) : watchInfo?.url ? (
        <JWPlayer
          src={watchInfo.url}
          tracks={watchInfo.tracks || []}
          title={MovieInfo?.title || ""}
        />
      ) : (
        <div className="aspect-video bg-[#1a1a24] flex items-center justify-center text-slate-400 text-sm">
          No stream available. Try another server.
        </div>
      )}

      <Option isMovieExists={isMovieExists} />

      <div className="h-full min-h-[124px] bg-[#484460] text-slate-100 flex rounded-md overflow-hidden mt-4 shadow-[3px_13px_29px_0px_#48455fbd] max-[880px]:flex-col">
        <EpInfo episode={episode} />
        <Server />
      </div>

      <AnimatePresence>
        {watchSetting?.light ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full z-20 bg-[#000000e5]"
            onClick={() => setWatchSetting(prev => ({ ...prev, light: false }))}
          ></motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default MainVideo;
