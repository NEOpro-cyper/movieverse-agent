"use client";

import { useEffect, useState } from "react";
import ContinueWatchingCard from "@/components/Cards/ContinueWatchingCard/ContinueWatchingCard";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import { getWatchProgress, getWatchProgressFromDB } from "@/utils/ProgressHandler";
import { useUserInfoContext } from "@/context/UserInfoContext";
import Link from "next/link";

const WatchHistory = () => {
  const { userInfo, isUserLoggedIn, loading } = useUserInfoContext();
  const [mappedData, setMappedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (isUserLoggedIn && userInfo?.id) {
        // Fetch from database for logged-in users
        try {
          const dbData = await getWatchProgressFromDB(userInfo.id, 10);
          if (dbData.length > 0) {
            setMappedData(dbData);
          } else {
            // Fallback to localStorage if no database data
            const localData = getWatchProgress(true, 1, 10);
            setMappedData(localData);
          }
        } catch (error) {
          console.error('Error fetching watch progress:', error);
          const localData = getWatchProgress(true, 1, 10);
          setMappedData(localData);
        }
      } else {
        // Use localStorage for non-logged-in users
        const localData = getWatchProgress(true, 1, 10);
        setMappedData(localData);
      }

      setIsLoading(false);
    };

    if (!loading) {
      fetchData();
    }
  }, [isUserLoggedIn, userInfo?.id, loading]);

  if (mappedData.length < 1 && !isLoading) return null;

  return (
    <div className="w-full max-w-[96rem] relative mx-5">
      <div className="flex justify-between">
        <h1 className="text-[#f6f4f4ea] font-medium text-2xl font-['poppins'] max-[450px]:text-[1.2rem]">| Continue Watching</h1>

        <Link href={`/continue-watching`} className="text-[#ffffffbd] flex items-center gap-1 cursor-pointer hover:text-slate-500 transition">See All <FaArrowRight /></Link>
      </div>

      <div className="mt-8 mb-24 grid grid-cols-[repeat(auto-fit,minmax(343px,1fr))] max-[725px]:grid-cols-[repeat(auto-fit,minmax(285px,1fr))] gap-3">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-xl bg-[#22212c] animate-pulse" />
          ))
        ) : (
          <>
            {mappedData.slice(0, 10).map(data => (
              <ContinueWatchingCard key={data.id} data={data} />
            ))}

            {(mappedData?.length < 4) ? Array.from({ length: 4 - mappedData?.length }).map((i, _) => <ContinueWatchingCard key={_} hidden />) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
