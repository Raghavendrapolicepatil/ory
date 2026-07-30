// ==========================================
// Patil Groceries Checkout
// ==========================================
function showToast(message) {

    const toast = document.getElementById("toast");

    console.log("Toast element:", toast);

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}
// ==========================================
// Settings
// ==========================================

const FREE_DELIVERY_LIMIT = 299;

const DELIVERY = (cartTotal) =>
    cartTotal >= FREE_DELIVERY_LIMIT ? 0 : 20;

const PLATFORM = 0;

// ==========================================
// Elements
// ==========================================

const addressBox = document.getElementById("delivery-address");

const itemsBox = document.getElementById("checkout-items");

const itemsTotal = document.getElementById("items-total");

const deliveryFee = document.getElementById("delivery-fee");

const deliveryMessage = document.getElementById("delivery-message");

const grandTotal = document.getElementById("grand-total");

const footerTotal = document.getElementById("footer-total");

const placeOrderBtn = document.getElementById("place-order");

// ==========================================
// Load Address
// ==========================================

function loadAddress() {

    const addresses =
        JSON.parse(localStorage.getItem("addresses")) || [];

    if (addresses.length === 0) {

        addressBox.innerHTML = `

        <p>No Address Selected</p>

        `;

        return;

    }

    const address = addresses[0];

    addressBox.innerHTML = `

        <strong>${address.name}</strong>

        <p>

            ${address.house},

            ${address.street},

            ${address.city}

            - ${address.pincode}

        </p>

        <small>${address.mobile}</small>

    `;

}

// ==========================================
// Load Checkout
// ==========================================

function loadCheckout() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const printCart = JSON.parse(localStorage.getItem("printCart")) || [];

    itemsBox.innerHTML = "";

    if (cart.length === 0 && printCart.length === 0) {

        itemsBox.innerHTML = `
            <p>Your Shopping Bag is Empty.</p>
        `;

        itemsTotal.textContent = "₹0";
        deliveryFee.textContent = "₹0";
        grandTotal.textContent = "₹0";
        footerTotal.textContent = "₹0";
        deliveryMessage.textContent = "";

        return;

    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        itemsBox.innerHTML += `

        <div class="checkout-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="checkout-info">

                <h4>${item.name}</h4>

                <p>₹${item.price}</p>

                <div class="qty-box">

                    <button class="qty-btn"
                        onclick="decreaseQtyCheckout(${index})">

                        -

                    </button>

                    <span class="qty-value">

                        ${item.qty}

                    </span>

                    <button class="qty-btn"
                        onclick="increaseQtyCheckout(${index})">

                        +

                    </button>

                </div>

                <button class="remove-btn"
                    onclick="removeItemCheckout(${index})">

                    Remove

                </button>

            </div>

            <strong>

                ₹${item.price * item.qty}

            </strong>

        </div>

        `;

    });

printCart.forEach((cartItem, cartIndex) => {

    const order = cartItem.order;

    if (!order) return;

    order.items.forEach((file) => {

        itemsBox.innerHTML += `

        <div class="checkout-item">

            <img src="${file.thumbnail}" alt="${file.fileName}">

            <div class="checkout-info">

                <h4>${file.fileName}</h4>

                <p>${file.paperSize} • ${file.printType === "bw" ? "B&W" : "Colour"}</p>

                <p>${file.pages} Pages • ${file.copies} Copies</p>


                <button class="edit-btn"
    onclick="editPrintItem(${cartIndex})">

    <i class="fa-solid fa-pen"></i>

    Edit

</button>

                <button class="remove-btn"
                    onclick="removePrintItem(${cartIndex})">

                    Remove

                </button>

            </div>

            <strong>₹${file.price}</strong>

        </div>

        `;

    });

    total += Number(order.totalPrice);

});

    const deliveryCharge = DELIVERY(total);

    deliveryFee.textContent =
        deliveryCharge === 0
            ? "FREE"
            : "₹" + deliveryCharge;

    if (deliveryCharge === 0) {

        deliveryMessage.textContent =
            "🎉 Congratulations! FREE Delivery Applied";

    } else {

        deliveryMessage.textContent =
            `Add ₹${FREE_DELIVERY_LIMIT - total} more for FREE Delivery`;

    }

    const finalTotal =
        total + deliveryCharge + PLATFORM;

    itemsTotal.textContent = "₹" + total;

    grandTotal.textContent = "₹" + finalTotal;

    footerTotal.textContent = "₹" + finalTotal;

}

