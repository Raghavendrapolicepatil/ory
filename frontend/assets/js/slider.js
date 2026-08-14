// ==========================================
// Dynamic Banner Slider - Fast Version
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

        const res = await fetch(
            "https://snackible-backend.onrender.com/api/banners"
        );

        if (!res.ok) {
            throw new Error("Failed to load banners");
        }

        const banners = await res.json();

        const activeBanners = banners
            .filter(banner => banner.status)
            .sort((a, b) => a.order - b.order);

        // Reset
        slides.innerHTML = "";
        dotsBox.innerHTML = "";

        totalSlides = activeBanners.length;

        if (totalSlides === 0) {
            return;
        }

        // =============================
        // Create Banner HTML
        // =============================

        const slidesHTML = activeBanners.map((banner, index) => {

            const loading =
                index === 0 ? "eager" : "lazy";

            const priority =
                index === 0 ? "high" : "auto";

            return `
                <div class="slide">

                    <a href="${banner.link || "#"}">

                        <img
                            src="${banner.image}"
                            alt="${banner.title || "Ory Mart Banner"}"
                            width="1200"
                            height="525"
                            loading="${loading}"
                            fetchpriority="${priority}"
                            decoding="async"
                        >

                    </a>

                </div>
            `;

        }).join("");

        slides.innerHTML = slidesHTML;

        // =============================
        // Create Dots
        // =============================

        dotsBox.innerHTML = activeBanners.map((banner, index) => {

            return `
                <span
                    class="dot ${index === 0 ? "active" : ""}"
                    data-index="${index}">
                </span>
            `;

        }).join("");

        // =============================
        // Initialize Slider
        // =============================

        initSlider();

    } catch (err) {

        console.error("Banner Load Error:", err);

    }

}

// =============================
// Update Slider
// =============================

function updateSlider() {

    if (!slides) return;

    slides.style.transform =
        `translateX(-${currentIndex * 100}%)`;

    const dots =
        dotsBox.querySelectorAll(".dot");

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentIndex
        );

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
// Previous Slide
// =============================

function previousSlide() {

    if (totalSlides <= 1) return;

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    }

    updateSlider();

}

// =============================
// Start Auto Slider
// =============================

function startSlider() {

    stopSlider();

    if (totalSlides > 1) {

        autoSlide = setInterval(
            nextSlide,
            3500
        );

    }

}

// =============================
// Stop Auto Slider
// =============================

function stopSlider() {

    if (autoSlide) {

        clearInterval(autoSlide);

        autoSlide = null;

    }

}

// =============================
// Initialize Slider
// =============================

function initSlider() {

    // Reset index
    currentIndex = 0;

    // =============================
    // Dot Click
    // =============================

    const dots =
        dotsBox.querySelectorAll(".dot");

    dots.forEach(dot => {

        dot.addEventListener("click", () => {

            currentIndex =
                Number(dot.dataset.index);

            updateSlider();

            startSlider();

        });

    });

    // =============================
    // Desktop Hover
    // =============================

    slides.addEventListener(
        "mouseenter",
        stopSlider
    );

    slides.addEventListener(
        "mouseleave",
        startSlider
    );

    // =============================
    // Mobile Swipe
    // =============================

    let startX = 0;

    slides.addEventListener(
        "touchstart",
        (e) => {

            startX =
                e.touches[0].clientX;

            stopSlider();

        },
        { passive: true }
    );

    slides.addEventListener(
        "touchend",
        (e) => {

            const endX =
                e.changedTouches[0].clientX;

            const difference =
                startX - endX;

            if (difference > 50) {

                nextSlide();

            } else if (difference < -50) {

                previousSlide();

            }

            startSlider();

        },
        { passive: true }
    );

    // =============================
    // Initial Position
    // =============================

    updateSlider();

    startSlider();

}

// =============================
// Start
// =============================

loadBanners();