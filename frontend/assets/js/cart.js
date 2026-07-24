// ======================================
// Snackible Cart Manager V2
// ======================================

// Load Latest Cart
function getLatestCart(){

    return JSON.parse(
        localStorage.getItem("cart")
    ) || [];

}

// Global Cart
let cart = getLatestCart();

// ======================================
// Save Cart
// ======================================

function saveCart(){

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // Notify every page
    window.dispatchEvent(
        new Event("cartUpdated")
    );

    updateCartCount();

    if(typeof refreshFloatingCart==="function"){

        refreshFloatingCart();

    }

    if(typeof updateFloatingCart==="function"){

        updateFloatingCart();

    }

}

// ======================================
// Add Product
// ======================================
function addToCart(id, name, price, image, weight){

console.log("Add To Cart ID:", id, typeof id);

    cart = getLatestCart();

    const product = cart.find(item => item.id === id);

    if(product){

        product.qty++;

    }else{

        cart.push({
            id,
            name,
            price,
            image,
            weight,
            qty:1
        });

    }

    saveCart();

}
// ======================================
// Increase Qty
// ======================================

function increaseQty(id){

    cart = getLatestCart();

    const product = cart.find(item=>item.id===id);

    if(!product) return;

    product.qty++;

    saveCart();

}

// ======================================
// Decrease Qty
// ======================================

function decreaseQty(id){

    cart = getLatestCart();

    const product = cart.find(item=>item.id===id);

    if(!product) return;

    product.qty--;

    if(product.qty<=0){

        removeFromCart(id);

        return;

    }

    saveCart();

}

// ======================================
// Remove Product
// ======================================

function removeFromCart(id){

    cart = getLatestCart();

    cart = cart.filter(item=>item.id!==id);

    saveCart();

}

// ======================================
// Clear Cart
// ======================================

function clearCart(){

    cart = [];

    saveCart();

}

// ======================================
// Get Cart Items
// ======================================

function getCartItems(){

    cart = getLatestCart();

    return cart;

}

// ======================================
// Get Product Qty
// ======================================

function getProductQty(id){

    cart = getLatestCart();

    const product = cart.find(item=>item.id===id);

    return product ? product.qty : 0;

}

// ======================================
// Check In Cart
// ======================================

function isInCart(id){

    cart = getLatestCart();

    return cart.some(item=>item.id===id);

}

// ======================================
// Get Total Price
// ======================================

function getCartTotal(){

    cart = getLatestCart();

    return cart.reduce((total,item)=>{

        return total + (item.price * item.qty);

    },0);

}

// ======================================
// Update Cart Badge
// ======================================

function updateCartCount(){

    cart = getLatestCart();

    const badge = document.getElementById("cart-count");

    if(!badge) return;

    const totalItems = cart.reduce((sum,item)=>{

        return sum + item.qty;

    },0);

    badge.textContent = totalItems;

    badge.style.display =
        totalItems > 0 ? "flex" : "none";

}

// ======================================
// Auto Sync
// ======================================

// Page Load
document.addEventListener("DOMContentLoaded", () => {

    cart = getLatestCart();

    updateCartCount();

});

// Browser Back
window.addEventListener("pageshow", () => {

    cart = getLatestCart();

    updateCartCount();

    if (typeof refreshFloatingCart === "function") {
        refreshFloatingCart();
    }

    if (typeof updateFloatingCart === "function") {
        updateFloatingCart();
    }

    if (
        typeof refreshProduct === "function" &&
        typeof allProducts !== "undefined" &&
        Array.isArray(allProducts)
    ) {

        allProducts.forEach(product => {
            refreshProduct(product.id);
        });

    }

}); // ✅ Ye closing missing thi

// ======================================
// Same Tab Sync
// ======================================

window.addEventListener("cartUpdated", () => {

    cart = getLatestCart();

    updateCartCount();

});

// ======================================
// Other Tabs Sync
// ======================================

window.addEventListener("storage", () => {

    cart = getLatestCart();

    updateCartCount();

});