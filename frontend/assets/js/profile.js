// ==========================================
// Snackible Profile
// ==========================================

// Elements
const profileName = document.querySelector(".profile-card h2");
const profilePhone = document.querySelector(".profile-card p");
const editBtn = document.querySelector(".edit-btn");

// Load Saved Data
function loadProfile() {

    const savedName = localStorage.getItem("userName");
    const savedPhone = localStorage.getItem("userPhone");

    if (savedName) {
        profileName.textContent = savedName;
    }

    if (savedPhone) {
        profilePhone.textContent = savedPhone;
    }

}

// Save Profile
function saveProfile(name, phone) {

    localStorage.setItem("userName", name);
    localStorage.setItem("userPhone", phone);

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