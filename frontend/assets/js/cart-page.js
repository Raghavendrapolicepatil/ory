// ==========================================
// Snackible Cart Page
// Part 1
// ==========================================

const cartItems = document.getElementById("cart-items");
const itemTotal = document.getElementById("item-total");
const grandTotal = document.getElementById("grand-total");
const checkoutTotal = document.getElementById("checkout-total");

const DELIVERY_CHARGE = 20;
const PLATFORM_FEE = 5;

function renderCart() {

    const cart = getCartItems();

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `

        <div class="empty-cart">

            <h2>Your Cart is Empty</h2>

            <p>Add products to continue shopping.</p>

            <a href="index.html" class="shop-btn">

                Continue Shopping

            </a>

        </div>

        `;

        itemTotal.textContent = "₹0";
        grandTotal.textContent = "₹0";
        checkoutTotal.textContent = "₹0";

        return;

    }

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

<div class="cart-info">

    <h3>${item.name}</h3>

    <p class="cart-weight">
        ${item.weight || ""}
    </p>

    <div class="cart-price">

        ₹${item.price}

    </div>

    <div class="quantity-control">

                    <button onclick="decreaseItem('${item.id}')">

                        -

                    </button>

                    <span>

                        ${item.qty}

                    </span>

                    <button onclick="increaseItem('${item.id}')">

                        +

                    </button>

                </div>

                <button

                    class="remove-btn"

                   onclick="deleteItem('${item.id}')">

                    Remove

                </button>

            </div>

        </div>

        `;

    });

    itemTotal.textContent = "₹" + total;

    grandTotal.textContent =
        "₹" + (total + DELIVERY_CHARGE + PLATFORM_FEE);

    checkoutTotal.textContent =
        "₹" + (total + DELIVERY_CHARGE + PLATFORM_FEE);

}


// ==========================================
// Part 2
// Quantity Functions
// ==========================================

// Increase Quantity
function increaseQty(id){

    cart = getLatestCart();

    const product = cart.find(item => item.id === id);

    if(!product) return;

    product.qty++;

    saveCart();

}
// Decrease Quantity
function decreaseQty(id){

    cart = getLatestCart();

    const product = cart.find(item => item.id === id);

    if(!product) return;

    product.qty--;

    if(product.qty <= 0){

        cart = cart.filter(item => item.id !== id);

    }

    saveCart();

}
// Remove Product
function removeFromCart(id){

    cart = getLatestCart();

    cart = cart.filter(item => item.id !== id);

    saveCart();

}

// Calculate Totals
function updateBill(){

    const total = getCartTotal();

    itemTotal.textContent = "₹" + total;

    grandTotal.textContent =
        "₹" + (total + DELIVERY_CHARGE + PLATFORM_FEE);

    checkoutTotal.textContent =
        "₹" + (total + DELIVERY_CHARGE + PLATFORM_FEE);

}

// Refresh Cart
function refreshCart(){

    renderCart();

    updateBill();

}


// ==========================================
// Part 3
// Initialize Cart
// ==========================================

// Checkout Button
const checkoutBtn = document.getElementById("checkout-btn");

if(checkoutBtn){

    checkoutBtn.addEventListener("click",()=>{

        const cart=getCartItems();

        if(cart.length===0){

            alert("Your cart is empty.");

            return;

        }

        window.location.href="checkout.html";

    });

}

// Refresh Cart Count
if(typeof updateCartCount==="function"){

    updateCartCount();

}

// Initial Load
refreshCart();

// Auto Refresh when page becomes visible
document.addEventListener("visibilitychange",()=>{

    if(!document.hidden){

        refreshCart();

    }

});