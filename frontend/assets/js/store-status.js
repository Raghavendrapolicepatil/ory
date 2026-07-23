const API = "https://snackible-backend.onrender.com/api/settings";

async function checkStore() {

    try {

        const response = await fetch(API);

        const settings = await response.json();

        console.log("Store Status:", settings.storeStatus);

        if (settings.storeStatus === "Closed") {

            window.location.href = "coming-soon.html";

        }

    }

    catch (error) {

        console.log(error);

    }

}

checkStore();