/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import Card from "@/components/Cards/Card/Card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Pagination from "./Pagination";
import Options from "./Options";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

const DiscoverMovies = () => {
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = "";

        if (search) {
          url = `${API_BASE}/api/search?keyword=${encodeURIComponent(search)}&page=${page}`;
        } else if (type === "tv") {
          url = `${API_BASE}/api/tv-show?page=${page}`;
        } else if (type === "movie") {
          url = `${API_BASE}/api/movie?page=${page}`;
        } else {
          // Default — top IMDB
          url = `${API_BASE}/api/top-imdb?page=${page}`;
        }

        const res = await fetch(url);
        const json = await res.json();
        const data = json.results?.data || [];
        const pages = json.results?.totalPages || json.results?.totalPage || 1;

        setMovies(data);
        setTotalPages(pages);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, type, page]);

  const loadingCards = useMemo(
    () => Array.from({ length: 40 }).map((_, index) => <Card key={index} index={index} loading />),
    []
  );

  return (
    <div className="w-full">
      <Options basePath="/discover" />

      <div className="w-full h-full grid grid-auto-fit gap-3">
        {loading
          ? loadingCards
          : movies?.map((item, index) => <Card data={item} key={index} />)
        }
        {(!loading && movies?.length < 6) &&
          Array.from({ length: 8 - movies?.length }).map((_, index) => (
            <Card key={index} index={index} hidden />
          ))
        }
      </div>

      <div className="mt-8"></div>
      {totalPages > 1 && (
        <Pagination pageInfo={{
          currentPage: page,
          lastPage: totalPages
        }} />
      )}
    </div>
  );
};

export default DiscoverMovies;
