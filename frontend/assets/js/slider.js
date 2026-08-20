// ==========================================
// OryMart Dynamic Banner Slider - Fast
// ==========================================

const slides = document.getElementById("bannerSlides");
const dotsBox = document.getElementById("bannerDots");

let currentIndex = 0;
let totalSlides = 0;
let autoSlide = null;

const BANNER_CACHE_KEY = "orymart_banners_cache";
const BANNER_CACHE_TIME = 30 * 60 * 1000;


// ==========================================
// Render Banners
// ==========================================

function renderBanners(banners) {

    if (!slides || !dotsBox || !banners.length) return;

    slides.innerHTML = banners.map((banner, index) => {

        const isFirst = index === 0;

        return `
            <div class="slide">

                <a href="${banner.link || "#"}">

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


    dotsBox.innerHTML = banners.map((banner, index) => {

        return `
            <span
                class="dot ${index === 0 ? "active" : ""}"
                data-index="${index}">
            </span>
        `;

    }).join("");


    totalSlides = banners.length;
    currentIndex = 0;

    initSlider();

}


// ==========================================
// Load Banners
// ==========================================

async function loadBanners() {

    if (!slides || !dotsBox) return;


    // ======================================
    // 1. Show Cache Immediately
    // ======================================

    try {

        const cached =
            localStorage.getItem(BANNER_CACHE_KEY);

        if (cached) {

            const data = JSON.parse(cached);

            if (
                data.banners &&
                Array.isArray(data.banners) &&
                data.banners.length
            ) {

                renderBanners(data.banners);

                console.log(
                    "⚡ Banners loaded from cache"
                );

            }

        }

    } catch (error) {

        console.warn(
            "Banner cache error:",
            error
        );

    }


    // ======================================
    // 2. API Background Update
    // ======================================

    try {

        const controller =
            new AbortController();

        const timeout =
            setTimeout(() => {

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

            throw new Error(
                "Failed to load banners"
            );

        }


        const banners =
            await response.json();


        const activeBanners =
            banners
                .filter(
                    banner => banner.status
                )
                .sort(
                    (a, b) => a.order - b.order
                );


        if (!activeBanners.length) return;


        // ==================================
        // Save Cache
        // ==================================

        localStorage.setItem(
            BANNER_CACHE_KEY,
            JSON.stringify({
                banners: activeBanners,
                savedAt: Date.now()
            })
        );


        // ==================================
        // Update Screen
        // ==================================

        renderBanners(activeBanners);


        console.log(
            "✅ Fresh banners loaded"
        );


    } catch (error) {

        console.warn(
            "Banner API unavailable:",
            error.message
        );

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


    const dots =
        dotsBox.querySelectorAll(".dot");


    dots.forEach(dot => {

        dot.addEventListener(
            "click",
            () => {

                currentIndex =
                    Number(dot.dataset.index);

                updateSlider();

                startSlider();

            }
        );

    });


    slides.onmouseenter =
        stopSlider;

    slides.onmouseleave =
        startSlider;


    let startX = 0;


    slides.ontouchstart = (e) => {

        startX =
            e.touches[0].clientX;

        stopSlider();

    };


    slides.ontouchend = (e) => {

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

    };


    updateSlider();
    startSlider();

}


// ==========================================
// Start
// ==========================================

loadBanners();