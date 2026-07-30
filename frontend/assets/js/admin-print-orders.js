const API = "https://snackible-backend.onrender.com/api/print-orders";

const ordersTable = document.getElementById("printOrdersTable");
const searchInput = document.getElementById("searchPrintOrder");
const statusFilter = document.getElementById("statusFilter");

let allOrders = [];

// ==========================================
// Load Print Orders
// ==========================================

async function loadOrders() {

    try {

        const res = await fetch(API);

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

<td colspan="9">

No Print Orders Found

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

<td>${order.totalFiles || 0}</td>

<td>${order.totalPages || 0}</td>

<td>₹${order.totalPrice || 0}</td>

<td>${order.paymentMethod || "-"}</td>

<td>

<select onchange="updateStatus('${order._id}',this.value)">

<option value="Pending" ${order.status==="Pending"?"selected":""}>Pending</option>

<option value="Printing" ${order.status==="Printing"?"selected":""}>Printing</option>

<option value="Ready" ${order.status==="Ready"?"selected":""}>Ready</option>

<option value="Completed" ${order.status==="Completed"?"selected":""}>Completed</option>

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

async function updateStatus(id,status){

    try{

        const res = await fetch(`${API}/${id}`,{

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                status

            })

        });

        const data = await res.json();

        alert(data.message);

        loadOrders();

    }

    catch(err){

        console.log(err);

    }

}

// ==========================================
// View Order
// ==========================================

async function viewOrder(id){

    try{

        const res = await fetch(`${API}/${id}`);

        const order = await res.json();

        const details = document.getElementById("printOrderDetails");

        let html = `

<p><b>Customer :</b> ${order.user?.name || "Guest"}</p>

<p><b>Email :</b> ${order.user?.email || "-"}</p>

<p><b>Phone :</b> ${order.phone || "-"}</p>

<p><b>Payment :</b> ${order.paymentMethod || "-"}</p>

<p><b>Status :</b> ${order.status}</p>

<p><b>Total :</b> ₹${order.totalPrice || 0}</p>

<hr>

<h3>Files</h3>

`;

        if(order.items){

            order.items.forEach(file=>{

                html += `

<div class="print-file">

<img src="${file.thumbnail}" alt="">

<div class="file-info">

<h4>${file.fileName}</h4>

<p>Paper : ${file.paperSize}</p>

<p>Print : ${file.printType}</p>

<p>Pages : ${file.pages}</p>

<p>Copies : ${file.copies}</p>

</div>

<div class="file-price">

₹${file.price}

</div>

</div>

`;

            });

        }

        html += `

<div class="order-summary">

<p><strong>Total Files :</strong> ${order.totalFiles || 0}</p>

<p><strong>Total Pages :</strong> ${order.totalPages || 0}</p>

<p><strong>Total Sheets :</strong> ${order.totalSheets || 0}</p>

<p><strong>Grand Total :</strong> ₹${order.totalPrice || 0}</p>

</div>

`;

        details.innerHTML = html;

        document.getElementById("printOrderModal").style.display="flex";

    }

    catch(err){

        console.log(err);

    }

}

// ==========================================
// Search
// ==========================================

searchInput.addEventListener("input",()=>{

    const keyword = searchInput.value.toLowerCase();

    const filtered = allOrders.filter(order=>

        (order.user?.name || "").toLowerCase().includes(keyword)

    );

    displayOrders(filtered);

});

// ==========================================
// Filter
// ==========================================

statusFilter.addEventListener("change",()=>{

    if(statusFilter.value===""){

        displayOrders(allOrders);

        return;

    }

    const filtered = allOrders.filter(order=>

        order.status===statusFilter.value

    );

    displayOrders(filtered);

});

// ==========================================
// Close Modal
// ==========================================

function closeModal(){

    document.getElementById("printOrderModal").style.display="none";

}

window.onclick=function(e){

    const modal=document.getElementById("printOrderModal");

    if(e.target===modal){

        modal.style.display="none";

    }

}

// ==========================================
// Start
// ==========================================

loadOrders();