import React from "react";

function ThreeDotLoading() {
  return (
   <div className="relative">
      <div class="flex space-x-2 justify-center items-center mt-20">
      <div class="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div class="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div class="h-3 w-3 bg-black rounded-full animate-bounce"></div>
    </div>
   </div>
  );
}

export default ThreeDotLoading;
