import Herosection from "@/content/Home/HeroSection/Herosection"
import Popular from "@/content/Home/Popular";
import Trending from "@/content/Home/Trending";
import WatchHistory from "@/content/Home/WatchHistory";
import Collection from "@/content/Home/Collection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

const Home = async () => {
  const res = await fetch(`${API_BASE}/api`, {
    next: { revalidate: 3600 }
  });
  const json = await res.json();
  const homeData = json.results || {};

  return (
    <>
      <Herosection data={homeData} />

      <div className="w-full flex flex-col items-center z-10 relative main-responsive">
        <Trending data={homeData} />
        <WatchHistory />
        <Collection />
        <Popular />
      </div>

      {/* background */}
      <div className="fixed w-[138.33px] h-[82.25px] left-[1%] top-[2%] bg-[#92b7fc8f] blur-[200px]"></div>
      <div className="fixed w-[500px] h-[370.13px] right-[50%] bottom-[20%] bg-[#576683b4] blur-[215.03px] translate-x-[70%] z-0 rounded-full"></div>
    </>
  )
}

export default Home
