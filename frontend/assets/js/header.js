// ==========================================
// Premium Sticky Search
// ==========================================

const searchWrapper = document.querySelector(".search-wrapper");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        searchWrapper.classList.add("sticky-search");

        document.body.classList.add("search-fixed");

    } else {

        searchWrapper.classList.remove("sticky-search");

        document.body.classList.remove("search-fixed");

    }

});