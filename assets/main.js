/* 无需 npm / jQuery；本文件只负责视频切换和可选媒体加载。 */
"use strict";

const revealMedia = (element) => {
  const optional = element.closest("[data-optional-media]");
  if (optional) optional.hidden = false;
  const grid = element.closest("[data-media-grid]");
  if (grid) grid.hidden = false;
};

document.querySelectorAll("[data-video-selector]").forEach((box) => {
  const video = box.querySelector("video");
  const placeholder = box.querySelector("[data-placeholder]");
  const title = box.querySelector("[data-placeholder-title]");
  const note = box.querySelector("[data-placeholder-note]");
  const buttons = [...box.querySelectorAll(".video-option")];
  const originalNote = note.textContent;
  const available = buttons.filter((button) => button.dataset.src.trim());
  if (!available.length) return;
  buttons.forEach((button) => { button.hidden = !button.dataset.src.trim(); });
  revealMedia(box);

  const select = (button, shouldPlay = false) => {
    video.pause();
    buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    title.textContent = button.textContent;
    note.textContent = originalNote;
    const src = button.dataset.src.trim();
    placeholder.hidden = Boolean(src);
    video.hidden = !src;
    if (!src) {
      video.removeAttribute("src");
      video.load();
      return;
    }
    video.src = src;
    video.load();
    if (shouldPlay) video.play().catch(() => {});
  };

  buttons.forEach((button) => button.addEventListener("click", () => select(button, true)));
  video.addEventListener("error", () => {
    if (!video.getAttribute("src")) return;
    video.hidden = true;
    placeholder.hidden = false;
    note.textContent = "This video could not be loaded.";
  });
  const initial = available.find((button) => button.getAttribute("aria-pressed") === "true") || available[0];
  if (initial) select(initial);
});

document.querySelectorAll("[data-image]").forEach((slot) => {
  const src = slot.dataset.image.trim();
  if (!src) return;
  const placeholder = slot.firstElementChild;
  const image = new Image();
  image.alt = slot.dataset.alt || "Research figure";
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    placeholder.querySelector("strong").textContent = "This figure could not be loaded.";
    slot.replaceChildren(placeholder);
  });
  image.src = src;
  slot.replaceChildren(image);
  revealMedia(slot);
});

document.querySelectorAll("[data-video]").forEach((slot) => {
  const src = slot.dataset.video.trim();
  if (!src) return;
  const placeholder = slot.querySelector(".placeholder");
  const video = document.createElement("video");
  video.controls = true;
  video.playsInline = true;
  video.muted = true;
  video.loop = true;
  video.preload = "metadata";
  video.setAttribute("aria-label", slot.dataset.title || "Research video");
  video.addEventListener("error", () => {
    placeholder.querySelector("strong").textContent = "This video could not be loaded.";
    slot.replaceChildren(placeholder);
  });
  video.src = src;
  slot.replaceChildren(video);
  revealMedia(slot);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) target.pause();
    });
  });
  document.querySelectorAll("video").forEach((video) => observer.observe(video));
}
