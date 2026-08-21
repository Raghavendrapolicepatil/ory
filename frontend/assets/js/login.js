// ==========================================
// OryMart Phone + OTP
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const login =
    document.getElementById("login");

const sendOtpBtn =
    document.getElementById("sendOtpBtn");

const otpSection =
    document.getElementById("otpSection");

const otpInput =
    document.getElementById("otp");

const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");

const resendOtpBtn =
    document.getElementById("resendOtpBtn");


// ==========================================
// Backend URL
// ==========================================

const API_URL =
    "https://snackible-backend.onrender.com/api/users";


// ==========================================
// Send OTP
// ==========================================

loginForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const phone =
            login.value.trim();


        // ======================================
        // Phone Validation
        // ======================================

        if (!/^[0-9]{10}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit mobile number"
            );

            return;

        }


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
                    "Continue";

                return;

            }


            // ==================================
            // Show OTP Section
            // ==================================

            otpSection.style.display =
                "block";


            login.disabled = true;

            sendOtpBtn.style.display =
                "none";


            otpInput.focus();


            alert(
                "OTP sent successfully 📱"
            );


            // Automatic OTP detection
            startOTPListener();

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
                "Continue";

        }

    }
);


// ==========================================
// Verify OTP
// ==========================================

verifyOtpBtn.addEventListener(
    "click",
    async () => {

        const phone =
            login.value.trim();

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
                    "Invalid OTP"
                );

                verifyOtpBtn.disabled =
                    false;

                verifyOtpBtn.textContent =
                    "Verify";

                return;

            }


            // ==================================
            // Save Login Session
            // ==================================

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // ==================================
            // Redirect
            // ==================================

            if (
                data.user &&
                data.user.role === "admin"
            ) {

                window.location.href =
                    "admin/dashboard.html";

            }

            else {

                window.location.href =
                    "index.html";

            }

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
                "Verify";

        }

    }
);


// ==========================================
// Resend OTP
// ==========================================

if (resendOtpBtn) {

    resendOtpBtn.addEventListener(
        "click",
        async () => {

            const phone =
                login.value.trim();


            if (!/^[0-9]{10}$/.test(phone)) {

                alert(
                    "Invalid phone number"
                );

                return;

            }


            resendOtpBtn.disabled =
                true;

            resendOtpBtn.textContent =
                "Sending...";


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
                                phone: phone
                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to resend OTP"
                    );

                    resendOtpBtn.disabled =
                        false;

                    resendOtpBtn.textContent =
                        "Resend OTP";

                    return;

                }


                otpInput.value = "";

                otpInput.focus();


                alert(
                    "New OTP sent successfully 📱"
                );


                startOTPListener();


            }


            catch (error) {

                console.error(
                    "Resend OTP Error:",
                    error
                );

                alert(
                    "Unable to resend OTP"
                );

            }


            resendOtpBtn.disabled =
                false;

            resendOtpBtn.textContent =
                "Resend OTP";

        }
    );

}


// ==========================================
// Automatic OTP Detection
// ==========================================

async function startOTPListener() {

    // Browser does not support Web OTP
    if (!("OTPCredential" in window)) {

        console.log(
            "Automatic OTP reading is not supported."
        );

        return;

    }


    const controller =
        new AbortController();


    setTimeout(() => {

        controller.abort();

    }, 60000);


    try {

        const credential =
            await navigator.credentials.get({

                otp: {
                    transport: ["sms"]
                },

                signal:
                    controller.signal

            });


        if (!credential) {
            return;
        }


        // Fill OTP automatically
        otpInput.value =
            credential.code;


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