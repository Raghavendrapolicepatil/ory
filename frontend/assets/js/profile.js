// ==========================================
// OryMart Profile
// Guest + Logged-in User
// ==========================================

const guestProfile =
    document.getElementById("guestProfile");

const userProfile =
    document.getElementById("userProfile");

const userName =
    document.getElementById("userName");

const userPhone =
    document.getElementById("userPhone");

const loginBtn =
    document.getElementById("loginBtn");

const editProfileBtn =
    document.getElementById("editProfileBtn");

const authBtn =
    document.getElementById("authBtn");

const authText =
    document.getElementById("authText");

const authIcon =
    document.getElementById("authIcon");


// ==========================================
// Load Profile
// ==========================================

function loadProfile() {

    const token =
        localStorage.getItem("token");

    const savedUser =
        localStorage.getItem("user");


    // ======================================
    // Guest User
    // ======================================

    if (!token || !savedUser) {

        guestProfile.style.display =
            "block";

        userProfile.style.display =
            "none";


        // Login button
        authText.textContent =
            "Login with OTP";

        authIcon.className =
            "fa-solid fa-right-to-bracket";

        authBtn.classList.remove(
            "logout"
        );

        authBtn.href =
            "login.html";

        return;

    }


    // ======================================
    // Logged-in User
    // ======================================

    let user;

    try {

        user =
            JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.location.reload();

        return;

    }


    guestProfile.style.display =
        "none";

    userProfile.style.display =
        "block";


    userName.textContent =
        user.name || "OryMart User";


    userPhone.textContent =
        user.phone
            ? "+91 " + user.phone
            : "";


    // Logout button
    authText.textContent =
        "Logout";

    authIcon.className =
        "fa-solid fa-right-from-bracket";

    authBtn.classList.add(
        "logout"
    );

}


// ==========================================
// Guest Login
// ==========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// Edit Profile
// ==========================================

if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        () => {

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {

                window.location.href =
                    "login.html";

                return;

            }


            const user =
                JSON.parse(savedUser);


            const newName =
                prompt(
                    "Enter your name",
                    user.name || ""
                );


            if (
                newName === null ||
                newName.trim() === ""
            ) {

                return;

            }


            user.name =
                newName.trim();


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            userName.textContent =
                user.name;


            alert(
                "Profile updated successfully! ✅"
            );

        }
    );

}


// ==========================================
// Logout
// ==========================================

if (authBtn) {

    authBtn.addEventListener(
        "click",
        (e) => {

            const token =
                localStorage.getItem("token");


            // Guest → normal login link
            if (!token) {

                return;

            }


            // Logged-in → logout
            e.preventDefault();


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "index.html";

        }
    );

}


// ==========================================
// Start
// ==========================================

loadProfile();