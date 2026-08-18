// ==========================================
// Orymart Settings
// ==========================================

// Elements
const darkMode = document.getElementById("dark-mode");
const notifications = document.getElementById("notifications");
const language = document.getElementById("language");

// ==========================
// Load Settings
// ==========================

window.addEventListener("DOMContentLoaded", () => {

    // Dark Mode
    const dark = localStorage.getItem("darkMode");

    if (dark === "true") {

        darkMode.checked = true;

        document.body.classList.add("dark");

    }

    // Notifications
    const notify = localStorage.getItem("notifications");

    if (notify === "true") {

        notifications.checked = true;

    }

    // Language
    const lang = localStorage.getItem("language");

    if (lang) {

        language.value = lang;

    }

});

// ==========================
// Dark Mode
// ==========================

darkMode.addEventListener("change", () => {

    if (darkMode.checked) {

        document.body.classList.add("dark");

        localStorage.setItem("darkMode", "true");

    } else {

        document.body.classList.remove("dark");

        localStorage.setItem("darkMode", "false");

    }

});

// ==========================
// Notifications
// ==========================

notifications.addEventListener("change", () => {

    localStorage.setItem(

        "notifications",

        notifications.checked

    );

});

// ==========================
// Language
// ==========================

language.addEventListener("change", () => {

    localStorage.setItem(

        "language",

        language.value

    );

});