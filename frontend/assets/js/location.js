const locationText = document.getElementById("location-name");

const savedLocation = JSON.parse(localStorage.getItem("userLocation"));


// ==========================================
// SHOW SAVED LOCATION
// ==========================================

if (savedLocation) {

    locationText.textContent = savedLocation.city;

} else {

    // Do NOT ask location permission on page load
    locationText.textContent = "Select Location";

}


// ==========================================
// GET USER LOCATION
// ==========================================

async function getUserLocation() {

    if (!navigator.geolocation) {

        locationText.textContent = "Not Supported";

        return;

    }

    locationText.textContent = "Getting Location...";


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );

                const data = await response.json();


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


                locationText.textContent = city;


                const userLocation = {

                    city: city,

                    latitude: lat,

                    longitude: lon

                };


                localStorage.setItem(
                    "userLocation",
                    JSON.stringify(userLocation)
                );

                localStorage.setItem(
                    "userCity",
                    city
                );


            } catch (error) {

                console.error(error);

                locationText.textContent = "Location Error";

            }

        },

        () => {

            locationText.textContent = "Select Location";

        }

    );

}


// ==========================================
// ASK LOCATION ONLY AFTER USER CLICK
// ==========================================

locationText.addEventListener("click", getUserLocation);