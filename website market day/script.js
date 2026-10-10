/* =====================================================
   PROPOSAL MARKET DAY - SCRIPT (VERSI STABIL)
===================================================== */

(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollTop = document.getElementById("scrollTop");
  const progressBar = document.getElementById("progressBar");
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");
  const buyButtons = document.querySelectorAll(".btn-buy");
  const miniButtons = document.querySelectorAll(".mini-btn");

  /* =====================================================
     TOAST
  ===================================================== */
  let toastTimeout;
  function showToast(message, icon = "fa-check-circle") {
    toastText.textContent = message;
    toast.querySelector("i").className = `fas ${icon}`;
    toast.classList.add("active");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("active");
    }, 2500);
  }

  /* =====================================================
     SCROLL HANDLER (throttled, ringan)
  ===================================================== */
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Navbar
      if (scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      // Progress bar
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        progressBar.style.width = (scrollY / docHeight) * 100 + "%";
      }

      // Scroll top button
      if (scrollY > 500) {
        scrollTop.classList.add("active");
      } else {
        scrollTop.classList.remove("active");
      }

      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* =====================================================
     MOBILE MENU
  ===================================================== */
  function toggleMenu(close = false) {
    if (close) {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "";
      return;
    }
    const isActive = navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active", isActive);
    document.body.style.overflow = isActive ? "hidden" : "";
  }

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach((link) =>
    link.addEventListener("click", () => toggleMenu(true))
  );

  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("active") &&
      !navMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      toggleMenu(true);
    }
  });

  /* =====================================================
     SMOOTH SCROLL (tanpa CSS smooth untuk hindari konflik)
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight + 15;
      const top =
        target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* =====================================================
     BELI / PESAN
  ===================================================== */
  let orderCount = 0;
  const totalModal = 195000;
  const hargaPerPorsi = 5000;

  buyButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const produk = this.getAttribute("data-produk");
      orderCount++;

      showToast(`${produk} dipesan! (Total: ${orderCount} porsi)`, "fa-shopping-bag");

      if (orderCount === 1) {
        showToast(`Harga: Rp5.000 / porsi`, "fa-tag");
      }
      if (orderCount === 39) {
        showToast(`BEP tercapai! Modal Rp195.000 kembali`, "fa-chart-line");
      }
      if (orderCount > 39) {
        const untung = orderCount * hargaPerPorsi - totalModal;
        showToast(
          `Untung: Rp${untung.toLocaleString("id-ID")} dari ${orderCount} porsi`,
          "fa-coins"
        );
      }
    });
  });

  miniButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const card = this.closest(".hero-card");
      const produk = card.querySelector("h4").textContent.trim();
      orderCount++;
      showToast(`${produk} +1 porsi`, "fa-plus-circle");
    });
  });

  /* =====================================================
     SCROLL TO TOP
  ===================================================== */
  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =====================================================
     SCROLL REVEAL (ringan, sekali saja)
  ===================================================== */
  const revealTargets = document.querySelectorAll(
    ".section-head, .produk-card, .tujuan-card, .mini-card, .bahan-card, .alur-card, .strategi-box, .tema-banner, .anggaran-table, .harga-card, .penutup-box, .target-box"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(el);
    });
  }

  /* =====================================================
     WELCOME TOAST
  ===================================================== */
  window.addEventListener("load", () => {
    setTimeout(() => {
      showToast("Selamat datang di Proposal Kami :)", "fa-store");
    }, 600);
  });

  /* =====================================================
     CONSOLE
  ===================================================== */
  console.log(
    "%cMarket Day %c| Singkong Keju & Tela-Tela",
    "background: #f5b042; color: #3d2210; padding: 4px 10px; border-radius: 4px 0 0 4px; font-weight: bold;",
    "background: #3d2210; color: #ffd580; padding: 4px 10px; border-radius: 0 4px 4px 0;"
  );
})();