// ==========================================
// Increase Quantity
// ==========================================

function increaseQtyCheckout(index) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty++;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCheckout();

}

// ==========================================
// Decrease Quantity
// ==========================================

function decreaseQtyCheckout(index) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index].qty > 1) {

        cart[index].qty--;

    } else {

        cart.splice(index, 1);

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCheckout();

}

// ==========================================
// Remove Product
// ==========================================

function removePrintItem(index) {

    const printCart =
        JSON.parse(localStorage.getItem("printCart")) || [];

    printCart.splice(index, 1);

    localStorage.setItem(
        "printCart",
        JSON.stringify(printCart)
    );

    loadCheckout();

}


function editPrintItem(index) {

    localStorage.setItem(
        "editingPrintIndex",
        index
    );

    window.location.href = "print.html";

}
// ==========================================
// Place Order
// ==========================================

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const printCart = JSON.parse(localStorage.getItem("printCart")) || [];

if (cart.length === 0 && printCart.length === 0) {

    alert("Your Shopping Bag is Empty.");

    return;

}

    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];

    const userLocation = JSON.parse(
    localStorage.getItem("userLocation")
);

    if (addresses.length === 0) {

        alert("Please add a delivery address.");

        window.location.href = "address.html";

        return;

    }


    

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

const paymentOption = document.querySelector(
    'input[name="payment"]:checked'
);

if (!paymentOption) {
    alert("Please select a payment method.");
    return;
}

const payment = paymentOption.value;
console.log("Selected Payment:", payment);
// Temporary disable online payments
if (payment === "UPI" || payment === "Card") {
    alert("🚧 Online Payment Coming Soon!");
    return;
}
    

    const total = cart.reduce((sum, item) => {

        return sum + (item.price * item.qty);

    }, 0);

    const deliveryCharge = DELIVERY(total);

    const finalTotal = total + deliveryCharge + PLATFORM;

    const printCart = JSON.parse(localStorage.getItem("printCart")) || [];

if (printCart.length > 0) {

    const printOrder = printCart[0].order;

    await fetch("https://snackible-backend.onrender.com/api/print-orders", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

                phone: user.phone || ""

            },

            address: addresses[0],

            paymentMethod: payment,

            items: printOrder.items,

            totalFiles: printOrder.totalFiles,

            totalPages: printOrder.totalPages,

            totalSheets: printOrder.totalSheets,

            totalPrice: printOrder.totalPrice,

            status: "Pending"

        })

    });

}

    try {
console.log("Going to place order...");
        const response = await fetch("https://snackible-backend.onrender.com/api/orders", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                user: user.id,

                products: cart.map(item => ({
    productId: Number(String(item.id).split("-")[0]), // 8
    variant: item.variant,                    // "10g"
    weight: item.weight,                      // "10g"
    name: item.name,
    image: item.image,
    quantity: item.qty,
    price: item.price
})),

                totalAmount: finalTotal,

                address: addressBox.innerText,

                location: userLocation,

                paymentMethod: payment

            })

        });

        const data = await response.json();
        console.log("Status:", response.status);;

        if (!response.ok) {

            alert(data.message || "Order Failed");

            return;

        }

        localStorage.removeItem("cart");
        localStorage.removeItem("printCart");

        alert("Order Placed Successfully");

        window.location.href = "order-success.html";

    }

    catch (err) {

        console.log(err);

        alert("Server Error");

    }



// ==========================================
// Start
// ==========================================

loadAddress();

loadCheckout();