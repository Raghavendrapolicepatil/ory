// ==========================================
// Dynamic Banner Slider
// ==========================================

const slides = document.getElementById("bannerSlides");
const dotsBox = document.getElementById("bannerDots");

let currentIndex = 0;
let totalSlides = 0;
let autoSlide = null;

// =============================
// Load Banners
// =============================

async function loadBanners() {
  try {
    const res = await fetch("https://snackible-backend.onrender.com/api/banners");
    const banners = await res.json();

    const activeBanners = banners
      .filter((banner) => banner.status)
      .sort((a, b) => a.order - b.order);

    slides.innerHTML = "";
    dotsBox.innerHTML = "";

    activeBanners.forEach((banner, index) => {
      slides.innerHTML += `
        <div class="slide">
          <a href="${banner.link || "#"}">
            <img src="${banner.image}" alt="${banner.title}">
          </a>
        </div>
      `;

      dotsBox.innerHTML += `
        <span class="dot ${index === 0 ? "active" : ""}"></span>
      `;
    });

    totalSlides = activeBanners.length;

    if (totalSlides > 0) {
      initSlider();
    }
  } catch (err) {
    console.error("Banner Load Error:", err);
  }
}

// =============================
// Update Slider
// =============================

function updateSlider() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

// =============================
// Next Slide
// =============================

function nextSlide() {
  if (totalSlides <= 1) return;

  currentIndex++;

  if (currentIndex >= totalSlides) {
    currentIndex = 0;
  }

  updateSlider();
}

// =============================
// Start Auto Slider
// =============================

function startSlider() {
  stopSlider();
  if (totalSlides > 1) {
    autoSlide = setInterval(nextSlide, 3500);
  }
}

function stopSlider() {
  if (autoSlide) {
    clearInterval(autoSlide);
  }
}

// =============================
// Initialize
// =============================

function initSlider() {
  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
      startSlider();
    });
  });

  slides.addEventListener("mouseenter", stopSlider);
  slides.addEventListener("mouseleave", startSlider);

  // Mobile Touch Swipe
  let startX = 0;

  slides.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slides.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
      nextSlide();
    } else if (endX - startX > 50) {
      currentIndex =
        currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
      updateSlider();
    }

    startSlider();
  });

  updateSlider();
  startSlider();
}

loadBanners();