const API = "https://snackible-backend.onrender.com/api/admin/orders";

const ordersTable = document.getElementById("ordersTable");
const searchInput = document.getElementById("searchOrder");
const statusFilter = document.getElementById("statusFilter");

let allOrders = [];

// ==========================================
// Load Orders
// ==========================================

async function loadOrders() {

    try {

        const token = localStorage.getItem("token");

const res = await fetch(API, {

    headers: {

        "Authorization": `Bearer ${token}`

    }

});
        const orders = await res.json();

        allOrders = orders;

        displayOrders(allOrders);

    }

    catch (err) {

        console.log(err);

    }

}

// ==========================================
// Display Orders
// ==========================================

function displayOrders(orders) {

    ordersTable.innerHTML = "";

    if (orders.length === 0) {

        ordersTable.innerHTML = `

<tr>

<td colspan="7">

No Orders Found

</td>

</tr>

`;

        return;

    }

    orders.forEach(order => {

        ordersTable.innerHTML += `

<tr>

<td>#${order._id.slice(-6)}</td>

<td>${order.user?.name || "Guest"}</td>

<td>₹${order.totalAmount}</td>

<td>${order.paymentMethod}</td>

<td>

<select onchange="updateStatus('${order._id}',this.value)">

<option value="Pending" ${order.status==="Pending"?"selected":""}>Pending</option>

<option value="Packed" ${order.status==="Packed"?"selected":""}>Packed</option>

<option value="Out for Delivery" ${order.status==="Out for Delivery"?"selected":""}>Out for Delivery</option>

<option value="Delivered" ${order.status==="Delivered"?"selected":""}>Delivered</option>

<option value="Cancelled" ${order.status==="Cancelled"?"selected":""}>Cancelled</option>

</select>

</td>

<td>${new Date(order.createdAt).toLocaleDateString()}</td>

<td>

<button onclick="viewOrder('${order._id}')">

View

</button>

</td>

</tr>

`;

    });

}

// ==========================================
// Update Status
// ==========================================

async function updateStatus(id, status) {

    try {

        const res = await fetch(`${API}/${id}`, {

            method: "PUT",

           headers: {

    "Content-Type": "application/json",

    "Authorization": `Bearer ${localStorage.getItem("token")}`

},

            body: JSON.stringify({

                status

            })

        });

        const data = await res.json();

        alert(data.message);

        loadOrders();

    }

    catch (err) {

        console.log(err);

    }

}

// ==========================================
// View Order
// ==========================================

async function viewOrder(id) {

    try {

        const res = await fetch(`${API}/${id}`, {

    headers: {

        "Authorization":
            `Bearer ${localStorage.getItem("token")}`

    }

});

        const order = await res.json();

        const details = document.getElementById("orderDetails");

        let html = `

<p><b>Customer :</b> ${order.user?.name || "Guest"}</p>

<p><b>Email :</b> ${order.user?.email || "-"}</p>

<p>
    <b>Address :</b><br>
    ${order.address || "-"}
</p>

${
    order.location?.latitude && order.location?.longitude
    ? `
        <div style="margin-top:15px;">

            <h3>📍 Customer Location</h3>

            <p>
                Latitude : ${order.location.latitude}<br>
                Longitude : ${order.location.longitude}
            </p>

            <a
                href="https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}"
                target="_blank"
                style="
                    display:inline-block;
                    padding:10px 15px;
                    background:#0d6efd;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                "
            >
                📍 Open Customer Location
            </a>

        </div>
    `
    : `
        <div style="margin-top:15px;">
            <h3>📍 Customer Location</h3>
            <p>Location not available.</p>
        </div>
    `
}

<p><b>Payment :</b> ${order.paymentMethod}</p>

<p><b>Status :</b> ${order.status}</p>

<p><b>Total :</b> ₹${order.totalAmount}</p>

<hr>

<h3>Products</h3>

`;

        order.products.forEach(item => {

            html += `

<div class="order-product">

<div>

<b>${item.name}</b>

<br>

Qty : ${item.quantity}

</div>

<div>

₹${item.price}

</div>

</div>

`;

        });

        details.innerHTML = html;

        document.getElementById("orderModal").style.display = "flex";

    }

    catch (err) {

        console.log(err);

    }

}

// ==========================================
// Search
// ==========================================

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = allOrders.filter(order =>

        (order.user?.name || "").toLowerCase().includes(keyword)

    );

    displayOrders(filtered);

});

// ==========================================
// Filter
// ==========================================

statusFilter.addEventListener("change", () => {

    if (statusFilter.value === "") {

        displayOrders(allOrders);

        return;

    }

    const filtered = allOrders.filter(order =>

        order.status === statusFilter.value

    );

    displayOrders(filtered);

});

// ==========================================
// Close Modal
// ==========================================

function closeModal() {

    document.getElementById("orderModal").style.display = "none";

}

window.onclick = function (e) {

    const modal = document.getElementById("orderModal");

    if (e.target === modal) {

        modal.style.display = "none";

    }

}

// ==========================================
// Start
// ==========================================

loadOrders();