import words from "../data/words.json";
import dictionary from "../assets/lang/dictionary.json";
import emptyAnimation from "../assets/lottie/empty-animation.json";
import lottie from "lottie-web";

const PAGE_LIMIT = 30;
const FAVORITES_KEY = "avocab_favorites";
const LANGUAGE_KEY = "language";
const SEARCH_LANG_KEY = "avocab_search_lang";

const state = {
  // UI language: which language the interface copy (placeholder, empty-state text) is shown in.
  isEnglish: JSON.parse(localStorage.getItem(LANGUAGE_KEY) ?? "true"),
  // Search pair: which field (english or lao) the search term is matched against.
  // Deliberately independent of isEnglish — you can read the UI in English while searching Lao words, or vice versa.
  searchLang: localStorage.getItem(SEARCH_LANG_KEY) ?? "en",
  searchTerm: "",
  page: 1,
  favorites: new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]")),
  showFavoritesOnly: false,
};

const wordListEl = document.getElementById("word-list");
const emptyStateEl = document.getElementById("empty-state");
const emptyStateTextEl = document.getElementById("empty-state-text");
const searchInputEl = document.getElementById("search-input");
const languageToggleBtn = document.getElementById("language-toggle");
const languageFlagImg = document.getElementById("language-flag");
const goToTopBtn = document.getElementById("go-to-top");
const favoritesFilterBtn = document.getElementById("favorites-filter-toggle");
const favoritesFilterIcon = document.getElementById("favorites-filter-icon");
const searchPairEnBtn = document.getElementById("search-pair-en");
const searchPairLaBtn = document.getElementById("search-pair-la");

const UK_FLAG = "https://hatscripts.github.io/circle-flags/flags/gb.svg";
const LAOS_FLAG = "https://hatscripts.github.io/circle-flags/flags/la.svg";

const capitalize = (str) => (str ? str[0].toUpperCase() + str.slice(1) : str);
const base = import.meta.env.BASE_URL;

// real-dictionary part-of-speech abbreviations
const POS_ABBR = {
  noun: "n.", verb: "v.", adjective: "adj.", adverb: "adv.", pronoun: "pron.",
  preposition: "prep.", conjunction: "conj.", interjection: "interj.",
  number: "num.", particle: "part.", phrase: "phr.", greeting: "interj.",
  character: "char.", proverb: "prov.",
};
const posAbbr = (t) => POS_ABBR[t] ?? t;

// dictionaries are alphabetical: pre-sort once per direction
const wordsByEn = [...words].sort((a, b) => a.english.localeCompare(b.english, "en"));
const wordsByLa = [...words].sort((a, b) => a.lao.localeCompare(b.lao, "lo"));

// one compact dictionary row: headword · pos · translation + inline actions
function rowHtml(word) {
  const isFav = state.favorites.has(word.id);
  const en = state.searchLang === "en";
  const head = en ? capitalize(word.english) : word.lao;
  const trans = en ? word.lao : capitalize(word.english);
  return `
    <div class="word-row flex items-center gap-2 px-3 py-2 border-b border-gray-200 last:border-b-0 hover:bg-avocab-50" data-id="${word.id}">
      <div class="flex-1 min-w-0">
        <span class="inline-flex items-baseline gap-1.5 flex-wrap">
          <a href="${base}word/${word.slug}/" class="font-bold text-[15px] leading-snug hover:underline">${head}</a>
          <span class="italic text-[11px] text-gray-500">${posAbbr(word.type)}</span>
        </span>
        <span class="block text-[15px] text-gray-700 leading-snug truncate">${trans}</span>
      </div>
      <button type="button" class="play-audio-btn shrink-0 w-9 h-9 flex items-center justify-center border-2 border-black rounded-lg bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500 transition-colors" data-english="${word.english}" aria-label="Play pronunciation of ${word.english}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      </button>
      <button type="button" class="favorite-btn shrink-0 w-9 h-9 flex items-center justify-center border-2 border-black rounded-lg ${isFav ? "bg-red-500" : "bg-white"}" data-id="${word.id}" aria-label="Toggle favorite for ${word.english}">
        <svg class="favorite-icon h-4 w-4 ${isFav ? "fill-white stroke-white" : "fill-none stroke-black"}" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>
    </div>
  `;
}

// sticky A-Z / ກ-ຮ section header, like a printed dictionary.
// Pins flush below the search bar via a measured offset (see updateStickyOffset),
// not a hardcoded guess — otherwise a scrolling row can peek through the gap.
function letterHeaderHtml(letter) {
  return `<div class="letter-header sticky z-10 px-3 py-1 bg-avocab-400 border-y border-black text-xs font-bold tracking-widest" style="top: var(--sticky-offset, 0px)">${letter}</div>`;
}

const searchStickyWrapperEl = document.getElementById("search-sticky-wrapper");

function updateStickyOffset() {
  if (!searchStickyWrapperEl) return;
  document.documentElement.style.setProperty(
    "--sticky-offset",
    `${searchStickyWrapperEl.getBoundingClientRect().height}px`
  );
}

function letterOf(word) {
  const s = state.searchLang === "en" ? word.english : word.lao;
  return (s[0] || "").toUpperCase();
}

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

function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...state.favorites]));
}

