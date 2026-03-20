"use client"
import Image from "next/image"
import styles from "./TrendingCard.module.css"
import { FaStar } from "react-icons/fa";
import Link from "next/link";

const TrendingCard = ({ info }) => {
  // info from FlixHQ API:
  // { id, type, poster, title, year, duration, season, episodes }
  const poster = info?.poster || "https://s4.anilist.co/file/anilistcdn/character/large/default.jpg";
  const title = info?.title || "";
  const type = info?.type || "movie";
  const year = info?.year || "";
  const duration = info?.duration || "";

  return (
    <Link
      href={`/watch/${info?.id}?media_type=${type}`}
      className={`${styles?.cardImage} w-full aspect-[9/14] rounded-2xl relative overflow-hidden cursor-pointer group`}
    >
      <Image
        src={poster}
        alt={title}
        width={200}
        height={280}
        quality={100}
        className="object-cover w-full h-full rounded-2xl hover:cursor-pointer"
      />

      <div className={`${styles.rating} absolute top-0 left-0 bg-[#21212c] w-[60%] rounded-br-lg rounded-tl-md flex items-center justify-center gap-2 text-white h-10`}>
        <FaStar />
        <span>{year}</span>
      </div>

      <div className="absolute bottom-0 left-0 pl-[8px] pb-2 z-10 opacity-100 group-hover:opacity-0 transition">
        <h1 className="text-[#ffffffd1] font-medium text-md font-['poppins'] w-[186px] line-clamp-1 text-ellipsis overflow-hidden cursor-pointer">
          {title}
        </h1>
        <span className="text-[#ffffffb0] text-sm">
          {type === "tv" ? "TV Show" : "Movie"}
          {duration ? `, ${duration}` : ""}
        </span>
      </div>

    </Link>
  )
}

export default TrendingCard
