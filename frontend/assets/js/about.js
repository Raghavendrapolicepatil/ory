// ==========================================
// Patil Groceries - About Page
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // App Version
    const version = document.getElementById("app-version");

    if (version) {

        version.textContent = "Version 1.0";

    }

    // Current Year
    const year = document.getElementById("current-year");

    if (year) {

        year.textContent = new Date().getFullYear();

    }

});