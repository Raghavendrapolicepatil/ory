// ==========================================
// OryMart Register + OTP
// ==========================================

const registerForm =
    document.getElementById("registerForm");

const nameInput =
    document.getElementById("name");

const phoneInput =
    document.getElementById("phone");

const sendOtpBtn =
    document.getElementById("sendOtpBtn");

const otpSection =
    document.getElementById("otpSection");

const otpInput =
    document.getElementById("otp");

const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");


// ==========================================
// Backend URL
// ==========================================

const API_URL =
    "https://snackible-backend.onrender.com/api/users";


// ==========================================
// Send Registration OTP
// ==========================================

registerForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const name =
            nameInput.value.trim();

        const phone =
            phoneInput.value.trim();


        // ======================================
        // Name Validation
        // ======================================

        if (!name) {

            alert(
                "Please enter your full name"
            );

            return;

        }


        // ======================================
        // Phone Validation
        // ======================================

        if (!/^[0-9]{10}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit mobile number"
            );

            return;

        }


        // ======================================
        // Disable Button
        // ======================================

        sendOtpBtn.disabled = true;

        sendOtpBtn.textContent =
            "Sending OTP...";


        try {

            const response =
                await fetch(
                    `${API_URL}/send-otp`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            phone: phone

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to send OTP"
                );

                sendOtpBtn.disabled =
                    false;

                sendOtpBtn.textContent =
                    "Send OTP";

                return;

            }


            // ==================================
            // Show OTP Section
            // ==================================

            otpSection.style.display =
                "block";


            // Disable registration fields
            nameInput.disabled = true;

            phoneInput.disabled = true;

            sendOtpBtn.style.display =
                "none";


            otpInput.focus();


            alert(
                "OTP sent successfully 📱"
            );

        }


        catch (error) {

            console.error(
                "Send OTP Error:",
                error
            );

            alert(
                "Unable to send OTP. Please try again."
            );

            sendOtpBtn.disabled =
                false;

            sendOtpBtn.textContent =
                "Send OTP";

        }

    }
);


// ==========================================
// Verify Registration OTP
// ==========================================

verifyOtpBtn.addEventListener(
    "click",
    async () => {

        const phone =
            phoneInput.value.trim();

        const otp =
            otpInput.value.trim();


        // ====================================
        // OTP Validation
        // ====================================

        if (!/^[0-9]{4}$/.test(otp)) {

            alert(
                "Please enter the 4-digit OTP"
            );

            return;

        }


        verifyOtpBtn.disabled =
            true;

        verifyOtpBtn.textContent =
            "Verifying...";


        try {

            const response =
                await fetch(
                    `${API_URL}/verify-otp`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            phone: phone,

                            otp: otp

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "OTP verification failed"
                );

                verifyOtpBtn.disabled =
                    false;

                verifyOtpBtn.textContent =
                    "Verify OTP";

                return;

            }


            // ==================================
            // Save Login Session
            // ==================================

            if (data.token) {

                localStorage.setItem(
                    "token",
                    data.token
                );

            }

            if (data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

            }


            alert(
                "Account Created Successfully ✅"
            );


            // Go to home
            window.location.href =
                "index.html";

        }


        catch (error) {

            console.error(
                "Verify OTP Error:",
                error
            );

            alert(
                "Unable to verify OTP. Please try again."
            );

            verifyOtpBtn.disabled =
                false;

            verifyOtpBtn.textContent =
                "Verify OTP";

        }

    }
);