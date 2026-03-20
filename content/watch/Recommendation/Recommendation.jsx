import HorizontalCard from "@/components/Cards/HorizontalCard/HorizontalCard"
import { Fragment } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

const Recommendation = async ({ MovieId, type }) => {
  let related = [];

  try {
    const fullId = `${type}/${MovieId}`;
    const res = await fetch(`${API_BASE}/api/info?id=${fullId}`, {
      next: { revalidate: 21600 }
    });
    const json = await res.json();
    related = json.results?.data?.related || [];
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="w-full min-[1125px]:max-w-[24rem]">
      <div className="text-[#ffffffe0] text-[18px] font-medium font-['poppins'] mb-4">
        You May Also Like
      </div>

      <div className="w-full flex flex-col gap-3 max-[1125px]:grid max-[1125px]:grid-cols-[repeat(auto-fit,minmax(306px,1fr))]">
        {related.slice(0, 5).map((item, index) => (
          <Fragment key={index}>
            <HorizontalCard data={item} />
          </Fragment>
        ))}
        {related.length === 0 && (
          <p className="text-slate-400 text-sm">No recommendations found</p>
        )}
      </div>
    </div>
  );
};

export default Recommendation;
