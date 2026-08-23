// ==========================================
// ORYMART LOCATION + ADMIN DELIVERY CHECK
// ==========================================

const API = "https://snackible-backend.onrender.com/api/settings";

const locationText = document.getElementById("location-name");


// ==========================================
// DISTANCE CALCULATOR
// ==========================================

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}


// ==========================================
// GET ADMIN DELIVERY SETTINGS
// ==========================================

async function getDeliverySettings() {

    const response = await fetch(API);

    if (!response.ok) {
        throw new Error("Unable to load delivery settings");
    }

    return await response.json();
}


// ==========================================
// CHECK DELIVERY AREA
// ==========================================

async function checkDeliveryArea(lat, lon, city) {

    try {

        const settings = await getDeliverySettings();

        console.log("Admin Delivery Settings:", settings);


        // ======================================
        // DELIVERY SERVICE OFF
        // ======================================

        if (settings.deliveryEnabled === false) {

            saveLocation(
                city,
                lat,
                lon,
                null,
                false
            );

            locationText.textContent = "Coming Soon";

            setTimeout(() => {
                window.location.href = "coming-soon.html";
            }, 500);

            return false;
        }


        // ======================================
        // ADMIN STORE LOCATION
        // ======================================

        const storeLat = Number(settings.storeLatitude);
        const storeLon = Number(settings.storeLongitude);

        const radius = Number(settings.deliveryRadius);


        // ======================================
        // CHECK VALID SETTINGS
        // ======================================

        if (
            !Number.isFinite(storeLat) ||
            !Number.isFinite(storeLon) ||
            !Number.isFinite(radius) ||
            radius <= 0
        ) {

            console.error(
                "Invalid delivery settings:",
                settings
            );

            locationText.textContent =
                "Location Error";

            return false;
        }


        // ======================================
        // CALCULATE DISTANCE
        // ======================================

        const distance = calculateDistance(
            lat,
            lon,
            storeLat,
            storeLon
        );


        console.log(
            `User distance: ${distance.toFixed(2)} KM`
        );

        console.log(
            `Allowed radius: ${radius} KM`
        );


        // ======================================
        // WITHIN DELIVERY AREA
        // ======================================

        if (distance <= radius) {

            saveLocation(
                city,
                lat,
                lon,
                distance,
                true
            );

            locationText.textContent = city;

            return true;
        }


        // ======================================
        // OUTSIDE DELIVERY AREA
        // ======================================

        saveLocation(
            city,
            lat,
            lon,
            distance,
            false
        );

        locationText.textContent = "Coming Soon";


        setTimeout(() => {

            window.location.href =
                "coming-soon.html";

        }, 500);


        return false;

    }

    catch (error) {

        console.error(
            "Delivery Check Error:",
            error
        );

        locationText.textContent =
            "Location Error";

        return false;
    }
}


// ==========================================
// SAVE USER LOCATION
// ==========================================

function saveLocation(
    city,
    lat,
    lon,
    distance,
    deliveryAvailable
) {

    const userLocation = {

        city: city,

        latitude: lat,

        longitude: lon,

        distance:
            distance !== null
                ? Number(distance.toFixed(2))
                : null,

        deliveryAvailable:
            deliveryAvailable

    };


    localStorage.setItem(
        "userLocation",
        JSON.stringify(userLocation)
    );

    localStorage.setItem(
        "userCity",
        city
    );
}


// ==========================================
// SHOW SAVED LOCATION
// ==========================================

async function checkSavedLocation() {

    const savedLocation =
        JSON.parse(
            localStorage.getItem("userLocation")
        );


    if (!savedLocation) {

        locationText.textContent =
            "Select Location";

        return;
    }


    // If previously marked outside area
    if (
        savedLocation.deliveryAvailable === false
    ) {

        locationText.textContent =
            "Coming Soon";

        return;
    }


    locationText.textContent =
        savedLocation.city ||
        "Select Location";
}


// ==========================================
// GET USER LOCATION
// ==========================================

async function getUserLocation() {

    if (!navigator.geolocation) {

        locationText.textContent =
            "Not Supported";

        return;
    }


    locationText.textContent =
        "Getting Location...";


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;


            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );


                const data =
                    await response.json();


                const address =
                    data.address || {};


                const city =
                    address.city ||
                    address.city_district ||
                    address.county ||
                    address.town ||
                    address.suburb ||
                    address.village ||
                    address.municipality ||
                    address.state ||
                    "Unknown";


                // ==================================
                // CHECK AGAINST ADMIN SETTINGS
                // ==================================

                await checkDeliveryArea(
                    lat,
                    lon,
                    city
                );

            }

            catch (error) {

                console.error(error);

                locationText.textContent =
                    "Location Error";
            }

        },

        (error) => {

            console.error(error);

            locationText.textContent =
                "Select Location";

        },

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 300000

        }

    );
}


// ==========================================
// INITIALIZE
// ==========================================

checkSavedLocation();


// ==========================================
// ASK LOCATION AFTER CLICK
// ==========================================

locationText.addEventListener(
    "click",
    getUserLocation
);