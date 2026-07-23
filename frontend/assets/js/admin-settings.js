// ==========================================
// Patil Groceries Admin Settings
// ==========================================

const API = "https://snackible-backend.onrender.com/api/settings";

const storeName = document.getElementById("storeName");
const storePhone = document.getElementById("storePhone");
const storeEmail = document.getElementById("storeEmail");
const storeAddress = document.getElementById("storeAddress");

const deliveryCharge = document.getElementById("deliveryCharge");
const freeDeliveryAbove = document.getElementById("freeDeliveryAbove");
const minimumOrder = document.getElementById("minimumOrder");
const deliveryTime = document.getElementById("deliveryTime");

const platformFee = document.getElementById("platformFee");

const freeGiftAbove = document.getElementById("freeGiftAbove");
const giftProduct = document.getElementById("giftProduct");

const supportNumber = document.getElementById("supportNumber");
const whatsappNumber = document.getElementById("whatsappNumber");

const storeStatus = document.getElementById("storeStatus");

const saveBtn = document.getElementById("saveSettings");

// ==========================================
// Load Settings
// ==========================================

async function loadSettings() {

    try {

        const res = await fetch(API);

        const data = await res.json();

        storeName.value = data.storeName || "";
        storePhone.value = data.storePhone || "";
        storeEmail.value = data.storeEmail || "";
        storeAddress.value = data.storeAddress || "";

        deliveryCharge.value = data.deliveryCharge || 20;
        freeDeliveryAbove.value = data.freeDeliveryAbove || 199;
        minimumOrder.value = data.minimumOrder || 99;
        deliveryTime.value = data.deliveryTime || "20-30 mins";

        platformFee.value = data.platformFee || 0;

        freeGiftAbove.value = data.freeGiftAbove || 499;
        giftProduct.value = data.giftProduct || "";

        supportNumber.value = data.supportNumber || "";
        whatsappNumber.value = data.whatsappNumber || "";

        storeStatus.value = data.storeStatus || "Open";

    }

    catch (err) {

        console.log(err);

    }

}

// ==========================================
// Save Settings
// ==========================================

saveBtn.addEventListener("click", async () => {

    try {

        const body = {

            storeName: storeName.value,
            storePhone: storePhone.value,
            storeEmail: storeEmail.value,
            storeAddress: storeAddress.value,

            deliveryCharge: Number(deliveryCharge.value),
            freeDeliveryAbove: Number(freeDeliveryAbove.value),
            minimumOrder: Number(minimumOrder.value),
            deliveryTime: deliveryTime.value,

            platformFee: Number(platformFee.value),

            freeGiftAbove: Number(freeGiftAbove.value),
            giftProduct: giftProduct.value,

            supportNumber: supportNumber.value,
            whatsappNumber: whatsappNumber.value,

            storeStatus: storeStatus.value

        };

        const res = await fetch(API, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(body)

        });

        const data = await res.json();

        alert(data.message || "Settings Saved");

    }

    catch (err) {

        console.log(err);

        alert("Unable to save settings");

    }

});

// ==========================================
// Start
// ==========================================

loadSettings();