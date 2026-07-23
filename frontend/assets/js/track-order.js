/* ==========================================
   TRACK ORDER - PART 1
========================================== */

/* ===========================
   API CONFIG
=========================== */

const API_BASE_URL = "https://snackible-backend.onrender.com/api/orders";

/* ===========================
   STORE LOCATION
=========================== */

const STORE_LOCATION = {

    lat: 17.2056361,

    lng: 76.3641882,

    name: "Patil Groceries"

};

/* ===========================
   GLOBAL VARIABLES
=========================== */

let currentOrder = null;

let map = null;

let customerMarker = null;

let storeMarker = null;

let routeLine = null;

/* ===========================
   DOM ELEMENTS
=========================== */

const orderIdElement = document.getElementById("order-id");

const orderDateElement = document.getElementById("order-date");

const distanceElement = document.getElementById("distance");

const etaElement = document.getElementById("eta");

const loader = document.querySelector(".page-loader");

/* ===========================
   GET ORDER ID
=========================== */

function getOrderId() {

    const params = new URLSearchParams(window.location.search);

    return params.get("id");

}

/* ===========================
   FORMAT DATE
=========================== */

function formatDate(dateString) {

    if (!dateString) return "--";

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit"

    });

}

/* ===========================
   SHOW LOADER
=========================== */

function showLoader() {

    if (loader) {

        loader.classList.remove("hidden");

    }

}

/* ===========================
   HIDE LOADER
=========================== */

function hideLoader() {

    if (loader) {

        loader.classList.add("hidden");

    }

}

/* ===========================
   LOAD ORDER
=========================== */

async function loadOrder() {

    const orderId = getOrderId();

    if (!orderId) {

        alert("Invalid Order ID");

        return;

    }

    try {

        showLoader();

        const response = await fetch(`${API_BASE_URL}/${orderId}`);

        if (!response.ok) {

            throw new Error("Order not found");

        }

        currentOrder = await response.json();

        renderOrder();

    }

    catch (error) {

        console.error("Load Order Error:", error);

        alert("Unable to load order.");

    }

    finally {

        hideLoader();

    }

}

/* ===========================
   RENDER BASIC INFO
=========================== */

function renderOrder() {

    if (!currentOrder) return;

    orderIdElement.textContent =

        currentOrder.orderId || currentOrder._id;

    orderDateElement.textContent =

        formatDate(currentOrder.createdAt);

    updateTrackingPage();

}
/* ==========================================
   TRACK ORDER - PART 2
========================================== */

/* ===========================
   STATUS ORDER
=========================== */

const ORDER_STATUS = [

    "Pending",

    "Packed",

    "Out for Delivery",

    "Delivered"

];

/* ===========================
   TIMELINE IDS
=========================== */

const TIMELINE = {

    "Pending": "status-pending",

    "Packed": "status-packed",

    "Out for Delivery": "status-out",

    "Delivered": "status-delivered"

};

/* ===========================
   UPDATE TIMELINE
=========================== */

function updateTimeline(status) {

    document.querySelectorAll(".timeline-item").forEach(item => {

        item.classList.remove("completed");

        item.classList.remove("active");

    });

    const currentIndex = ORDER_STATUS.indexOf(status);

    ORDER_STATUS.forEach((step, index) => {

        const element = document.getElementById(TIMELINE[step]);

        if (!element) return;

        if (index < currentIndex) {

            element.classList.add("completed");

        }

        else if (index === currentIndex) {

            element.classList.add("active");

        }

    });

    toggleTrackingSections(status);

}

/* ===========================
   SHOW / HIDE TRACKING
=========================== */

function toggleTrackingSections(status) {

    const mapSection = document.getElementById("tracking-map");

    const detailSection = document.querySelector(".delivery-details");

    const partnerSection = document.querySelector(".partner-section");

    const showTracking = status === "Out for Delivery";

    if (mapSection) {

        mapSection.style.display = showTracking ? "block" : "none";

    }

    if (detailSection) {

        detailSection.style.display = showTracking ? "block" : "none";

    }

    if (partnerSection) {

        partnerSection.style.display = showTracking ? "block" : "none";

    }

}

/* ===========================
   UPDATE PARTNER INFO
=========================== */

function updatePartnerInfo() {

    if (!currentOrder) return;

    const partner = currentOrder.deliveryPartner || {};

    const partnerName = document.getElementById("partner-name");

    const partnerPhone = document.getElementById("partner-phone");

    const callPartner = document.getElementById("call-partner");

    if (partnerName) {

        partnerName.textContent =

            partner.name || "Delivery Partner";

    }

    if (partnerPhone) {

        partnerPhone.textContent =

            partner.phone || "--";

    }

    if (callPartner) {

        if (partner.phone) {

            callPartner.href = `tel:${partner.phone}`;

            callPartner.style.pointerEvents = "auto";

            callPartner.style.opacity = "1";

        }

        else {

            callPartner.removeAttribute("href");

            callPartner.style.pointerEvents = "none";

            callPartner.style.opacity = "0.5";

        }

    }

}

/* ===========================
   UPDATE PAGE
=========================== */

function updateTrackingPage() {

    if (!currentOrder) return;

    updateTimeline(currentOrder.status);

    updatePartnerInfo();

    if (currentOrder.status === "Out for Delivery") {

        initializeMap();

    }

}
/* ==========================================
   TRACK ORDER - PART 3
========================================== */

