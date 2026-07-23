// ==========================================
// Snackible Product Cart
// ==========================================
let currentVariant = null;
// Cart Container
const cartBox = document.getElementById("cart-box");

// Buy Now Button
const buyNowBtn = document.getElementById("buy-now");

// ==========================================
// Refresh Cart Button
// ==========================================

function refreshCartButton() {

    if (!currentProduct || !cartBox) return;

    // Out of Stock
    if (currentProduct.stock <= 0) {

        cartBox.innerHTML = `

            <button
                class="cart-btn disabled-btn"
                disabled>

                Out of Stock

            </button>

        `;

        if (buyNowBtn) {

            buyNowBtn.disabled = true;
            buyNowBtn.textContent = "Out of Stock";
            buyNowBtn.classList.add("disabled-btn");

        }

        return;

    }

    // Buy Now Enable
    if (buyNowBtn) {

        buyNowBtn.disabled = false;
        buyNowBtn.textContent = "Buy Now";
        buyNowBtn.classList.remove("disabled-btn");

    }

    const qty = getProductQty(currentProduct.id);

    if (qty === 0) {

        cartBox.innerHTML = `

            <button
                class="cart-btn"
                onclick="addCurrentProduct()">

                <i class="ri-shopping-cart-2-line"></i>

                Add to Cart

            </button>

        `;

    } else {

        cartBox.innerHTML = `

            <div class="quantity-control">

                <button onclick="minusCurrentProduct()">

                    −

                </button>

                <span>${qty}</span>

                <button onclick="plusCurrentProduct()">

                    +

                </button>

            </div>

        `;

    }

}

// ==========================================
// Add Product
// ==========================================


function addCurrentProduct() {

    if (!currentProduct) return;

    if (currentProduct.stock <= 0) {

        alert("This product is Out of Stock");

        return;

    }

const productPrice = currentVariant
    ? currentVariant.price
    : currentProduct.price;

const productImage = currentVariant
    ? currentVariant.image
    : currentProduct.image;

addToCart(
    currentProduct.id,
    currentProduct.name,
    productPrice,
    productImage
);

    refreshCartButton();

}

// ==========================================
// Increase
// ==========================================

function plusCurrentProduct() {

    increaseQty(currentProduct.id);

    refreshCartButton();

}

// ==========================================
// Decrease
// ==========================================

function minusCurrentProduct() {

    decreaseQty(currentProduct.id);

    refreshCartButton();

}

// ==========================================
// Buy Now
// ==========================================

if (buyNowBtn) {

    buyNowBtn.addEventListener("click", () => {

        if (!currentProduct) return;

if (currentProduct.stock <= 0) {

    alert("This product is Out of Stock");

    return;

}

        if (getProductQty(currentProduct.id) === 0) {

            addCurrentProduct();

        }

        window.location.href = "checkout.html";

    });

}

// ==========================================
// Auto Refresh
// ==========================================

window.addEventListener("load", () => {

    setTimeout(() => {

        refreshCartButton();

    }, 100);

});