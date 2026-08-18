// ==========================================
// Orymart Login
// ==========================================

const loginForm = document.getElementById("loginForm");

const login = document.getElementById("login");

const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");


// ==========================================
// Show / Hide Password
// ==========================================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="ri-eye-off-line"></i>';

    } else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="ri-eye-line"></i>';

    }

});


// ==========================================
// Login
// ==========================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const phone = login.value.trim();
    const passwordValue = password.value;

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Please enter a valid 10-digit mobile number");

        return;

    }

    try {

        const response = await fetch(
    "https://snackible-backend.onrender.com/api/users/login",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    phone: phone,

                    password: passwordValue

                })

            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Login Successful ✅");

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // Admin
            if (data.user.role === "admin") {

                window.location.href =
                    "admin/dashboard.html";

            }

            // Normal User
            else {

                window.location.href =
                    "index.html";

            }

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.error("Login Error:", error);

        alert("Server Error");

    }

});