// ==========================================
// Profile Login Check
// ==========================================

const profileBtn = document.getElementById("profileBtn");

if (profileBtn) {

    profileBtn.addEventListener("click", (e) => {

        e.preventDefault();

        const user = localStorage.getItem("user");

        if (user) {

            window.location.href = "profile.html";

        } else {

            window.location.href = "login.html";

        }

    });

}

// ==========================================
// Sticky Search Animation
// ==========================================

const search = document.querySelector(".search-wrapper");

if (search) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 120) {

            search.classList.add("scrolled");

        } else {

            search.classList.remove("scrolled");

        }

    });

}