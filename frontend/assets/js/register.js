// ==========================================
// Snackible Register
// ==========================================

const registerForm = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");

// ==========================================
// Show / Hide Password
// ==========================================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
        '<i class="ri-eye-off-line"></i>';

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
        '<i class="ri-eye-line"></i>';

    }

});

// ==========================================
// Register
// ==========================================

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (passwordInput.value !== confirmPassword.value) {

        alert("Passwords do not match");

        return;

    }

    try {

        const response = await fetch("https://snackible-backend.onrender.com/api/users/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                name: nameInput.value,

                phone: phoneInput.value,

                email: emailInput.value,

                password: passwordInput.value

            })

        });

        const data = await response.json();

        if (response.ok) {

            alert("Registration Successful ✅");

            window.location.href = "login.html";

        } else {

            alert(data.message);

        }

    }

    catch (error) {

        console.error(error);

        alert("Server Error");

    }

});