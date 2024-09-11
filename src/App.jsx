import { useState, useEffect, useCallback } from "react";
import HeaderBar from "./components/HeaderBar";
import WordCard from "./components/WordCard";
import { LAOS_FLAG, UK_FLAG, PAGE_LIMIT, GITHUB_ICON } from "./constants";
import dictionary from "./assets/lang/dictionary.json";
import supabase from "./supabaseClient";
import ThreeDotLoading from "./components/ThreeDotLoading";
import Lottie from "lottie-react";
import emptyAnimation from "./assets/lottie/empty-animation.json";

function App() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isEnglish, setIsEnglish] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage ? JSON.parse(savedLanguage) : true;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch words from Supabase
  const fetchWords = useCallback(async () => {
    if (!hasMore) return; // No more data to fetch

    try {
      setLoading(page === 1); // Show loading animation only on initial load
      setLoadingMore(page !== 1); // Show loading animation for additional data

      let query = supabase
        .from("words")
        .select("*")
        .limit(PAGE_LIMIT)
        .range((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT - 1);

      if (searchTerm) {
        query = isEnglish
          ? query.ilike("english", `%${searchTerm}%`)
          : query.ilike("lao", `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data.length < PAGE_LIMIT) setHasMore(false); // No more data to load

      setWords((prevWords) => (page === 1 ? data : [...prevWords, ...data]));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchTerm, isEnglish, page, hasMore]);

  // Call fetchWords on initial load
  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  // Reset state when searchTerm changes
  useEffect(() => {
    setPage(1);
    setWords([]);
    setHasMore(true);
  }, [searchTerm]);

  // Handle infinite scrolling
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
      if (!loading && !loadingMore && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Toggle language
  const toggleLanguage = () => setIsEnglish((prev) => !prev);

  // Navigate to GitHub
  const goToGithub = () => window.open("https://github.com/Xaypanya/Avocab", "_blank");

  return (
    <div
      className="min-w-screen min-h-screen py-10"
      style={{
        backgroundImage: `
          linear-gradient(#d1d5db 1px, transparent 1px),
          linear-gradient(90deg, #d1d5db 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <div className="w-5/6 md:3/6 lg:w-2/4 xl:w-1/4 2xl:1/4 mx-auto">
        <HeaderBar isEnglish={isEnglish} setSearchTerm={setSearchTerm} />
        <div className="fixed flex flex-col top-14 right-6 space-y-2">
          <button
            onClick={toggleLanguage}
            className="border-black flex items-center justify-center border-2 rounded-full hover:bg-gray-200 active:bg-gray-300 w-8 h-8"
          >
            <img
              src={isEnglish ? UK_FLAG : LAOS_FLAG}
              alt={isEnglish ? "UK flag" : "Laos flag"}
              className="w-6 h-6"
            />
          </button>
          <button
            onClick={goToGithub}
            className="border-black flex items-center justify-center border-2 rounded-full hover:bg-gray-200 active:bg-gray-300 w-8 h-8"
          >
            <img
              src={GITHUB_ICON}
              className="w-6 h-6"
              alt="GitHub Icon"
            />
          </button>
        </div>
        <div className="space-y-4 mt-4">
          {loading && page === 1 && <ThreeDotLoading />}
          {loadingMore && page !== 1 && (
            <div className="flex justify-center items-center py-4">
              <ThreeDotLoading />
            </div>
          )}
          {words.length === 0 && !loading && !loadingMore ? (
            <div className="flex flex-col space-y-4 justify-center items-center">
              <div className="h-64 w-64">
                <Lottie animationData={emptyAnimation} loop={true} />
              </div>
              <p className="text-gray-500 -translate-y-12">
                {dictionary.words_not_found[isEnglish ? "en" : "la"]}
              </p>
            </div>
          ) : (
            words.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                toggleFavorite={() => toggleFavorite(word.id)}
              />
            ))
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
