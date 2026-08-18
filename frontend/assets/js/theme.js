// ==========================================
// Orymart Theme Loader
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const darkModeToggle = document.getElementById("dark-mode");

    // Load saved theme
    const darkModeEnabled = localStorage.getItem("darkMode");

    if (darkModeEnabled === "true") {

        document.body.classList.add("dark");

        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }

    }

    // Dark mode toggle
    if (darkModeToggle) {

        darkModeToggle.addEventListener("change", () => {

            if (darkModeToggle.checked) {

                document.body.classList.add("dark");

                localStorage.setItem("darkMode", "true");

            } else {

                document.body.classList.remove("dark");

                localStorage.setItem("darkMode", "false");

            }

        });

    }

});