document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".main-nav");
  const toggle = document.querySelector(".nav-toggle");
  const toast = document.querySelector(".toast");
  let toastTimer;

  // Mobile navigation
  const setNav = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  };
  toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNav(false)));

  // Toast message
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  };

  document.querySelectorAll(".order-btn").forEach((btn) => {
    btn.addEventListener("click", () => showToast(`${btn.dataset.item} added to your order`));
  });

  // Reveal cards on scroll
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach((item, i) => {
      item.style.transitionDelay = `${(i % 4) * 80}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Highlight the current section in the nav
  const links = document.querySelectorAll(".main-nav ul a");
  const sections = [...links].map((l) => document.querySelector(l.getAttribute("href")));
  window.addEventListener("scroll", () => {
    const y = window.scrollY + 120;
    sections.forEach((sec, i) => {
      if (sec) links[i].classList.toggle("active", sec.offsetTop <= y && sec.offsetTop + sec.offsetHeight > y);
    });
  }, { passive: true });

  // Form validation and feedback
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validate = (form, status, okMessage) => {
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const ok = field.value.trim() !== "" && (field.type !== "email" || isEmail(field.value));
      field.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });
    status.textContent = valid ? okMessage : "Please fill in every field with valid details.";
    if (valid) form.reset();
  };

  document.querySelector(".contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    validate(e.target, e.target.querySelector(".form-status"), "Thanks, we'll get back to you shortly.");
  });
  document.querySelector(".footer-form").addEventListener("submit", (e) => {
    e.preventDefault();
    validate(e.target, document.querySelector(".footer-status"), "You're subscribed.");
  });

  // Placeholder if an image fails to load
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => img.classList.add("img-fallback"));
  });
});
