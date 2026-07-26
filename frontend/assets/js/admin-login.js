// ==========================================
// Patil Groceries Admin Login
// ==========================================

const form = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    loginMessage.textContent = "";

    try {

        const response = await fetch("https://snackible-backend.onrender.com/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();
console.log(data);
        if (!response.ok) {

            loginMessage.textContent = data.message || "Login Failed";
            return;

        }

        // Admin Role Check
        if (data.user.role !== "admin") {

            loginMessage.textContent = "Access Denied!";
            return;

        }

        // Save Login
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.user));

        loginMessage.style.color = "green";
        loginMessage.textContent = "Login Successful...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 800);

    }

    catch (error) {

        console.error(error);

        loginMessage.textContent = "Server Error";

    }

});