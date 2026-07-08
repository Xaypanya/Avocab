const FAVORITES_KEY = "avocab_favorites";

function playAudio(englishText) {
  const synth = window.speechSynthesis;
  const speak = () => {
    const voices = synth.getVoices();
    const utterance = new SpeechSynthesisUtterance(englishText);
    utterance.lang = "en-US";
    if (voices[5]) utterance.voice = voices[5];
    utterance.volume = 1;
    utterance.rate = 1;
    synth.speak(utterance);
  };
  if (synth.getVoices().length === 0) {
    synth.addEventListener("voiceschanged", speak, { once: true });
  } else {
    speak();
  }
}

function getFavorites() {
  return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]"));
}

function setFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

function applyFavoriteState(card) {
  const btn = card.querySelector(".favorite-btn");
  const icon = card.querySelector(".favorite-icon");
  const id = Number(btn.dataset.id);
  const isFav = getFavorites().has(id);
  btn.classList.toggle("bg-red-500", isFav);
  btn.classList.toggle("bg-white", !isFav);
  icon.classList.toggle("fill-white", isFav);
  icon.classList.toggle("stroke-white", isFav);
  icon.classList.toggle("fill-none", !isFav);
  icon.classList.toggle("stroke-black", !isFav);
}

document.querySelectorAll(".word-card").forEach((card) => {
  applyFavoriteState(card);

  card.querySelector(".play-audio-btn")?.addEventListener("click", (e) => {
    playAudio(e.currentTarget.dataset.english);
  });

  card.querySelector(".favorite-btn")?.addEventListener("click", (e) => {
    const id = Number(e.currentTarget.dataset.id);
    const favorites = getFavorites();
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    setFavorites(favorites);
    applyFavoriteState(card);
  });
});
