import { useCallback, useEffect, useMemo, useState } from "react";
import { useWatchContext } from "@/context/Watch";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";

const EpisodeCard = ({ info, currentEp, loading, watchedEP, currentSn }) => {
  const { season } = useWatchContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const episodeNumber = info?.episode_number;
  const seasonNumber = info?.season_number;

  const updateParamsInUrl = useCallback(
    (seasonNumber, episodeNumber) => {
      const updatedParams = new URLSearchParams(searchParams.toString());
      if (seasonNumber) updatedParams.set("se", seasonNumber);
      else updatedParams.delete("se");
      if (episodeNumber) updatedParams.set("ep", episodeNumber);
      else updatedParams.delete("ep");
      router.push(
        `${window.location.pathname}?${updatedParams.toString()}`,
        { scroll: false }
      );
    },
    [router, searchParams]
  );

  const handleClick = useCallback(() => {
    if (!episodeNumber || !seasonNumber) return;
    updateParamsInUrl(seasonNumber, episodeNumber);
  }, [episodeNumber, seasonNumber, updateParamsInUrl]);

  const isCurrentEpisode = useMemo(
    () => currentEp === episodeNumber && currentSn === seasonNumber,
    [currentEp, episodeNumber, currentSn, seasonNumber]
  );

  const isWatched = useMemo(
    () => watchedEP?.includes(episodeNumber),
    [watchedEP, episodeNumber]
  );

  if (loading) {
    return (
      <div className="flex py-2 h-[96px] my-[3px] border-2 border-[#21232e] rounded-md bg-[#242430] cursor-pointer group relative">
        <div className="absolute bottom-1/2 translate-y-1/2 flex gap-3 w-full">
          <div className="h-[80px] min-w-[150px] bg-[#48455f] rounded-md"></div>
          <div className="w-full flex flex-col gap-3">
            <div className="h-4 w-full bg-[#48465e] rounded-sm"></div>
            <div className="h-6 w-full bg-[#48465e] rounded-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex gap-3 py-2 px-2 border-2 border-[#21232e] rounded-md cursor-pointer my-[3px]",
        {
          "bg-[#333345]": isCurrentEpisode,
          "bg-[#1f1f28]": !isCurrentEpisode && !isWatched,
          "bg-[#2a2a38] hover:bg-[#1c1c26]": isWatched,
          "hover:bg-[#242430]": !isCurrentEpisode,
        }
      )}
      onClick={handleClick}
    >
      <div className="w-full">
        <div className="text-slate-200 line-clamp-2 text-sm">
          {info?.name || info?.title || "No title available"}
        </div>
        <div className="text-[#ffffffa3] text-[14px]">
          Season {seasonNumber} · Episode {episodeNumber}
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;
