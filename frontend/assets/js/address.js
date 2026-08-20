// ==========================================
// Orymart Address Manager
// ==========================================


// ==========================================
// Elements
// ==========================================

const popup =
    document.getElementById("address-popup");

const addBtn =
    document.getElementById("add-address-btn");

const closeBtn =
    document.getElementById("close-popup");

const form =
    document.getElementById("address-form");

const addressList =
    document.getElementById("address-list");

const currentLocationBtn =
    document.getElementById("current-location-btn");

const locationStatus =
    document.getElementById("location-status");

const locationInfo =
    document.getElementById("location-info");

const popupTitle =
    document.getElementById("popup-title");

const saveAddressBtn =
    document.getElementById("save-address-btn");


// ==========================================
// Inputs
// ==========================================

const nameInput =
    document.getElementById("full-name");

const mobileInput =
    document.getElementById("mobile");

const houseInput =
    document.getElementById("house");

const streetInput =
    document.getElementById("street");

const cityInput =
    document.getElementById("city");

const pincodeInput =
    document.getElementById("pincode");


// ==========================================
// Address Storage
// ==========================================

let addresses =
    JSON.parse(localStorage.getItem("addresses")) || [];


// Currently editing address
let editingIndex = null;


// Current selected address type
let selectedType = "Home";


// ==========================================
// Save Storage
// ==========================================

function saveAddresses() {

    localStorage.setItem(
        "addresses",
        JSON.stringify(addresses)
    );

}


// ==========================================
// Open Add Popup
// ==========================================

addBtn.addEventListener("click", () => {

    editingIndex = null;

    popupTitle.textContent =
        "Add New Address";

    saveAddressBtn.innerHTML =
        `<i class="fa-solid fa-check"></i>
         Save Address`;

    resetForm();

    popup.classList.add("active");

});


// ==========================================
// Close Popup
// ==========================================

closeBtn.addEventListener("click", () => {

    popup.classList.remove("active");

});


// ==========================================
// Click Outside
// ==========================================

popup.addEventListener("click", (e) => {

    if (e.target === popup) {

        popup.classList.remove("active");

    }

});


// ==========================================
// Address Type
// ==========================================

const typeBtns =
    document.querySelectorAll(".type-btn");

typeBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        typeBtns.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        selectedType =
            btn.dataset.type;

    });

});


// ==========================================
// Reset Form
// ==========================================

function resetForm() {

    form.reset();

    selectedType = "Home";

    typeBtns.forEach(btn => {

        btn.classList.remove("active");

        if (btn.dataset.type === "Home") {

            btn.classList.add("active");

        }

    });

    cityInput.value = "Afzalpur";

    locationStatus.textContent = "";

    locationInfo.classList.add("hidden");

}


// ==========================================
// Render Addresses
// ==========================================

