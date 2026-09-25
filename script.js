// ---------- Rádio de fundo ----------
const radio = document.getElementById("radio");
const radioToggle = document.getElementById("radio-toggle");

function playRadio() {
  radio.play()
    .then(() => radioToggle.setAttribute("aria-pressed", "true"))
    .catch((err) => {
      console.error("Não consegui tocar o rádio:", err);
      radioToggle.setAttribute("aria-pressed", "false");
      radioToggle.querySelector("span").textContent = "rádio: erro ao tocar";
    });
}

// Se nenhuma das fontes acima (todas as <source>) conseguir carregar, mostra isso no botão
radio.addEventListener("error", () => {
  console.error("Erro no elemento de áudio:", radio.error);
  radioToggle.querySelector("span").textContent = "rádio indisponível";
});

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
  playRadio();
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
