// ==========================================
// // Orymart Products V2
 Profile
// ==========================================

// Elements
const profileName = document.querySelector(".profile-card h2");
const profilePhone = document.querySelector(".profile-card p");
const editBtn = document.querySelector(".edit-btn");

// Load Saved Data
function loadProfile() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    profileName.textContent = user.name || "Guest";
    profilePhone.textContent = user.phone || "";

}

// Save Profile
function saveProfile(name, phone) {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    user.name = name;
    user.phone = phone;

    localStorage.setItem("user", JSON.stringify(user));

    profileName.textContent = name;
    profilePhone.textContent = phone;

}

// Edit Button
editBtn.addEventListener("click", () => {

    const newName = prompt(
        "Enter Your Name",
        profileName.textContent
    );

    if (newName === null || newName.trim() === "") return;

    const newPhone = prompt(
        "Enter Mobile Number",
        profilePhone.textContent
    );

    if (newPhone === null || newPhone.trim() === "") return;

    saveProfile(newName.trim(), newPhone.trim());

    alert("Profile Updated Successfully!");

});

// Load Profile on Page Open
loadProfile();