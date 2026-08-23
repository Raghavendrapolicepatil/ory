// ==========================================
// ORYMART LOCATION + 5 KM DELIVERY CHECK
// ==========================================

const locationText = document.getElementById("location-name");

// ==========================================
// ORYMART DELIVERY CONFIG
// ==========================================

// IMPORTANT:
// Yahan apne OryMart store / village ka exact
// latitude and longitude daalo.

const ORYMART_LOCATION = {
    latitude: 17.2056196,   // <-- YOUR LATITUDE
    longitude: 76.3641935  // <-- YOUR LONGITUDE
};

const DELIVERY_RADIUS_KM = 5;


// ==========================================
// CALCULATE DISTANCE
// ==========================================

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}


// ==========================================
// CHECK DELIVERY AREA
// ==========================================

function checkDeliveryArea(lat, lon, city) {

    const distance = calculateDistance(
        lat,
        lon,
        ORYMART_LOCATION.latitude,
        ORYMART_LOCATION.longitude
    );

    console.log("User distance:", distance.toFixed(2), "KM");


    // ======================================
    // WITHIN 5 KM
    // ======================================

    if (distance <= DELIVERY_RADIUS_KM) {

        const userLocation = {

            city: city,

            latitude: lat,

            longitude: lon,

            distance: Number(distance.toFixed(2)),

            deliveryAvailable: true

        };


        localStorage.setItem(
            "userLocation",
            JSON.stringify(userLocation)
        );

        localStorage.setItem(
            "userCity",
            city
        );


        locationText.textContent = city;

        return true;
    }


    // ======================================
    // OUTSIDE 5 KM
    // ======================================

    const userLocation = {

        city: city,

        latitude: lat,

        longitude: lon,

        distance: Number(distance.toFixed(2)),

        deliveryAvailable: false

    };


    localStorage.setItem(
        "userLocation",
        JSON.stringify(userLocation)
    );


    localStorage.setItem(
        "userCity",
        city
    );


    locationText.textContent = "Coming Soon";


    // Redirect to Coming Soon page

    setTimeout(() => {

        window.location.href = "coming-soon.html";

    }, 500);


    return false;
}


// ==========================================
// SHOW SAVED LOCATION
// ==========================================

const savedLocation =
    JSON.parse(localStorage.getItem("userLocation"));


if (savedLocation) {

    if (savedLocation.deliveryAvailable === false) {

        locationText.textContent = "Coming Soon";

    } else {

        locationText.textContent =
            savedLocation.city || "Select Location";

    }

} else {

    locationText.textContent = "Select Location";

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


                const city =
                    data.address.city ||
                    data.address.city_district ||
                    data.address.county ||
                    data.address.town ||
                    data.address.suburb ||
                    data.address.village ||
                    data.address.municipality ||
                    data.address.state ||
                    "Unknown";


                // ==================================
                // CHECK 5 KM
                // ==================================

                checkDeliveryArea(
                    lat,
                    lon,
                    city
                );

            } catch (error) {

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
// ASK LOCATION ONLY AFTER USER CLICK
// ==========================================

locationText.addEventListener(
    "click",
    getUserLocation
);