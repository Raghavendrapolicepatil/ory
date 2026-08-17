// ==========================================
// OryMart Register + OTP
// ==========================================

const registerForm = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpSection = document.getElementById("otpSection");
const otpInput = document.getElementById("otp");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");


// ==========================================
// Backend URL
// ==========================================

const API_URL = "https://snackible-backend.onrender.com/api/users";


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
// Send OTP
// ==========================================

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPasswordValue = confirmPassword.value;

    // Password check
    if (password !== confirmPasswordValue) {

        alert("Passwords do not match");

        return;

    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Please enter a valid 10-digit phone number");

        return;

    }

    // Disable button
    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = "Sending OTP...";

    try {

        const response = await fetch(
            `${API_URL}/send-otp`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    phone: phone,

                    email: email,

                    password: password

                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = "Send OTP";

            return;

        }

        // OTP section show
        otpSection.style.display = "block";

        // Disable registration fields
        nameInput.disabled = true;
        phoneInput.disabled = true;
        emailInput.disabled = true;
        passwordInput.disabled = true;
        confirmPassword.disabled = true;

        sendOtpBtn.style.display = "none";

        otpInput.focus();

        alert("OTP sent successfully 📱");

    }

    catch (error) {

        console.error("Send OTP Error:", error);

        alert("Unable to send OTP. Please try again.");

        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = "Send OTP";

    }

});


// ==========================================
// Verify OTP
// ==========================================

verifyOtpBtn.addEventListener("click", async () => {

    const phone = phoneInput.value.trim();
    const otp = otpInput.value.trim();

    if (!/^[0-9]{4}$/.test(otp)) {

        alert("Please enter the 4-digit OTP");

        return;

    }

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = "Verifying...";

    try {

        const response = await fetch(
            `${API_URL}/verify-otp`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    phone: phone,

                    otp: otp

                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            verifyOtpBtn.disabled = false;
            verifyOtpBtn.textContent = "Verify OTP";

            return;

        }

        alert("Registration Successful ✅");

        window.location.href = "login.html";

    }

    catch (error) {

        console.error("Verify OTP Error:", error);

        alert("Unable to verify OTP. Please try again.");

        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = "Verify OTP";

    }

});