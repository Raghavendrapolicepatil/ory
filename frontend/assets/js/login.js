// ==========================================
// OryMart Phone + OTP Login
// ==========================================

const loginForm = document.getElementById("loginForm");

const login = document.getElementById("login");

const sendOtpBtn = document.getElementById("sendOtpBtn");

const otpSection = document.getElementById("otpSection");

const otpInput = document.getElementById("otp");

const verifyOtpBtn = document.getElementById("verifyOtpBtn");


// ==========================================
// Backend URL
// ==========================================

const API_URL =
    "https://snackible-backend.onrender.com/api/users";


// ==========================================
// Send Login OTP
// ==========================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const phone = login.value.trim();

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Please enter a valid 10-digit mobile number");

        return;

    }

    sendOtpBtn.disabled = true;

    sendOtpBtn.textContent = "Sending OTP...";

    try {

        const response = await fetch(
            `${API_URL}/send-login-otp`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    phone: phone
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

        // Show OTP section
        otpSection.style.display = "block";

        // Disable phone
        login.disabled = true;

        sendOtpBtn.style.display = "none";

        otpInput.focus();

        alert("OTP sent successfully 📱");

        // Try automatic OTP reading
        startOTPListener();

    }

    catch (error) {

        console.error("Send Login OTP Error:", error);

        alert("Unable to send OTP. Please try again.");

        sendOtpBtn.disabled = false;

        sendOtpBtn.textContent = "Send OTP";

    }

});


// ==========================================
// Verify Login OTP
// ==========================================

verifyOtpBtn.addEventListener("click", async () => {

    const phone = login.value.trim();

    const otp = otpInput.value.trim();

    if (!/^[0-9]{4}$/.test(otp)) {

        alert("Please enter the 4-digit OTP");

        return;

    }

    verifyOtpBtn.disabled = true;

    verifyOtpBtn.textContent = "Verifying...";

    try {

        const response = await fetch(
            `${API_URL}/verify-login-otp`,
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

            verifyOtpBtn.textContent = "Verify & Login";

            return;

        }

        // Save login session
        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        alert("Login Successful ✅");

        // Admin
        if (data.user.role === "admin") {

            window.location.href =
                "admin/dashboard.html";

        }

        // Normal user
        else {

            window.location.href =
                "index.html";

        }

    }

    catch (error) {

        console.error(
            "Verify Login OTP Error:",
            error
        );

        alert("Unable to verify OTP. Please try again.");

        verifyOtpBtn.disabled = false;

        verifyOtpBtn.textContent =
            "Verify & Login";

    }

});


// ==========================================
// Automatic OTP Detection
// ==========================================

async function startOTPListener() {

    if (!("OTPCredential" in window)) {

        console.log(
            "Automatic OTP reading is not supported."
        );

        return;

    }

    const controller = new AbortController();

    setTimeout(() => {

        controller.abort();

    }, 60000);

    try {

        const credential =
            await navigator.credentials.get({

                otp: {
                    transport: ["sms"]
                },

                signal: controller.signal

            });

        if (!credential) return;

        otpInput.value = credential.code;

        // Automatically verify
        verifyOtpBtn.click();

    }

    catch (error) {

        console.log(
            "Automatic OTP reading unavailable:",
            error
        );

    }

}