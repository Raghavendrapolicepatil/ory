// ==========================================
// Snackible Order Success
// ==========================================

// Order ID
const orderId = document.getElementById("order-id");

// Get Orders
const orders = JSON.parse(localStorage.getItem("orders")) || [];

// Show Latest Order ID
if (orders.length > 0) {

    const latestOrder = orders[orders.length - 1];

    orderId.textContent = "#" + latestOrder.id;

} else {

    orderId.textContent = "N/A";

}

// ==========================================
// Confetti Effect (Optional)
// ==========================================

setTimeout(() => {

    const icon = document.querySelector(".success-icon");

    if (icon) {

        icon.style.transform = "scale(1.1)";

        setTimeout(() => {

            icon.style.transform = "scale(1)";

        }, 200);

    }

}, 300);

// ==========================================
// Auto Redirect (Optional)
// ==========================================

// Uncomment below if you want automatic redirect
/*
setTimeout(() => {

    window.location.href = "orders.html";

}, 5000);
*/

// ==========================================
// Prevent Back Button to Checkout
// ==========================================

history.replaceState(null, "", window.location.href);

window.onpopstate = function () {

    window.location.href = "index.html";

};