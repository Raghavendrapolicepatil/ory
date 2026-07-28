/* ==========================================
   API
========================================== */

const API = "https://snackible-backend.onrender.com/api";

/* ==========================================
   DOM
========================================== */

const container = document.getElementById("printOrdersContainer");

const searchInput = document.getElementById("searchInput");

const statusFilter = document.getElementById("statusFilter");

const refreshBtn = document.querySelector(".refresh-btn");

/* ==========================================
   DATA
========================================== */

let orders = [];

let filteredOrders = [];

/* ==========================================
   LOAD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadOrders();

});

/* ==========================================
   FETCH ORDERS
========================================== */

async function loadOrders() {

    try {

        container.innerHTML = `
            <div class="loading">
                Loading Print Orders...
            </div>
        `;

        const response = await fetch(`${API}/print-orders`);

        if (!response.ok) {

            throw new Error("Unable to load print orders.");

        }

        orders = await response.json();

        filteredOrders = [...orders];

        renderOrders();

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error">
                Failed to load print orders.
            </div>
        `;

    }

}

/* ==========================================
   RENDER
========================================== */

function renderOrders() {

    if (filteredOrders.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No Print Orders Found
            </div>
        `;

        return;

    }

    container.innerHTML = filteredOrders
        .map(createOrderCard)
        .join("");

}

/* ==========================================
   CARD
========================================== */

function createOrderCard(order) {

    return `

<div class="print-order-card">

    <div class="order-top">

        <div>

            <h3>#${order.orderId}</h3>

            <span class="order-date">

                ${formatDate(order.createdAt)}

            </span>

        </div>

        <span class="status ${order.status.toLowerCase()}">

            ${order.status}

        </span>

    </div>

    <div class="customer-info">

        <p>

            <i class="ri-user-3-line"></i>

            <strong>${order.customer.name}</strong>

        </p>

        <p>

            <i class="ri-phone-line"></i>

            ${order.customer.phone}

        </p>

        <p>

            <i class="ri-map-pin-line"></i>

            ${order.customer.address}

        </p>

    </div>

    <div class="print-details">

        <div>

            <span>Paper</span>

            <strong>${order.paper}</strong>

        </div>

        <div>

            <span>Print</span>

            <strong>${order.printType}</strong>

        </div>

        <div>

            <span>Side</span>

            <strong>${order.side}</strong>

        </div>

        <div>

            <span>Copies</span>

            <strong>${order.copies}</strong>

        </div>

        <div>

            <span>Sheets</span>

            <strong>${order.totalSheets}</strong>

        </div>

        <div>

            <span>Total</span>

            <strong>₹${order.totalPrice}</strong>

        </div>

    </div>

    <div class="files-section">

        <h4>

            <i class="ri-folder-line"></i>

            Files (${order.files.length})

        </h4>

        ${renderFiles(order.files)}

    </div>

    <div class="order-actions">

        <button
            class="printing-btn">

            Printing

        </button>

        <button
            class="ready-btn">

            Ready

        </button>

        <button
            class="delivered-btn">

            Delivered

        </button>

    </div>

</div>

`;

}

/* ==========================================
   FILES
========================================== */

function renderFiles(files) {

    return files.map(file => `

<div class="file-item">

<span>

<i class="${file.type === "application/pdf"
? "ri-file-pdf-line"
: "ri-image-line"}"></i>

${file.name}

</span>

<div class="file-actions">

<button
class="preview-btn">

<i class="ri-eye-line"></i>

</button>

<button
class="download-btn">

<i class="ri-download-line"></i>

</button>

</div>

</div>

`).join("");

}

/* ==========================================
   DATE
========================================== */

function formatDate(date){

    return new Date(date)
        .toLocaleString();

}

/* ==========================================
   PREVIEW MODAL
========================================== */

const previewModal = document.getElementById("previewModal");

const previewBody = document.getElementById("previewBody");

const previewTitle = document.getElementById("previewTitle");

const downloadPreview = document.getElementById("downloadPreview");

const closePreview = document.getElementById("closePreview");

/* ==========================================
   FILE BUTTON EVENTS
========================================== */

document.addEventListener("click", async (e) => {

    const previewBtn = e.target.closest(".preview-btn");

    const downloadBtn = e.target.closest(".download-btn");

    const statusBtn = e.target.closest(".printing-btn,.ready-btn,.delivered-btn");

    if (previewBtn) {

        const url = previewBtn.dataset.url;

        const name = previewBtn.dataset.name;

        const type = previewBtn.dataset.type;

        openPreview(url, name, type);

    }

    if (downloadBtn) {

        window.open(downloadBtn.dataset.url, "_blank");

    }

    if (statusBtn) {

        const orderId = statusBtn.dataset.id;

        let status = "Pending";

        if (statusBtn.classList.contains("printing-btn"))
            status = "Printing";

        if (statusBtn.classList.contains("ready-btn"))
            status = "Ready";

        if (statusBtn.classList.contains("delivered-btn"))
            status = "Delivered";

        await updateStatus(orderId, status);

    }

});

/* ==========================================
   OPEN PREVIEW
========================================== */

function openPreview(url, name, type) {

    previewTitle.textContent = name;

    downloadPreview.href = url;

    if (type === "application/pdf") {

        previewBody.innerHTML = `
            <iframe src="${url}"></iframe>
        `;

    }

    else {

        previewBody.innerHTML = `
            <img src="${url}" alt="${name}">
        `;

    }

    previewModal.classList.add("active");

}

/* ==========================================
   CLOSE
========================================== */

closePreview.addEventListener("click", () => {

    previewModal.classList.remove("active");

    previewBody.innerHTML = "";

});

previewModal.addEventListener("click", e => {

    if (e.target === previewModal) {

        previewModal.classList.remove("active");

        previewBody.innerHTML = "";

    }

});

/* ==========================================
   SEARCH
========================================== */

searchInput.addEventListener("input", filterOrders);

statusFilter.addEventListener("change", filterOrders);

function filterOrders() {

    const search = searchInput.value.toLowerCase();

    const status = statusFilter.value;

    filteredOrders = orders.filter(order => {

        const matchSearch =

            order.orderId.toLowerCase().includes(search)

            ||

            order.customer.name.toLowerCase().includes(search)

            ||

            order.customer.phone.includes(search);

        const matchStatus =

            status === "all"

            ||

            order.status === status;

        return matchSearch && matchStatus;

    });

    renderOrders();

}

/* ==========================================
   REFRESH
========================================== */

refreshBtn.addEventListener("click", loadOrders);

/* ==========================================
   UPDATE STATUS
========================================== */

async function updateStatus(orderId, status) {

    try {

        const response = await fetch(

            `${API}/print-orders/${orderId}`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    status

                })

            }

        );

        if (!response.ok) {

            throw new Error();

        }

        loadOrders();

    }

    catch (err) {

        alert("Unable to update status.");

    }

}
