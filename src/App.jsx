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
      "lao": "ເຕົາອບ",
      "english": "cooker",
      "type": "noun",
      "favorite": false
    },
    {
      "id": 3,
      "lao": "ສຳເນົາ",
      "english": "copy",
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
    {
      "id": 7,
      "lao": "ຄູ່",
      "english": "couple",
      "type": "noun",
      "favorite": false
    },
    {
      "id": 8,
      "lao": "ປົກຄຸມ",
      "english": "cover",
      "type": "verb",
      "favorite": false
    },
    {
      "id": 9,
      "lao": "ບ້າ",
      "english": "crazy",
      "type": "adjective",
      "favorite": false
    },
    {
      "id": 10,
      "lao": "ສ້າງສັນ",
      "english": "creative",
      "type": "adjective",
      "favorite": false
    },
    {
      "id": 11,
      "lao": "ເຄຣິດິດ",
      "english": "credit",
      "type": "noun",
      "favorite": false
    },
    {
      "id": 12,
      "lao": "ອາຊະຍາກຳ",
      "english": "crime",
      "type": "noun",
      "favorite": false
    },
    {
      "id": 13,
      "lao": "ອາຊະຍາກອນ",
      "english": "criminal",
      "type": "noun, adjective",
      "favorite": false
    },
    {
      "id": 14,
      "lao": "ຂໍ້ມູນ",
      "english": "cross",
      "type": "verb, noun",
      "favorite": false
    },
    {
      "id": 15,
      "lao": "ຝູງຊົນ",
      "english": "crowd",
      "type": "noun",
      "favorite": false
    },
    {
      "id": 16,
      "lao": "ແອອດ",
      "english": "crowded",
      "type": "adjective",
      "favorite": false
    },
    {
      "id": 17,
      "lao": "ຮ້ອງໄຫ້",
      "english": "cry",
      "type": "verb",
      "favorite": false
    },
    {
      "id": 18,
      "lao": "ຕູ້ເກັບສິນຄ້າ",
      "english": "cupboard",
      "type": "noun",
      "favorite": false
    },
    {
      "id": 19,
      "lao": "ຫຍິກ",
      "english": "curly",
      "type": "adjective",
      "favorite": false
    },
    {
      "id": 20,
      "lao": "ວົນຈອນ",
      "english": "cycle",
      "type": "noun, verb",
      "favorite": false
    },
    {
      "id": 21,
      "lao": "ປະຈໍາມື້",
      "english": "daily",
      "type": "adjective",
      "favorite": false
    },
    {
      "id": 22,
      "lao": "ອັນຕະລາຍ",
      "english": "danger",
      "type": "noun",
      "favorite": false
    }
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
      <div className="w-5/6 lg:w-3/4 xl:w-2/4 2xl:1/4 mx-auto">
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
