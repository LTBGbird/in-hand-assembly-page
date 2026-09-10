"use strict";

// Media paths remain declarative in index.html. No build step or remote requests.
const experimentVideos = [...document.querySelectorAll(".experiment video[data-video]")];

function loadExperiment(video) {
  if (video.dataset.loaded) return;
  video.dataset.loaded = "true";
  video.poster = video.dataset.poster;
  video.muted = true;
  video.preload = "metadata";
  video.src = video.dataset.video;
  video.load();
}

experimentVideos.forEach((video) => {
  video.addEventListener("error", () => {
    video.closest(".video-shell").querySelector(".media-error").hidden = false;
  });
  // An explicit play action also works before the proximity observer has run.
  video.addEventListener("play", () => {
    loadExperiment(video);
    experimentVideos.forEach((other) => { if (other !== video) other.pause(); });
  });
  video.addEventListener("focus", () => loadExperiment(video));
});

if ("IntersectionObserver" in window) {
  const loadObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      loadExperiment(target);
      loadObserver.unobserve(target);
    });
  }, { rootMargin: "350px 0px" });
  const pauseObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => { if (!isIntersecting) target.pause(); });
  });
  experimentVideos.forEach((video) => {
    loadObserver.observe(video);
    pauseObserver.observe(video);
  });
} else {
  experimentVideos.forEach(loadExperiment);
}

const hero = document.getElementById("hero-video");
const toggle = document.querySelector(".hero-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let wantsBackground = !reduceMotion.matches && !navigator.connection?.saveData;
let heroInView = true;
let heroFailed = false;

function updateToggle() {
  const playing = !hero.paused;
  toggle.querySelector("[data-toggle-text]").textContent = playing ? "Pause background" : "Play background";
  toggle.querySelector("[data-toggle-icon]").textContent = playing ? "Ⅱ" : "▶";
  toggle.setAttribute("aria-label", playing ? "Pause background video" : "Play background video");
}

function syncBackground() {
  if (!wantsBackground || !heroInView || document.hidden || heroFailed) {
    hero.pause();
    return;
  }
  if (!hero.getAttribute("src")) {
    hero.muted = true;
    hero.src = hero.dataset.video;
    hero.load();
  }
  hero.play().then(() => {
    if (!wantsBackground || !heroInView || document.hidden) hero.pause();
  }).catch(() => {
    // The poster and explicit play button remain usable when autoplay is blocked.
    updateToggle();
  });
}

toggle.hidden = false;
toggle.addEventListener("click", () => {
  wantsBackground = hero.paused;
  syncBackground();
});
hero.addEventListener("playing", () => {
  hero.classList.add("is-playing");
  updateToggle();
});
hero.addEventListener("pause", updateToggle);
hero.addEventListener("error", () => {
  heroFailed = true;
  hero.classList.remove("is-playing");
  toggle.hidden = true;
});
reduceMotion.addEventListener("change", () => {
  wantsBackground = !reduceMotion.matches && !navigator.connection?.saveData;
  if (reduceMotion.matches) hero.classList.remove("is-playing");
  syncBackground();
});
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting && entry.intersectionRatio > 0.1;
    syncBackground();
  }, { threshold: [0, 0.1] }).observe(document.querySelector(".hero"));
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) experimentVideos.forEach((video) => video.pause());
  syncBackground();
});
syncBackground();

// Keep the compact section navigation aligned with the reader's position.
const sectionLinks = [...document.querySelectorAll(".section-links a")];
const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute("href")));
let navScheduled = false;
function updateNavigation() {
  let active = null;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= 150) active = sectionLinks[index];
  });
  sectionLinks.forEach((link) => {
    if (link === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  navScheduled = false;
}
window.addEventListener("scroll", () => {
  if (!navScheduled) {
    navScheduled = true;
    requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();
