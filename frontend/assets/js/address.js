// ==========================================
// Orymart Address Manager
// ==========================================

// Elements
const popup = document.getElementById("address-popup");
const addBtn = document.getElementById("add-address-btn");
const closeBtn = document.getElementById("close-popup");
const form = document.getElementById("address-form");
const addressList = document.getElementById("address-list");

// Load Addresses
let addresses = JSON.parse(localStorage.getItem("addresses")) || [];

// ==========================
// Open Popup
// ==========================

addBtn.addEventListener("click", () => {

    popup.classList.add("active");

});

// ==========================
// Close Popup
// ==========================

closeBtn.addEventListener("click", () => {

    popup.classList.remove("active");

});

// Click Outside

popup.addEventListener("click", (e) => {

    if (e.target === popup) {

        popup.classList.remove("active");

    }

});

// ==========================
// Render Addresses
// ==========================

function renderAddresses() {

    addressList.innerHTML = "";

    if (addresses.length === 0) {

        addressList.innerHTML = `

        <div class="empty-address">

            <i class="fa-solid fa-location-dot"></i>

            <h2>No Saved Address</h2>

            <p>Add your first delivery address.</p>

        </div>

        `;

        return;

    }

    addresses.forEach((item, index) => {

        addressList.innerHTML += `

        <div class="address-card">

            <h3>${item.type}</h3>

            <p>

                <strong>${item.name}</strong><br>

                ${item.mobile}<br>

                ${item.house}, ${item.street}<br>

                ${item.city} - ${item.pincode}

            </p>

            <div class="address-actions">

                <button
                    class="delete-btn"
                    onclick="deleteAddress(${index})">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

// ==========================
// Save Address
// ==========================

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const type = document.querySelector(".type-btn.active").innerText;

    const name = document.getElementById("full-name").value;

    const mobile = document.getElementById("mobile").value;

    const house = document.getElementById("house").value;

    const street = document.getElementById("street").value;

    const city = document.getElementById("city").value;

    const pincode = document.getElementById("pincode").value;

    addresses.push({

        type,
        name,
        mobile,
        house,
        street,
        city,
        pincode

    });

    localStorage.setItem(

        "addresses",

        JSON.stringify(addresses)

    );

    form.reset();

    document.getElementById("city").value = "Afzalpur";

    popup.classList.remove("active");

    renderAddresses();

});

// ==========================
// Delete
// ==========================

function deleteAddress(index) {

    if (confirm("Delete this address?")) {

        addresses.splice(index, 1);

        localStorage.setItem(

            "addresses",

            JSON.stringify(addresses)

        );

        renderAddresses();

    }

}

// ==========================
// Home / Work Button
// ==========================

const typeBtns = document.querySelectorAll(".type-btn");

typeBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        typeBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

    });

});

// Start

renderAddresses();