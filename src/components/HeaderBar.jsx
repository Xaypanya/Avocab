import React from "react";
const avocabLogo = "avocab.svg";
// import json lang dictionary
import dictionary from "../assets/lang/dictionary.json";

function HeaderBar({ isEnglish, setSearchTerm  }) {
  return (
    <div className="flex flex-col justify-center items-center py-4">
      <div className="flex space-x-2 justify-center items-center text-center mb-4">
        <img src={avocabLogo} alt="avocab logo" className="w-12 h-12 transform rotate-12" />
        <h1 className="font-pops text-2xl transform -rotate-2 border-b-2 border-gray-800">Avocab</h1>
      </div>
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-100 text-gray-800 placeholder:text-gray-600 text-center border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-white-400 active:shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full"
        placeholder={dictionary.placeholder_search[isEnglish ? "en" : "la"]}
      />
    </div>
  );
}

export default HeaderBar;
