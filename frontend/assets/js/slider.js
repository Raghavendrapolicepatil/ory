// ==========================================
// Dynamic Banner Slider - Optimized
// ==========================================

const slides = document.getElementById("bannerSlides");
const dotsBox = document.getElementById("bannerDots");

let currentIndex = 0;
let totalSlides = 0;
let autoSlide = null;


// ==========================================
// Load Banners
// ==========================================

async function loadBanners() {

    if (!slides || !dotsBox) return;

    try {

        const controller = new AbortController();

        // Don't allow a slow API to block the homepage
        const timeout = setTimeout(() => {
            controller.abort();
        }, 5000);


        const response = await fetch(
            "https://snackible-backend.onrender.com/api/banners",
            {
                signal: controller.signal,
                cache: "no-store"
            }
        );

        clearTimeout(timeout);


        if (!response.ok) {
            throw new Error("Failed to load banners");
        }


        const banners = await response.json();


        const activeBanners = banners
            .filter(banner => banner.status)
            .sort((a, b) => a.order - b.order);


        slides.innerHTML = "";
        dotsBox.innerHTML = "";

        totalSlides = activeBanners.length;


        if (!totalSlides) {
            return;
        }


        // ==========================================
        // Create Banner HTML
        // ==========================================

        slides.innerHTML = activeBanners.map((banner, index) => {

            const isFirst = index === 0;

            return `
                <div class="slide">

                    <a
                        href="${banner.link || "#"}">

                        <img
                            src="${banner.image}"
                            alt="${banner.title || "Orymart Banner"}"
                            width="1200"
                            height="525"
                            ${isFirst
                                ? 'loading="eager" fetchpriority="high"'
                                : 'loading="lazy"'}
                            decoding="async">

                    </a>

                </div>
            `;

        }).join("");


        // ==========================================
        // Create Dots
        // ==========================================

        dotsBox.innerHTML = activeBanners.map((banner, index) => {

            return `
                <span
                    class="dot ${index === 0 ? "active" : ""}"
                    data-index="${index}">
                </span>
            `;

        }).join("");


        initSlider();


    } catch (error) {

        console.warn(
            "Banner API unavailable:",
            error.message
        );

        // Keep homepage usable even if API is slow/down

    }

}


// ==========================================
// Update Slider
// ==========================================

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


// ==========================================
// Next Slide
// ==========================================

function nextSlide() {

    if (totalSlides <= 1) return;

    currentIndex++;

    if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }

    updateSlider();

}


// ==========================================
// Previous Slide
// ==========================================

function previousSlide() {

    if (totalSlides <= 1) return;

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    }

    updateSlider();

}


// ==========================================
// Start Auto Slider
// ==========================================

function startSlider() {

    stopSlider();

    if (totalSlides > 1) {

        autoSlide = setInterval(
            nextSlide,
            3500
        );

    }

}


// ==========================================
// Stop Auto Slider
// ==========================================

function stopSlider() {

    if (autoSlide) {

        clearInterval(autoSlide);

        autoSlide = null;

    }

}


// ==========================================
// Initialize Slider
// ==========================================

function initSlider() {

    currentIndex = 0;


    // Dot Click

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


    // Desktop Hover

    slides.addEventListener(
        "mouseenter",
        stopSlider
    );

    slides.addEventListener(
        "mouseleave",
        startSlider
    );


    // Mobile Swipe

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


    updateSlider();

    startSlider();

}


// ==========================================
// Start
// ==========================================

loadBanners();