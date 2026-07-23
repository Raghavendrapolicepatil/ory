// ==========================================
// Snackible Wishlist V3
// ==========================================

// Wishlist Data
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Save
function saveWishlist() {

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

}

// Get
function getWishlist() {

    return wishlist;

}

// Check
function isWishlisted(id) {

    return wishlist.some(item => item.id === id);

}

// Toggle
function toggleWishlist(product, button = null) {

    const index = wishlist.findIndex(item => item.id === product.id);

    if (index > -1) {

        wishlist.splice(index, 1);

    } else {

        wishlist.push({

            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            weight: product.weight

        });

    }

    saveWishlist();

    console.log(wishlist);

    // Update this button
    if (button) {

        button.innerHTML = isWishlisted(product.id)
            ? '<i class="ri-heart-fill" style="color:red;"></i>'
            : '<i class="ri-heart-line"></i>';

    }

    // Refresh Wishlist Page
    if (typeof renderWishlist === "function") {

        renderWishlist();

    }

}

// Remove
function removeWishlist(id) {

    wishlist = wishlist.filter(item => item.id !== id);

    saveWishlist();

    if (typeof renderWishlist === "function") {

        renderWishlist();

    }

}

// Render Wishlist Page
function renderWishlist() {

    const container =
        document.getElementById("wishlist-container");

    if (!container) return;

    container.innerHTML = "";

    if (wishlist.length === 0) {

        container.innerHTML = `

        <div class="empty-wishlist">

            <i class="ri-heart-crack-line"></i>

            <h2>Your Wishlist is Empty</h2>

            <p>Add your favourite products.</p>

        </div>

        `;

        return;

    }

    wishlist.forEach(product => {

        container.innerHTML += `

        <div class="wishlist-card">

            <img src="${product.image}">

            <div class="wishlist-info">

                <h3>${product.name}</h3>

                <p>${product.weight}</p>

                <div class="wishlist-price">

                    ₹${product.price}

                </div>

                <div class="wishlist-actions">

                    <button
                        class="cart-btn"
                        onclick="addToCart(
                            ${product.id},
                            '${product.name}',
                            ${product.price},
                            '${product.image}'
                        )">

                        Add to Cart

                    </button>

                    <button
                        class="remove-btn"
                        onclick="removeWishlist(${product.id})">

                        Remove

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

// Auto Render
document.addEventListener("DOMContentLoaded", () => {

    renderWishlist();

});

// ===============================
// Update Wishlist Icon
// ===============================

function updateWishlistIcon() {

    const wishlistBtn = document.getElementById("wishlist-btn");

    if (!wishlistBtn || !currentProduct) return;

    if (isWishlisted(currentProduct.id)) {

        wishlistBtn.innerHTML =
            '<i class="ri-heart-fill" style="color:red;"></i>';

    } else {

        wishlistBtn.innerHTML =
            '<i class="ri-heart-line"></i>';

    }

}