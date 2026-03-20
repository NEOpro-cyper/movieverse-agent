"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaSearch, FaSpinner, FaFilm, FaTv } from "react-icons/fa";
import Card from "@/components/Cards/Card/Card";
import ReactPaginate from "react-paginate";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flihq-api.vercel.app";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchValue, setSearchValue] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all"); // all, movies, tv

  // Search function
  const performSearch = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/search?keyword=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success && data.results?.data) {
        let filteredResults = data.results.data;

        // Apply filter
        if (filter === "movies") {
          filteredResults = filteredResults.filter(item => item.type === "movie");
        } else if (filter === "tv") {
          filteredResults = filteredResults.filter(item => item.type === "tv");
        }

        setResults(filteredResults);
        setTotalPages(data.results.totalPage || 1);
      } else {
        setResults([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    }
    setLoading(false);
  }, [filter]);

  // Search when query changes
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      performSearch(searchValue);
    }
  };

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    performSearch(searchValue, selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (searchValue.trim()) {
      performSearch(searchValue);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Search</h1>
        <p className="text-slate-400">Find your favorite movies and TV shows</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search movies, TV shows..."
            className="w-full pl-12 pr-4 py-4 bg-[#231f2c] border border-[#39374b] rounded-xl text-white 
                     text-lg placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-500 text-white 
                     rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "all", label: "All", icon: null },
          { id: "movies", label: "Movies", icon: FaFilm },
          { id: "tv", label: "TV Shows", icon: FaTv },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleFilterChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              filter === tab.id
                ? "bg-blue-500 text-white"
                : "bg-[#231f2c] text-slate-300 hover:bg-[#2d283a]"
            }`}
          >
            {tab.icon && <tab.icon className="text-sm" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : results.length === 0 && searchValue ? (
        <div className="text-center py-20">
          <FaSearch className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
          <p className="text-slate-400">Try a different search term</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <FaSearch className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Search for content</h3>
          <p className="text-slate-400">Enter a movie or TV show name to get started</p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <p className="text-slate-400 mb-4">
            Found {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{searchParams.get("q")}&quot;
          </p>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card data={item} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={"flex gap-1"}
                pageClassName={"px-3 py-2 rounded-lg bg-[#231f2c] text-white hover:bg-[#2d283a] cursor-pointer"}
                activeClassName={"bg-blue-500 hover:bg-blue-600"}
                previousClassName={"px-3 py-2 rounded-lg bg-[#231f2c] text-white hover:bg-[#2d283a] cursor-pointer"}
                nextClassName={"px-3 py-2 rounded-lg bg-[#231f2c] text-white hover:bg-[#2d283a] cursor-pointer"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
              />
            </div>
          )}
        </>
      )}

      {/* Background Effects */}
      <div className="fixed w-[138.33px] h-[82.25px] left-[1%] top-[2%] bg-[#92b7fc8f] blur-[200px] pointer-events-none"></div>
      <div className="fixed w-[500px] h-[370.13px] right-[50%] bottom-[20%] bg-[#576683b4] blur-[215.03px] translate-x-[70%] pointer-events-none"></div>
    </div>
  );
};

export default SearchPage;
