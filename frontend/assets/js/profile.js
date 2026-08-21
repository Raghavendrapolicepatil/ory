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

const editProfileModal =
    document.getElementById("editProfileModal");

const editNameInput =
    document.getElementById("editNameInput");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const saveEditBtn =
    document.getElementById("saveEditBtn");

// ==========================================
// Toast
// ==========================================

function showToast(message) {

    const toast =
        document.getElementById("profileToast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


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


    // ======================================
    // Logout Button
    // ======================================

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


            let user;

            try {

                user =
                    JSON.parse(savedUser);

            } catch (error) {

                console.error(
                    "User data error:",
                    error
                );

                return;
            }


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


            // Toast
            showToast(
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


            // Guest
            if (!token) {

                return;
            }


            // Logged-in user
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