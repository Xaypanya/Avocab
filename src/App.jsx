import { useState, useEffect } from "react";
import HeaderBar from "./components/HeaderBar";
import WordCard from "./components/WordCard";
import { LAOS_FLAG, UK_FLAG } from "./constants";

import supabase from "./supabaseClient";

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
  const [words, setWords] = useState();

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
        const { data, error } = await supabase.from("words").select("*");

        if (error) {
          throw error;
        }

        console.log("words", data);

        setWords(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const filteredWords = words
    ? words?.filter((word) =>
        isEnglish
          ? word.english.toLowerCase().includes(searchTerm.toLowerCase())
          : word.lao.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
        isLoading = {JSON.stringify(loading)}
        <br />
        words = {JSON.stringify(words)}
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
          {filteredWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              toggleFavorite={() => toggleFavorite(word.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
