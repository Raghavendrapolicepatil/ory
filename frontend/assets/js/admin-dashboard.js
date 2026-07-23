// ==========================================
// Snackible Admin Dashboard
// ==========================================

const API = "http://localhost:5000/api";

const productsCount = document.getElementById("products-count");
const ordersCount = document.getElementById("orders-count");
const usersCount = document.getElementById("users-count");
const revenue = document.getElementById("revenue");

const recentOrders = document.getElementById("recent-orders");
const lowStock = document.getElementById("low-stock");

const topProducts = document.getElementById("top-products");
const latestUsers = document.getElementById("latest-users");

// ==========================================
// Load Dashboard
// ==========================================

async function loadDashboard() {

    try {

        // Products

        const productRes = await fetch(`${API}/products`);
        const products = await productRes.json();

        productsCount.textContent = products.length;

        // Orders

        const orderRes = await fetch(`${API}/orders`);
        const orders = await orderRes.json();

        ordersCount.textContent = orders.length;

        // Users

        const userRes = await fetch(`${API}/users`);
        const users = await userRes.json();

        usersCount.textContent = users.length;

        // Revenue

        let totalRevenue = 0;

        orders.forEach(order => {

            totalRevenue += order.totalAmount || 0;

        });

        revenue.textContent = "₹" + totalRevenue;

        // Recent Orders

        loadRecentOrders(orders);

        // Low Stock

        loadLowStock(products);

        //top selling products

        loadTopProducts(products);

        //letest users

        loadLatestUsers(users);


    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Recent Orders
// ==========================================

function loadRecentOrders(orders) {

    recentOrders.innerHTML = "";

    if (orders.length === 0) {

        recentOrders.innerHTML = "<p>No Orders Found</p>";

        return;

    }

    orders.slice(0, 5).forEach(order => {

        recentOrders.innerHTML += `

        <div class="dashboard-item">

            <strong>#${order._id.slice(-6)}</strong>

            <span>

                ₹${order.totalAmount}

            </span>

        </div>

        `;

    });

}

// ==========================================
// Low Stock Products
// ==========================================

function loadLowStock(products) {

    lowStock.innerHTML = "";

    const low = products.filter(product => product.stock <= 5);

    if (low.length === 0) {

        lowStock.innerHTML = "<p>No Low Stock Products</p>";

        return;

    }

    low.forEach(product => {

        lowStock.innerHTML += `

        <div class="dashboard-item">

            <strong>

                ${product.name}

            </strong>

            <span>

                ${product.stock} Left

            </span>

        </div>

        `;

    });

}

// ==========================================
// Top Selling Products
// ==========================================

function loadTopProducts(products) {

    topProducts.innerHTML = "";

    products
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 5)
        .forEach(product => {

            topProducts.innerHTML += `

            <div class="dashboard-item">

                <strong>${product.name}</strong>

                <span>${product.sold || 0} Sold</span>

            </div>

            `;

        });

}

// ==========================================
// Latest Users
// ==========================================

function loadLatestUsers(users) {

    latestUsers.innerHTML = "";

    users
        .slice(-5)
        .reverse()
        .forEach(user => {

            latestUsers.innerHTML += `

            <div class="dashboard-item">

                <strong>${user.name}</strong>

                <span>${user.email}</span>

            </div>

            `;

        });

}


// ==========================================
// Refresh Every 10 Seconds
// ==========================================

loadDashboard();

setInterval(loadDashboard, 10000);