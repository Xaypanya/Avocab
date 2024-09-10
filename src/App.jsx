import { useState, useEffect } from "react";
import HeaderBar from "./components/HeaderBar";
import WordCard from "./components/WordCard";
import { LAOS_FLAG, UK_FLAG } from "./constants";

function App() {
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
  const [words, setWords] = useState([
    {
      "id": 1,
      "lao": "ສະບາຍດີ",
      "english": "Hello",
      "type": "greeting",
      "favorite": false
    },
    {
      "id": 2,
      "lao": "ເຕົາອົບ",
      "english": "cooker",
      "type": "noun",
      "favorite": false
    },
    {
      "id": 3,
      "lao": "ສຳເນົາ",
      "english": "Copy",
      "type": "noun, verb",
      "favorite": false
    },
    {
      "id": 4,
      "lao": "ມຸມ",
      "english": "corner",
      "type": "noun",
      "favorite": false
    },
    {
      "id": 5,
      "lao": "ຢ່າງຖືກຕ້ອງ",
      "english": "correctly",
      "type": "adverb",
      "favorite": false
    },
    {
      "id": 6,
      "lao": "ນັບ",
      "english": "count",
      "type": "verb",
      "favorite": false
    },
 
  ]);

  const toggleFavorite = (id) => {
    setWords(
      words.map((word) =>
        word.id === id ? { ...word, favorite: !word.favorite } : word
      )
    );
  };

  const filteredWords = words.filter((word) =>
    (isEnglish
      ? word.english.toLowerCase().includes(searchTerm.toLowerCase())
      : word.lao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
