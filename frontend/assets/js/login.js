// ==========================================
// Snackible Login
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

    try {

        const response = await fetch("https://snackible-backend.onrender.com/api/users/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email: login.value,

                password: password.value

            })

        });

        const data = await response.json();

if (response.ok) {

    alert("Login Successful ✅");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "admin") {

        window.location.href = "admin/dashboard.html";

    } else {

        window.location.href = "index.html";

    }

}

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

});