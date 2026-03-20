"use client"
import Image from "next/image"
import Link from "next/link"

const MovieInfo = ({ info }) => {
  // info from FlixHQ API:
  // { id, type, title, poster, banner, description, quality, imdb, duration, 
  //   country, genres, released, production, cast, related }

  const type = info?.type || "movie";
  const poster = info?.poster;

  return (
    <div className="text-white flex gap-6">
      {poster && (
        <Image
          src={poster}
          alt={info?.title || "Poster"}
          width={215}
          height={300}
          className="rounded-2xl object-cover h-80 w-[16rem] max-[840px]:h-[14rem] max-[380px]:h-[9rem]"
        />
      )}

      <div className="mt-2">
        <h1 className="text-2xl font-['poppins'] font-medium max-[840px]:text-[22px] max-[380px]:text-[19px]">
          {info?.title || ""}
        </h1>

        <div className="flex gap-2 mt-1 mb-2">
          {info?.quality && (
            <span className="bg-[#727587] text-[13px] px-1 rounded-[4px] text-slate-900 font-medium">
              {info.quality}
            </span>
          )}
        </div>

        <p className="text-[15px] font-['poppins'] text-[#fff4f4b1] overflow-hidden text-ellipsis line-clamp-4 mb-2">
          {info?.description}
        </p>

        <div className="flex gap-32 justify-between max-[960px]:flex-col max-[960px]:gap-0">
          <div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Type: <span className="text-[#e26bbcd9]">
                {type === "tv" ? "TV Show" : "Movie"}
              </span>
            </div>

            {info?.country?.length > 0 && (
              <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
                Country: <span className="text-[#e26bbcd9]">
                  {info.country.join(", ")}
                </span>
              </div>
            )}

            {info?.released && (
              <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
                Released: <span className="text-[#e26bbcd9]">
                  {info.released}
                </span>
              </div>
            )}

            {info?.duration && (
              <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
                Duration: <span className="text-[#e26bbcd9]">
                  {info.duration}
                </span>
              </div>
            )}
          </div>

          <div>
            {info?.genres?.length > 0 && (
              <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
                Genres: <span className="text-[#e26bbcd9]">
                  {info.genres.join(", ")}
                </span>
              </div>
            )}

            {info?.imdb && (
              <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
                IMDB: <span className="text-[#e26bbcd9]">{info.imdb}</span>
              </div>
            )}

            {info?.production?.length > 0 && (
              <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
                Production: <span className="text-[#e26bbcd9]">
                  {info.production.join(", ")}
                </span>
              </div>
            )}

            {info?.cast?.length > 0 && (
              <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
                Cast: <span className="text-[#e26bbcd9]">
                  {info.cast.slice(0, 5).map((c, i) => (
                    <span key={i}>
                      {c.name}{i < Math.min(info.cast.length, 5) - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
