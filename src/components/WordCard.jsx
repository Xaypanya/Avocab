import React from 'react';
import { Heart, Volume2 } from "lucide-react";
import { LAOS_FLAG, UK_FLAG } from '../constants';

const WordCard = ({ word, toggleFavorite }) => {

  const playAudio = () => {
    const synth = window.speechSynthesis;
  
    const getVoices = () => {
      const voices = synth.getVoices();
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      utterance.voice = voices[5]; // Adjust index based on available voices
      utterance.volume = 1; // Volume range = 0 - 1
      utterance.rate = 1; // Speed of the text read , default 1
      synth.speak(utterance);
    };
  
    if (synth.getVoices().length === 0) {
      // Voices not loaded yet
      synth.addEventListener('voiceschanged', getVoices);
    } else {
      // Voices already loaded
      getVoices();
    }
  };
  return (
    <div className="p-4 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center space-x-2 mb-3">
            <img src={UK_FLAG} alt='UK Flag' className="w-6 h-6 bg-red-500 rounded-full border border-black"/>
            <h2 className="text-lg font-bold">{word.english}</h2>
            <button 
              variant="outline" 
              size="icon" 
              className="p-1 border-2 border-black rounded-full bg-yellow-300 hover:bg-yellow-400 transition-colors" 
              onClick={playAudio}
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <img src={LAOS_FLAG} alt='UK Flag' className="w-6 h-6 bg-blue-500 rounded-full border border-black"/>
            <p className="text-md">{word.lao}</p>
          </div>
          <p className="text-sm text-gray-600 mt-2 bg-gray-100 inline-block px-2 py-1 rounded-full border border-gray-300">{word.type}</p>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={toggleFavorite}
            variant="outline"
            className={`p-1 ${word.favorite ? 'bg-red-500' : 'bg-white'} border-2 border-black rounded-full w-10 h-10 flex items-center justify-center`}
          >
            <Heart className={`h-5 w-5 ${word.favorite ? 'fill-white stroke-white' : 'fill-none stroke-black'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordCard;