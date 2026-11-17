(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const screens = $$(".screen");
  const navLinks = $$(".nav-link");

  function showScreen(id) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains("screen")) return;

    screens.forEach(screen => {
      const isActive = screen === target;
      screen.classList.toggle("active", isActive);
      screen.setAttribute("aria-hidden", String(!isActive));
    });

    navLinks.forEach(link => {
      const isActive = link.dataset.go === id;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  }

  // All navigation buttons use the same reliable handler.
  $$("[data-go]").forEach(button => {
    button.addEventListener("click", () => showScreen(button.dataset.go));
  });

  // Support direct links such as the-site-url/#notes.
  const initialScreen = location.hash.slice(1);
  if (initialScreen && document.getElementById(initialScreen)?.classList.contains("screen")) {
    showScreen(initialScreen);
  } else {
    showScreen("home");
  }

  // Love-note popup.
  const letterPopup = $("#letterPopup");
  const letterMessage = $("#letterMessage");

  function closeLetter() {
    letterPopup.hidden = true;
  }

  $$(".envelope").forEach(envelope => {
    envelope.addEventListener("click", () => {
      letterMessage.textContent = envelope.dataset.note || "A little note, just for you. 💜";
      letterPopup.hidden = false;
      $("#closeLetter").focus();
      burstHearts(7);
    });
  });

  $("#closeLetter").addEventListener("click", closeLetter);
  letterPopup.addEventListener("click", event => {
    if (event.target === letterPopup) closeLetter();
  });

  // Photo viewer. If a photo hasn't been added yet, show a friendly reminder.
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");

  $$(".photo-card").forEach(card => {
    card.addEventListener("click", () => {
      const imagePath = card.dataset.photo;
      lightboxCaption.textContent = card.dataset.caption || "A lovely memory";
      lightboxImage.onerror = () => {
        lightbox.hidden = true;
        alert("This is a photo placeholder. Add your picture at " + imagePath + " to use the gallery.");
      };
      lightboxImage.src = imagePath;
      lightbox.hidden = false;
      $("#closeLightbox").focus();
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
  }

  $("#closeLightbox").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  // Floating hearts.
  function burstHearts(amount = 5) {
    const layer = $("#heartsLayer");
    const symbols = ["♡", "♥", "✦", "✧"];
    for (let i = 0; i < amount; i++) {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${8 + Math.random() * 84}%`;
      heart.style.animationDelay = `${Math.random() * .7}s`;
      heart.style.fontSize = `${14 + Math.random() * 18}px`;
      layer.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove(), { once: true });
    }
  }

  $("#heartButton").addEventListener("click", () => burstHearts(22));

  // Escape closes whichever popup is open.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!letterPopup.hidden) closeLetter();
      if (!lightbox.hidden) closeLightbox();
    }
  });
})();
