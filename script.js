// ---------- Player de música (lê a pasta /musics do repositório) ----------
const REPO_OWNER = "o14bis";
const REPO_NAME = "o14bis.github.io";
const MUSIC_FOLDER = "musics";
const AUDIO_EXT = /\.(mp3|ogg|wav|m4a)$/i;

const radio = document.getElementById("radio");
const radioToggle = document.getElementById("radio-toggle");
const radioLabel = radioToggle.querySelector("span");

let playlist = [];
let currentTrack = 0;

function trackName(url) {
  const fileName = decodeURIComponent(url.split("/").pop());
  return fileName.replace(/\.[^.]+$/, "");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadPlaylist() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${MUSIC_FOLDER}`
    );
    if (!res.ok) throw new Error("pasta musics não encontrada");
    const files = await res.json();
    playlist = shuffle(
      files
        .filter((f) => f.type === "file" && AUDIO_EXT.test(f.name))
        .map((f) => f.download_url)
    );
  } catch (err) {
    console.error("Erro ao carregar a playlist:", err);
    playlist = [];
  }

  if (playlist.length === 0) {
    radioLabel.textContent = "sem músicas";
    radioToggle.disabled = true;
  } else {
    radioToggle.disabled = false;
    radio.src = playlist[currentTrack];
    radioLabel.textContent = trackName(playlist[currentTrack]);
  }
}

function playRadio() {
  if (playlist.length === 0) return;
  radio.play().catch((err) => {
    console.error("Não consegui tocar a música:", err);
    radioLabel.textContent = "erro ao tocar música";
  });
}

radioToggle.addEventListener("click", () => {
  if (playlist.length === 0) return;
  if (radio.paused) {
    playRadio();
  } else {
    radio.pause();
  }
});

// quando uma faixa termina, toca a próxima — e volta pra primeira depois da última
radio.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  radio.src = playlist[currentTrack];
  radio.play();
});

radio.addEventListener("playing", () => {
  radioToggle.setAttribute("aria-pressed", "true");
  radioLabel.textContent = trackName(playlist[currentTrack]);
});
radio.addEventListener("pause", () => {
  radioToggle.setAttribute("aria-pressed", "false");
});
radio.addEventListener("waiting", () => {
  radioLabel.textContent = "carregando…";
});
radio.addEventListener("error", () => {
  console.error("Erro no elemento de áudio:", radio.error);
  radioLabel.textContent = "erro ao tocar música";
});

const playlistReady = loadPlaylist();

radioToggle.addEventListener("click", () => {
  if (radio.paused) {
    playRadio();
  } else {
    radio.pause();
    radioToggle.setAttribute("aria-pressed", "false");
  }
});

// ---------- Tela de carregamento ----------
// Precisa de um clique (exigência dos navegadores pra poder tocar áudio),
// e esse mesmo clique já dispara o rádio.
const loading = document.getElementById("loading");
const app = document.getElementById("app");

function enterSite() {
  playlistReady.finally(playRadio);
  loading.classList.add("fade-out");
  app.classList.remove("hidden");
  setTimeout(() => loading.remove(), 500);
}

loading.addEventListener("click", enterSite);
loading.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    enterSite();
  }
});

// ---------- Vídeo de fundo ----------
// Respeita quem tem "reduzir movimento" ativado no sistema
const bgVideo = document.getElementById("bg-video");
if (bgVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  bgVideo.pause();
  bgVideo.removeAttribute("autoplay");
}

// ---------- Abas (Sobre mim / Mídias / Links) ----------
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    panels.forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    panel.classList.add("active");
  });
});

// ---------- Lightbox das mídias ----------
// Por enquanto os itens são só placeholders (quadrados com texto).
// Quando você trocar por <img> de verdade, é só usar o src da imagem aqui dentro.
const mediaItems = document.querySelectorAll(".media-item");
const lightbox = document.getElementById("lightbox");
const lightboxLabel = document.getElementById("lightbox-label");

mediaItems.forEach((item) => {
  item.addEventListener("click", () => {
    lightboxLabel.textContent = item.querySelector("span").textContent;
    lightbox.classList.remove("hidden");
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.add("hidden");
});