function getFilteredWords() {
  let result = state.searchLang === "en" ? wordsByEn : wordsByLa;

  if (state.showFavoritesOnly) {
    result = result.filter((w) => state.favorites.has(w.id));
  }

  if (state.searchTerm) {
    const term = state.searchTerm.toLowerCase();
    result = result.filter((w) =>
      state.searchLang === "en"
        ? w.english.toLowerCase().includes(term)
        : w.lao.includes(state.searchTerm)
    );
  }

  return result;
}

let emptyAnim = null;

function render() {
  const filtered = getFilteredWords();
  const visible = filtered.slice(0, state.page * PAGE_LIMIT);

  if (visible.length === 0) {
    wordListEl.innerHTML = "";
    emptyStateEl.classList.remove("hidden");
    const emptyKey = state.showFavoritesOnly && !state.searchTerm ? "no_favorites" : "words_not_found";
    emptyStateTextEl.textContent = dictionary[emptyKey][state.isEnglish ? "en" : "la"];
    if (!emptyAnim) {
      emptyAnim = lottie.loadAnimation({
        container: document.getElementById("empty-lottie"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: emptyAnimation,
      });
    }
  } else {
    emptyStateEl.classList.add("hidden");
    // group under letter headers like a printed dictionary (skip while searching)
    let html = "";
    if (state.searchTerm) {
      html = visible.map(rowHtml).join("");
    } else {
      let current = null;
      for (const w of visible) {
        const l = letterOf(w);
        if (l !== current) {
          current = l;
          html += letterHeaderHtml(l);
        }
        html += rowHtml(w);
      }
    }
    wordListEl.innerHTML = html;
  }
  const countEl = document.getElementById("result-count");
  if (countEl) countEl.textContent = `${filtered.length.toLocaleString()} entries`;
}

function updateLanguageUI() {
  languageFlagImg.src = state.isEnglish ? UK_FLAG : LAOS_FLAG;
  languageFlagImg.alt = state.isEnglish ? "UK flag" : "Laos flag";
  searchInputEl.placeholder = state.isEnglish
    ? searchInputEl.dataset.placeholderEn
    : searchInputEl.dataset.placeholderLa;
}

searchInputEl.addEventListener("input", (e) => {
  state.searchTerm = e.target.value;
  state.page = 1;
  render();
});

function updateSearchPairUI() {
  const isEn = state.searchLang === "en";
  searchPairEnBtn.classList.toggle("bg-avocab-400", isEn);
  searchPairEnBtn.classList.toggle("bg-white", !isEn);
  searchPairEnBtn.setAttribute("aria-checked", String(isEn));
  searchPairLaBtn.classList.toggle("bg-avocab-400", !isEn);
  searchPairLaBtn.classList.toggle("bg-white", isEn);
  searchPairLaBtn.setAttribute("aria-checked", String(!isEn));
}

function setSearchLang(lang) {
  if (state.searchLang === lang) return;
  state.searchLang = lang;
  localStorage.setItem(SEARCH_LANG_KEY, lang);
  state.page = 1;
  updateSearchPairUI();
  render();
}

searchPairEnBtn.addEventListener("click", () => setSearchLang("en"));
searchPairLaBtn.addEventListener("click", () => setSearchLang("la"));

languageToggleBtn.addEventListener("click", () => {
  state.isEnglish = !state.isEnglish;
  localStorage.setItem(LANGUAGE_KEY, JSON.stringify(state.isEnglish));
  updateLanguageUI();
  updateStickyOffset();
  render();
});

function updateFavoritesFilterUI() {
  favoritesFilterBtn.setAttribute("aria-pressed", String(state.showFavoritesOnly));
  favoritesFilterBtn.classList.toggle("bg-red-500", state.showFavoritesOnly);
  favoritesFilterBtn.classList.toggle("bg-white", !state.showFavoritesOnly);
  favoritesFilterIcon.classList.toggle("fill-white", state.showFavoritesOnly);
  favoritesFilterIcon.classList.toggle("stroke-white", state.showFavoritesOnly);
  favoritesFilterIcon.classList.toggle("fill-none", !state.showFavoritesOnly);
  favoritesFilterIcon.classList.toggle("stroke-black", !state.showFavoritesOnly);
}

favoritesFilterBtn.addEventListener("click", () => {
  state.showFavoritesOnly = !state.showFavoritesOnly;
  state.page = 1;
  updateFavoritesFilterUI();
  render();
});

wordListEl.addEventListener("click", (e) => {
  const playBtn = e.target.closest(".play-audio-btn");
  if (playBtn) {
    playAudio(playBtn.dataset.english);
    return;
  }
  const favBtn = e.target.closest(".favorite-btn");
  if (favBtn) {
    const id = Number(favBtn.dataset.id);
    toggleFavorite(id);
    render();
  }
});

goToTopBtn.addEventListener("click", () => window.scrollTo(0, 0));

window.addEventListener("scroll", () => {
  const nearBottom =
    window.innerHeight + document.documentElement.scrollTop >=
    document.documentElement.offsetHeight - 100;
  if (!nearBottom) return;
  const filtered = getFilteredWords();
  if (state.page * PAGE_LIMIT < filtered.length) {
    state.page += 1;
    render();
  }
});

window.addEventListener("resize", updateStickyOffset);

updateLanguageUI();
updateSearchPairUI();
updateStickyOffset();
render();
