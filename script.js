// ---------- Vídeo de fundo ----------
// Respeita quem tem "reduzir movimento" ativado no sistema
const bgVideo = document.getElementById("bg-video");
if (bgVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  bgVideo.pause();
  bgVideo.removeAttribute("autoplay");
}

// ---------- Tela de carregamento ----------
// Só pra dar aquele efeito de "entrando no perfil". Some sozinha depois de um tempinho.
// Usa DOMContentLoaded (não "load") pra não ficar esperando o vídeo de fundo
// terminar de baixar inteiro antes de sumir.
document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading");
  const app = document.getElementById("app");

  setTimeout(() => {
    loading.classList.add("fade-out");
    app.classList.remove("hidden");
    setTimeout(() => loading.remove(), 500);
  }, 500);
});

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
