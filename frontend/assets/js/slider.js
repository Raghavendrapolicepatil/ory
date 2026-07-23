// ==========================================
// Dynamic Banner Slider
// ==========================================

const slides = document.getElementById("bannerSlides");
const dotsBox = document.getElementById("bannerDots");

let currentIndex = 0;
let totalSlides = 0;
let autoSlide;

// =============================
// Load Banners
// =============================

async function loadBanners() {

    try {

        const res = await fetch("https://snackible-backend.onrender.com/api/banners");

        const banners = await res.json();

        slides.innerHTML = "";
        dotsBox.innerHTML = "";

        banners
            .filter(banner => banner.status)
            .sort((a, b) => a.order - b.order)
            .forEach((banner, index) => {

                slides.innerHTML += `

<div class="slide">

<a href="${banner.link || "#"}">

<img src="${banner.image}" alt="${banner.title}">
</a>

</div>

`;

                dotsBox.innerHTML += `

<span class="dot ${index===0?"active":""}"></span>

`;

            });

        totalSlides = banners.length;

        initSlider();

    }

    catch (err) {

        console.log(err);

    }

}

// =============================
// Update Slider
// =============================

function updateSlider() {

    slides.style.transform =
        `translateX(-${currentIndex*100}%)`;

    const dots =
        document.querySelectorAll(".dot");

    dots.forEach(dot=>dot.classList.remove("active"));

    if(dots[currentIndex]){

        dots[currentIndex].classList.add("active");

    }

}

// =============================
// Next Slide
// =============================

function nextSlide(){

    currentIndex++;

    if(currentIndex>=totalSlides){

        currentIndex=0;

    }

    updateSlider();

}

// =============================
// Start Slider
// =============================

function startSlider(){

    autoSlide=setInterval(nextSlide,3500);

}

function stopSlider(){

    clearInterval(autoSlide);

}

// =============================
// Initialize
// =============================

function initSlider(){

    const dots=document.querySelectorAll(".dot");

    dots.forEach((dot,index)=>{

        dot.addEventListener("click",()=>{

            currentIndex=index;

            updateSlider();

            stopSlider();

            startSlider();

        });

    });

    slides.addEventListener("mouseenter",stopSlider);

    slides.addEventListener("mouseleave",startSlider);

    updateSlider();

    startSlider();

}

loadBanners();