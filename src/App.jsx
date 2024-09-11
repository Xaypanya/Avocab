import { useState, useEffect } from "react";
import HeaderBar from "./components/HeaderBar";
import WordCard from "./components/WordCard";
import { LAOS_FLAG, UK_FLAG } from "./constants";
import dictionary from "./assets/lang/dictionary.json";

import supabase from "./supabaseClient";
import ThreeDotLoading from "./components/ThreeDotLoading";

import Lottie from "lottie-react";
import emptyAnimation from "./assets/lottie/empty-animation.json";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEnglish, setIsEnglish] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage ? JSON.parse(savedLanguage) : true;
  });

  useEffect(() => {
    localStorage.setItem("language", JSON.stringify(isEnglish));
  }, [isEnglish]);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [words, setWords] = useState([]);

  const toggleFavorite = (id) => {
    setWords(
      words.map((word) =>
        word.id === id ? { ...word, favorite: !word.favorite } : word
      )
    );
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);

        // Perform search based on language and limit results to 10
        let query = supabase.from("words").select("*").limit(10);

        if (searchTerm) {
          if (isEnglish) {
            query = query.ilike("english", `%${searchTerm}%`);
          } else {
            query = query.ilike("lao", `%${searchTerm}%`);
          }
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setWords(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [searchTerm, isEnglish]);



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
        <div className="fixed top-14 right-6 space-x-2">
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
        </div>
        <div className="space-y-4 mt-4">
          {loading ? (
            <ThreeDotLoading />
          ) : words.length === 0 ? (
            <div className="flex flex-col space-y-4 justify-center items-center">
              <div className="h-64 w-64 ">
                <Lottie animationData={emptyAnimation} loop={true} />
              </div>
              <p className="text-gray-500 -translate-y-12"> {dictionary.words_not_found[isEnglish ? "en" : "la"]} </p>
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
