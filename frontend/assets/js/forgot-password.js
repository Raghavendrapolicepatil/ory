// ==========================================
// Orymart - Forgot Password + OTP
// ==========================================

const forgotForm = document.getElementById("forgotForm");

const phoneInput = document.getElementById("phone");
const otpSection = document.getElementById("otpSection");
const otpInput = document.getElementById("otp");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const sendOtpBtn =
    document.getElementById("sendOtpBtn");

const resetPasswordBtn =
    document.getElementById("resetPasswordBtn");


const API_URL =
    "https://snackible-backend.onrender.com/api/users";


// ==========================================
// Send OTP
// ==========================================

forgotForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const phone =
        phoneInput.value.trim();


    if (!/^[0-9]{10}$/.test(phone)) {

        alert(
            "Please enter a valid 10-digit phone number."
        );

        return;

    }


    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent =
        "Sending OTP...";


    try {

        const response =
            await fetch(
                `${API_URL}/forgot-password/send-otp`,
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
                "Unable to send OTP."
            );

            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent =
                "Send OTP";

            return;

        }


        otpSection.style.display =
            "block";

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
            "Forgot Password OTP Error:",
            error
        );

        alert(
            "Unable to send OTP. Please try again."
        );

        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent =
            "Send OTP";

    }

});


// ==========================================
// Reset Password
// ==========================================

resetPasswordBtn.addEventListener(
    "click",
    async () => {

        const phone =
            phoneInput.value.trim();

        const otp =
            otpInput.value.trim();

        const newPassword =
            newPasswordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        if (!/^[0-9]{4}$/.test(otp)) {

            alert(
                "Please enter the 4-digit OTP."
            );

            return;

        }


        if (newPassword.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (newPassword !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            return;

        }


        resetPasswordBtn.disabled = true;

        resetPasswordBtn.textContent =
            "Resetting...";


        try {

            const response =
                await fetch(
                    `${API_URL}/forgot-password/reset`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            phone: phone,

                            otp: otp,

                            password: newPassword

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to reset password."
                );

                resetPasswordBtn.disabled =
                    false;

                resetPasswordBtn.textContent =
                    "Reset Password";

                return;

            }


            alert(
                "Password reset successfully ✅"
            );


            window.location.href =
                "login.html";

        }

        catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            alert(
                "Unable to reset password. Please try again."
            );

            resetPasswordBtn.disabled =
                false;

            resetPasswordBtn.textContent =
                "Reset Password";

        }

    }
);