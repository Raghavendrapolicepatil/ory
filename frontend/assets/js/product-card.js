// ==========================================
// Snackible Product Card
// ==========================================

function createProductCard(product) {

    return `

    <div class="product-card">

        <span class="discount">${product.discount || "0% OFF"}</span>

        <button
            class="wishlist-btn"
            onclick='toggleWishlist({
                id:${product.id},
                name:${JSON.stringify(product.name)},
                price:${product.price},
                image:${JSON.stringify(product.image)},
                weight:${JSON.stringify(product.weight)}
            }, this)'>

            <i class="${isWishlisted(product.id) ? 'ri-heart-fill' : 'ri-heart-line'}"
               style="${isWishlisted(product.id) ? 'color:red;' : ''}">
            </i>

        </button>

        <img
            src="${product.image || 'assets/images/no-image.png'}"
            alt="${product.name}"
            onclick="window.location='product-details.html?id=${product.id}'"
            style="cursor:pointer;">

        <h4
            onclick="window.location='product-details.html?id=${product.id}'"
            style="cursor:pointer;">

            ${product.name}

        </h4>

        <p>${product.weight || ""}</p>

        <div class="price-box">

            <span class="price">₹${product.price}</span>

            <span class="old-price">₹${product.mrp}</span>

        </div>

        <div class="stock-status">

            ${
                product.stock <= 0
                ? `<span class="out-stock">🔴 Out of Stock</span>`
                : product.stock <= 5
                ? `<span class="low-stock">🟡 Only ${product.stock} left</span>`
                : `<span class="in-stock">🟢 In Stock</span>`
            }

        </div>

        <div id="cart-${product.id}">

            ${
                product.stock <= 0
                ? `<button class="out-stock-btn" disabled>Out of Stock</button>`
                : renderCartButton(product)
            }

        </div>

    </div>

    `;
}