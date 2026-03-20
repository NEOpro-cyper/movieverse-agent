import EpisodeSelector from "@/content/watch/EpisodeSelector/EpisodeSelector"
import MainVideo from "@/content/watch/MainVideo/MainVideo"
import './watch.css'
import MovieInfos from "@/content/watch/MovieInfo/MovieInfo"
import { WatchAreaContextProvider } from "@/context/Watch"
import { WatchSettingContextProvider } from "@/context/WatchSetting"
import { Fragment } from "react"
import Comments from "@/content/watch/Comment/Comment"
import MovieComments from "@/components/Comments/MovieComments"
import Recommendation from "@/content/watch/Recommendation/Recommendation"
import MovieNotFound from "@/components/errors/MovieNotFound"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

const Watch = async ({ params, searchParams }) => {
  const { id: MovieId } = await params;
  const { media_type } = await searchParams;

  // id format: movie/watch-wake-up-dead-man-a-knives-out-mystery-movies-free-138514
  // or         tv/watch-the-madison-movies-free-147781
  const fullId = `${media_type}/${MovieId}`;

  let MovieInfo = null;

  try {
    const res = await fetch(`${API_BASE}/api/info?id=${fullId}`, {
      cache: "no-store"
    });
    const json = await res.json();
    MovieInfo = json.results?.data || null;
  } catch (e) {
    console.error(e);
  }

  if (!MovieInfo) {
    return <MovieNotFound />;
  }

  return (
    <Fragment>
      <div className="w-full flex flex-col items-center z-10 relative main-responsive top-[106px]">
        <div className="w-full max-w-[96rem]">
          <WatchSettingContextProvider>
            <WatchAreaContextProvider MovieInfo={MovieInfo} MovieId={MovieId}>
              <EpisodeSelector />
              <MainVideo />
            </WatchAreaContextProvider>
          </WatchSettingContextProvider>

          <div className="mt-20 flex gap-44">
            <MovieInfos info={MovieInfo} />
          </div>

          <div className="flex mb-5 gap-5 max-[1125px]:flex-col mt-24">
            <div className="flex-1 flex flex-col gap-5">
              <MovieComments movieId={MovieId} movieTitle={MovieInfo?.title} />
              <Comments MovieId={MovieId} type={MovieInfo?.type} />
            </div>
            <Recommendation MovieId={MovieId} type={MovieInfo?.type} />
          </div>
        </div>
      </div>

      <div className="fixed w-[138.33px] h-[82.25px] left-[1%] top-[2%] bg-[#92b7fc8f] blur-[200px]"></div>
      <div className="absolute max-[737px]:fixed w-[500px] h-[370.13px] right-[50%] bottom-[-25%] bg-[#576683b4] blur-[215.03px] translate-x-[70%] z-0 rounded-b-[30%]"></div>
    </Fragment>
  );
};

export default Watch;
