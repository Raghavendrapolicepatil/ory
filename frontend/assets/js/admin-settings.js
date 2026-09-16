// ==========================================
// Orymart Admin Settings
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


// ==========================================
// DELIVERY LOCATION
// ==========================================

const deliveryEnabled = document.getElementById("deliveryEnabled");
const serviceArea = document.getElementById("serviceArea");
const deliveryRadius = document.getElementById("deliveryRadius");
const storeLatitude = document.getElementById("storeLatitude");
const storeLongitude = document.getElementById("storeLongitude");


const saveBtn = document.getElementById("saveSettings");


// ==========================================
// LOAD SETTINGS
// ==========================================

async function loadSettings() {

    try {

        const res = await fetch(API);

        const data = await res.json();


        // Store
        storeName.value = data.storeName || "";
        storePhone.value = data.storePhone || "";
        storeEmail.value = data.storeEmail || "";
        storeAddress.value = data.storeAddress || "";


        // Delivery
        deliveryCharge.value = data.deliveryCharge ?? 0;
        freeDeliveryAbove.value = data.freeDeliveryAbove ?? 5;
        minimumOrder.value = data.minimumOrder ?? 5;
        deliveryTime.value = data.deliveryTime || "20-30 mins";


        // Fees
        platformFee.value = data.platformFee ?? 0;


        // Gift
        freeGiftAbove.value = data.freeGiftAbove ?? 499;
        giftProduct.value = data.giftProduct || "";


        // Contact
        supportNumber.value = data.supportNumber || "";
        whatsappNumber.value = data.whatsappNumber || "";


        // Store Status
        storeStatus.value = data.storeStatus || "Open";


        // ======================================
        // DELIVERY LOCATION
        // ======================================

        deliveryEnabled.checked =
            data.deliveryEnabled ?? true;

        serviceArea.value =
            data.serviceArea || "Afzalpur";

        deliveryRadius.value =
            data.deliveryRadius ?? 5;

        storeLatitude.value =
            data.storeLatitude ?? "";

        storeLongitude.value =
            data.storeLongitude ?? "";


    }

    catch (err) {

        console.log("Settings Load Error:", err);

    }

}


// ==========================================
// SAVE SETTINGS
// ==========================================

saveBtn.addEventListener("click", async () => {

    try {

        const body = {

            // Store
            storeName: storeName.value,
            storePhone: storePhone.value,
            storeEmail: storeEmail.value,
            storeAddress: storeAddress.value,


            // Delivery
            deliveryCharge: Number(deliveryCharge.value),
            freeDeliveryAbove: Number(freeDeliveryAbove.value),
            minimumOrder: Number(minimumOrder.value),
            deliveryTime: deliveryTime.value,


            // Fees
            platformFee: Number(platformFee.value),


            // Gift
            freeGiftAbove: Number(freeGiftAbove.value),
            giftProduct: giftProduct.value,


            // Contact
            supportNumber: supportNumber.value,
            whatsappNumber: whatsappNumber.value,


            // Store Status
            storeStatus: storeStatus.value,


            // ==================================
            // DELIVERY LOCATION
            // ==================================

            deliveryEnabled:
                deliveryEnabled.checked,

            serviceArea:
                serviceArea.value,

            deliveryRadius:
                Number(deliveryRadius.value),

            storeLatitude:
                Number(storeLatitude.value),

            storeLongitude:
                Number(storeLongitude.value)

        };


        const res = await fetch(API, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(body)

        });


        const data = await res.json();


        if (!res.ok) {

            throw new Error(
                data.message || "Settings update failed"
            );

        }


        alert(
            data.message ||
            "Settings Saved Successfully"
        );


    }

    catch (err) {

        console.log("Settings Save Error:", err);

        alert(
            err.message ||
            "Unable to save settings"
        );

    }

});


// ==========================================
// START
// ==========================================

loadSettings();