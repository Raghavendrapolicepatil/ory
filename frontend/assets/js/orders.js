// ==========================================
// Patil Groceries Orders
// ==========================================

const GROCERY_API = "https://snackible-backend.onrender.com/api/orders";
const PRINT_API = "https://snackible-backend.onrender.com/api/print-orders";

const ordersContainer = document.getElementById("orders-container");

const loadingScreen = document.getElementById("loading-screen");

const emptyOrders = document.getElementById("empty-orders");

const errorBox = document.getElementById("error-box");

// ==========================================
// Load Orders
// ==========================================
async function loadOrders() {

    try {

        const userData =
            JSON.parse(localStorage.getItem("user"));

        if (!userData) {
            window.location.href = "login.html";
            return;
        }

        showLoading();

        const [groceryRes, printRes] = await Promise.all([
            fetch(GROCERY_API),
            fetch(PRINT_API)
        ]);

        const groceryOrders = await groceryRes.json();
        const printOrders = await printRes.json();

        console.log("Logged User:", userData);
console.log("Print Orders:", printOrders);

        const grocery = groceryOrders.filter(order =>
            order.user &&
            order.user._id === userData.id
        );

printOrders.forEach(order => {
    console.log("Saved User:", order.user);
});

        const print = printOrders
            .filter(order =>
                order.user &&
                order.user.id === userData.id
            )
            .map(order => ({

                ...order,

                isPrint: true,

                products: order.items,

                totalAmount: order.totalPrice

            }));

        const userOrders = [...grocery, ...print];

        hideLoading();

        if (userOrders.length === 0) {
            showEmpty();
            return;
        }

        hideEmpty();

        renderOrders(userOrders);

    }
    catch (err) {

        console.log(err);

        showError();

    }

}

// ==========================================
// UI Functions
// ==========================================

function showLoading() {

    loadingScreen.classList.remove("hidden");

    ordersContainer.classList.add("hidden");

    emptyOrders.classList.add("hidden");

    errorBox.classList.add("hidden");

}

function hideLoading() {

    loadingScreen.classList.add("hidden");

    ordersContainer.classList.remove("hidden");

}

function showEmpty() {

    loadingScreen.classList.add("hidden");

    ordersContainer.classList.add("hidden");

    emptyOrders.classList.remove("hidden");

}

function hideEmpty() {

    emptyOrders.classList.add("hidden");

}

function showError() {

    loadingScreen.classList.add("hidden");

    ordersContainer.classList.add("hidden");

    errorBox.classList.remove("hidden");

}
// ==========================================
// Render Orders
// ==========================================

function renderOrders(orders) {

    ordersContainer.innerHTML = "";

    orders.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    orders.forEach(order => {

        let badgeClass = "status-pending";

        switch (order.status) {

            case "Packed":
                badgeClass = "status-packed";
                break;

            case "Out for Delivery":
                badgeClass = "status-out";
                break;

            case "Delivered":
                badgeClass = "status-delivered";
                break;

            case "Cancelled":
                badgeClass = "status-cancelled";
                break;

        }

        let productsHTML = "";

        (order.products || []).forEach(product => {

            productsHTML += `

            <div class="order-product">

                <img
                    src="${product.image}"
                    alt="${product.name}">

                <div class="order-info">

                    <h4>${product.name || product.fileName}</h4>

                    <p>

                        ${order.isPrint ? `Copies : ${product.copies}` : `Qty : ${product.quantity}`}

                    </p>

                </div>

                <strong>

                    ₹${order.isPrint ? product.price : product.price * product.quantity}

                </strong>

            </div>

            `;

        });

        ordersContainer.innerHTML += `

        <div class="order-card">

            <div class="order-top">

                <span class="order-id">

                    #${order._id.slice(-6)}

                </span>

                <span class="order-date">

                    ${new Date(order.createdAt).toLocaleDateString("en-IN")}

                </span>

            </div>

            <div class="status-badge ${badgeClass}">

                <i class="fa-solid fa-box"></i>

                ${order.status}

            </div>

            ${getOrderTracking(order.status)}

            ${productsHTML}

            <div class="order-total">

                <span>Total Amount</span>

                <span>

                    ₹${order.totalAmount}

                </span>

            </div>

            <div style="margin-top:14px;">

                <strong>Payment :</strong>

                ${order.paymentMethod}

            </div>

            <div style="margin-top:8px;">

                <strong>Delivery Address :</strong>

                <br>

                ${order.address}

            </div>

            <div class="order-actions">

                <button
                    class="track-btn"
                    onclick="trackOrder('${order._id}')">

                    <i class="fa-solid fa-location-dot"></i>

                    View Details

                </button>

            </div>

        </div>

        `;

    });

}
// ==========================================
// Order Tracking Timeline
// ==========================================

function getOrderTracking(status) {

    const steps = [

        "Pending",
        "Packed",
        "Out for Delivery",
        "Delivered"

    ];

    const currentStep = steps.findIndex(step =>
        step.toLowerCase().trim() ===
        String(status).toLowerCase().trim()
    );

    let html = `<div class="tracking">`;

    steps.forEach((step, index) => {

        const active = currentStep >= index;

        html += `

        <div class="tracking-step ${active ? "active" : ""}">

            <div class="circle">

                ${active ? '<i class="fa-solid fa-check"></i>' : ""}

            </div>

            ${index !== steps.length - 1 ? '<div class="line"></div>' : ""}

            <p>${step}</p>

        </div>

        `;

    });

    html += `</div>`;

    return html;

}

// ==========================================
// Track Order
// ==========================================

function trackOrder(orderId) {

    window.location.href =
        `track-order.html?id=${orderId}`;

}

// ==========================================
// Auto Refresh Every 20 Seconds
// ==========================================

setInterval(() => {

    loadOrders();

}, 20000);

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadOrders();

});