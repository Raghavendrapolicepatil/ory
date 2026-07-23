// ==========================================
// Patil Groceries - Forgot Password
// ==========================================

const forgotForm = document.getElementById("forgotForm");
const emailInput = document.getElementById("login");

// ==========================================
// Submit
// ==========================================

forgotForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = emailInput.value.trim();

    // Email Empty

    if (!email) {

        alert("Please enter your email address.");

        return;

    }

    // Email Validation

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        alert("Please enter a valid email.");

        return;

    }

    try {

        // ==========================================
        // Future Backend API
        // ==========================================

        /*
        const response = await fetch(
            "https://snackible-backend.onrender.com/api/auth/forgot-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }
        */

        alert("Password reset link will be sent to your email.");

        forgotForm.reset();

        window.location.href = "login.html";

    }

    catch (error) {

        alert(error.message);

    }

});