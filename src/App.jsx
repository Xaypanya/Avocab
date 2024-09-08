import { useState, useEffect } from "react";
import HeaderBar from "./components/HeaderBar";
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

  return (
    <div className="min-w-screen min-h-screen">
      <div className="md:w-4/6 mx-auto">
        <div className="absolute top-6 right-4 space-x-2">
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
        <HeaderBar isEnglish={isEnglish} />
      </div>
    </div>
  );
}

export default App;