/* ===========================
   INITIALIZE MAP
=========================== */

function initializeMap() {

    if (!currentOrder) return;

    if (currentOrder.status !== "Out for Delivery") return;

    const customer = currentOrder.location;

    if (
        !customer ||
        customer.latitude == null ||
        customer.longitude == null
    ) {

        console.warn("Customer location not found.");

        return;

    }

    if (map) {

        map.remove();

    }

    map = L.map("delivery-map");

    map.setView(
        [
            STORE_LOCATION.lat,
            STORE_LOCATION.lng
        ],
        13
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(map);

    addMarkers(customer);

}

/* ===========================
   ADD MARKERS
=========================== */

function addMarkers(customer) {

    storeMarker = L.marker([
        STORE_LOCATION.lat,
        STORE_LOCATION.lng
    ])
    .addTo(map)
    .bindPopup("<b>🏪 Patil Groceries</b>");

    customerMarker = L.marker([
        Number(customer.latitude),
        Number(customer.longitude)
    ])
    .addTo(map)
    .bindPopup("<b>📍 Delivery Address</b>");

    drawRoute(customer);

}

/* ===========================
   DRAW ROUTE
=========================== */

function drawRoute(customer) {

    if (routeLine) {

        map.removeLayer(routeLine);

    }

    routeLine = L.polyline(
        [
            [
                STORE_LOCATION.lat,
                STORE_LOCATION.lng
            ],
            [
                Number(customer.latitude),
                Number(customer.longitude)
            ]
        ],
        {
            color: "#0C831F",
            weight: 5,
            opacity: 0.9
        }
    ).addTo(map);

    map.fitBounds(routeLine.getBounds(), {

        padding: [40, 40]

    });

    updateRouteDetails(customer);

}
/* ==========================================
   TRACK ORDER - PART 4
========================================== */

/* ===========================
   TO RADIANS
=========================== */

function toRadians(value) {

    return value * Math.PI / 180;

}

/* ===========================
   CALCULATE DISTANCE
=========================== */

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = toRadians(lat2 - lat1);

    const dLon = toRadians(lon2 - lon1);

    const a =

        Math.sin(dLat / 2) *

        Math.sin(dLat / 2) +

        Math.cos(toRadians(lat1)) *

        Math.cos(toRadians(lat2)) *

        Math.sin(dLon / 2) *

        Math.sin(dLon / 2);

    const c =

        2 *

        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1 - a)

        );

    return R * c;

}

/* ===========================
   ETA CALCULATION
=========================== */

function calculateETA(distance) {

    // Average delivery speed 25 km/h

    const averageSpeed = 25;

    const hours = distance / averageSpeed;

    const minutes = Math.round(hours * 60);

    return Math.max(5, minutes);

}

/* ===========================
   UPDATE DELIVERY INFO
=========================== */

function updateDeliveryInfo(customer) {

    if (!customer) return;

    const distance = calculateDistance(

        STORE_LOCATION.lat,

        STORE_LOCATION.lng,

        Number(customer.latitude),

        Number(customer.longitude)

    );

    const eta = calculateETA(distance);

    if (distanceElement) {

        distanceElement.textContent =

            `${distance.toFixed(1)} km`;

    }

    if (etaElement) {

        etaElement.textContent =

            `${eta} mins`;

    }

}

/* ===========================
   UPDATE ROUTE DETAILS
=========================== */

function updateRouteDetails(customer) {

    updateDeliveryInfo(customer);

}
/* ==========================================
   TRACK ORDER - PART 5
========================================== */

/* ===========================
   AUTO REFRESH
=========================== */

let refreshInterval = null;

function startAutoRefresh() {

    stopAutoRefresh();

    refreshInterval = setInterval(async () => {

        try {

            const orderId = getOrderId();

            if (!orderId) return;

            const response = await fetch(`${API_BASE_URL}/${orderId}`);

            if (!response.ok) return;

            const latestOrder = await response.json();

            if (!currentOrder) {

                currentOrder = latestOrder;

                renderOrder();

                return;

            }

            if (

                latestOrder.status !== currentOrder.status ||

                JSON.stringify(latestOrder.location) !==
                JSON.stringify(currentOrder.location)

            ) {

                currentOrder = latestOrder;

                renderOrder();

            }

        }

        catch (error) {

            console.error("Auto Refresh Error:", error);

        }

    }, 10000);

}

/* ===========================
   STOP REFRESH
=========================== */

function stopAutoRefresh() {

    if (refreshInterval) {

        clearInterval(refreshInterval);

        refreshInterval = null;

    }

}

/* ===========================
   PAGE VISIBILITY
=========================== */

document.addEventListener(

    "visibilitychange",

    () => {

        if (document.hidden) {

            stopAutoRefresh();

        }

        else {

            startAutoRefresh();

        }

    }

);

/* ===========================
   DESTROY MAP
=========================== */

function destroyMap() {

    if (map) {

        map.remove();

        map = null;

    }

    customerMarker = null;

    storeMarker = null;

    routeLine = null;

}

/* ===========================
   WINDOW UNLOAD
=========================== */

window.addEventListener(

    "beforeunload",

    () => {

        stopAutoRefresh();

        destroyMap();

    }

);

/* ===========================
   PAGE LOAD
=========================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await loadOrder();

        startAutoRefresh();

    }

);