function renderAddresses() {

    addressList.innerHTML = "";


    // No address
    if (addresses.length === 0) {

        addressList.innerHTML = `

            <div class="empty-address">

                <div class="empty-icon">

                    <i class="fa-solid fa-location-dot"></i>

                </div>

                <h2>No Saved Address</h2>

                <p>
                    Add your delivery address to continue.
                </p>

            </div>

        `;

        return;

    }


    addresses.forEach((item, index) => {

        const isDefault =
            item.isDefault === true;


        const typeIcon =
            item.type === "Home"
                ? "fa-house"
                : item.type === "Work"
                    ? "fa-briefcase"
                    : "fa-location-dot";


        const card =
            document.createElement("div");

        card.className =
            `address-card ${isDefault ? "selected" : ""}`;


        card.innerHTML = `

            <div
                class="address-select"
                onclick="selectAddress(${index})">

                <div class="address-icon">

                    <i class="fa-solid ${typeIcon}"></i>

                </div>


                <div class="address-main">

                    <div class="address-title">

                        <strong>
                            ${escapeHTML(item.type)}
                        </strong>

                        ${
                            isDefault
                                ? `
                                <span class="default-badge">
                                    Selected
                                </span>
                                `
                                : ""
                        }

                    </div>


                    <p class="address-name">

                        ${escapeHTML(item.name)}

                    </p>


                    <p class="address-text">

                        ${escapeHTML(item.house)},
                        ${escapeHTML(item.street)}<br>

                        ${escapeHTML(item.city)}
                        -
                        ${escapeHTML(item.pincode)}

                    </p>


                    <p class="address-mobile">

                        <i class="fa-solid fa-phone"></i>

                        ${escapeHTML(item.mobile)}

                    </p>

                </div>

            </div>


            <div class="address-actions">

                <button
                    class="pin-btn ${isDefault ? "active" : ""}"
                    onclick="selectAddress(${index})"
                    title="Select address">

                    <i class="fa-solid fa-thumbtack"></i>

                </button>


                <button
                    class="edit-btn"
                    onclick="editAddress(${index})"
                    title="Edit address">

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteAddress(${index})"
                    title="Delete address">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;


        addressList.appendChild(card);

    });

}


// ==========================================
// Select / Pin Address
// ==========================================

function selectAddress(index) {

    addresses.forEach((address, i) => {

        address.isDefault =
            i === index;

    });


    saveAddresses();

    renderAddresses();

}


// ==========================================
// Edit Address
// ==========================================

function editAddress(index) {

    const item =
        addresses[index];

    if (!item) return;


    editingIndex = index;


    popupTitle.textContent =
        "Edit Address";


    saveAddressBtn.innerHTML =
        `<i class="fa-solid fa-check"></i>
         Update Address`;


    nameInput.value =
        item.name || "";

    mobileInput.value =
        item.mobile || "";

    houseInput.value =
        item.house || "";

    streetInput.value =
        item.street || "";

    cityInput.value =
        item.city || "Afzalpur";

    pincodeInput.value =
        item.pincode || "";


    selectedType =
        item.type || "Home";


    typeBtns.forEach(btn => {

        btn.classList.toggle(
            "active",
            btn.dataset.type === selectedType
        );

    });


    if (item.latitude && item.longitude) {

        locationInfo.classList.remove("hidden");

        locationStatus.textContent =
            "Saved location available 📍";

    } else {

        locationInfo.classList.add("hidden");

    }


    popup.classList.add("active");

}


// ==========================================
// Delete Address
// ==========================================

function deleteAddress(index) {

    const item =
        addresses[index];

    if (!item) return;


    const confirmDelete =
        confirm(
            `Delete ${item.type} address?`
        );


    if (!confirmDelete) return;


    const wasDefault =
        item.isDefault === true;


    addresses.splice(index, 1);


    // If deleted address was selected
    // select first remaining address

    if (
        wasDefault &&
        addresses.length > 0
    ) {

        addresses[0].isDefault = true;

    }


    saveAddresses();

    renderAddresses();

}


// ==========================================
// Save / Update Address
// ==========================================

form.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();


        const name =
            nameInput.value.trim();

        const mobile =
            mobileInput.value.trim();

        const house =
            houseInput.value.trim();

        const street =
            streetInput.value.trim();

        const city =
            cityInput.value.trim();

        const pincode =
            pincodeInput.value.trim();


        // Mobile validation

        if (!/^[0-9]{10}$/.test(mobile)) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;

        }


        // Pincode validation

        if (!/^[0-9]{6}$/.test(pincode)) {

            alert(
                "Please enter a valid 6-digit pincode."
            );

            return;

        }


        const oldAddress =
            editingIndex !== null
                ? addresses[editingIndex]
                : null;


      const addressData = {

    type: selectedType,

    name,

    mobile,

    house,

    street,

    city,

    pincode,

    latitude:
        form.dataset.latitude ||
        oldAddress?.latitude ||
        null,

    longitude:
        form.dataset.longitude ||
        oldAddress?.longitude ||
        null,

    isDefault:
        oldAddress?.isDefault ||
        addresses.length === 0

};


        // Update

        if (editingIndex !== null) {

            addresses[editingIndex] =
                addressData;

        }

        // New address

        else {

            addresses.push(addressData);

        }


        saveAddresses();

        popup.classList.remove("active");

        resetForm();

        editingIndex = null;

        renderAddresses();

    }
);


// ==========================================
// Current Location
// ==========================================

currentLocationBtn.addEventListener(
    "click",
    getCurrentLocation
);


function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert(
            "Location is not supported by your browser."
        );

        return;

    }


    currentLocationBtn.disabled = true;


    currentLocationBtn.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Getting Location...

    `;


    locationStatus.textContent =
        "Please allow location access...";


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            locationStatus.textContent =
                "Location detected. Finding address...";


            try {

                const address =
                    await reverseGeocode(
                        latitude,
                        longitude
                    );


                if (address) {

                    if (address.house) {

                        houseInput.value =
                            address.house;

                    }


                    if (address.street) {

                        streetInput.value =
                            address.street;

                    }


                    if (address.city) {

                        cityInput.value =
                            address.city;

                    }


                    if (address.pincode) {

                        pincodeInput.value =
                            address.pincode;

                    }


                    locationInfo.classList.remove(
                        "hidden"
                    );


                    locationStatus.textContent =
                        "Current location added 📍";


                    // Temporary coordinates
                    // attached to form

                    form.dataset.latitude =
                        latitude;

                    form.dataset.longitude =
                        longitude;

                }

                else {

                    locationStatus.textContent =
                        "Location found, but address could not be detected.";

                }

            }

            catch (error) {

                console.error(
                    "Reverse Geocode Error:",
                    error
                );

                locationStatus.textContent =
                    "Location detected. Please enter address manually.";

                form.dataset.latitude =
                    latitude;

                form.dataset.longitude =
                    longitude;

            }


            resetLocationButton();

        },

        (error) => {

            console.error(
                "Location Error:",
                error
            );


            if (error.code === 1) {

                locationStatus.textContent =
                    "Location permission denied.";

                alert(
                    "Please allow location permission to use Current Location."
                );

            }

            else if (error.code === 2) {

                locationStatus.textContent =
                    "Unable to detect your location.";

            }

            else {

                locationStatus.textContent =
                    "Location request timed out.";

            }


            resetLocationButton();

        },

        {

            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 60000

        }

    );

}


// ==========================================
// Reverse Geocoding
// OpenStreetMap
// ==========================================

async function reverseGeocode(
    latitude,
    longitude
) {

    const url =
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;


    const response =
        await fetch(url, {

            headers: {

                "Accept":
                    "application/json"

            }

        });


    if (!response.ok) {

        throw new Error(
            "Unable to find address"
        );

    }


    const data =
        await response.json();


    const address =
        data.address || {};


    return {

        house:
            address.house_number ||
            "",

        street:
            address.road ||
            address.suburb ||
            address.neighbourhood ||
            "",

        city:
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            "Afzalpur",

        pincode:
            address.postcode ||
            ""

    };

}


// ==========================================
// Reset Location Button
// ==========================================

function resetLocationButton() {

    currentLocationBtn.disabled = false;

    currentLocationBtn.innerHTML = `

        <i class="fa-solid fa-location-crosshairs"></i>

        <span>Use Current Location</span>

    `;

}


// ==========================================
// Escape HTML
// Prevent HTML injection
// ==========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// Start
// ==========================================

renderAddresses();