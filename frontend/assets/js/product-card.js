// ==========================================
// Snackible Product Card
// ==========================================

function createProductCard(product){

    return `

    <div class="product-card">

        <span class="discount">
            ${product.discount || "0% OFF"}
        </span>

        <!-- Wishlist -->

        <button
            type="button"
            class="wishlist-btn"
            aria-label="${
                isWishlisted(product.id)
                ? "Remove " + product.name + " from wishlist"
                : "Add " + product.name + " to wishlist"
            }"
            onclick='toggleWishlist({
                id:${product.id},
                name:${JSON.stringify(product.name)},
                price:${product.price},
                image:${JSON.stringify(product.image)},
                weight:${JSON.stringify(product.weight)}
            },this)'>

            <i class="${
                isWishlisted(product.id)
                ? "ri-heart-fill"
                : "ri-heart-line"
            }"
            aria-hidden="true"
            style="${
                isWishlisted(product.id)
                ? "color:#ff3b5c;"
                : ""
            }"></i>

        </button>

        <!-- Image -->

        <div class="image-box">

            <img
                loading="lazy"
                src="${product.image || "assets/images/no-image.png"}"
                alt="${product.name || "Product image"}"
                onclick="window.location='product-details.html?id=${product.id}'"
                style="cursor:pointer;">

            <div
                class="floating-cart-btn"
                id="cart-${product.id}">

                ${
                    product.stock <= 0
                    ? `<button
                            type="button"
                            class="out-stock-btn"
                            disabled
                            aria-label="${product.name} is out of stock">
                            Out of Stock
                       </button>`
                    : renderCartButton(product)
                }

            </div>

        </div>

        <!-- Delivery -->

        <div class="delivery-tag">

            ⚡ 15 mins

        </div>

        <!-- Product Name -->

        <h4
            onclick="window.location='product-details.html?id=${product.id}'"
            style="cursor:pointer;">

            ${product.name}

        </h4>

        <!-- Weight -->

        <div class="weight-chip">

            ${product.weight || ""}

        </div>

        <!-- Rating -->

        <div class="rating-row">

            <i
                class="ri-star-fill"
                aria-hidden="true">
            </i>

            <span>4.6</span>

            <small>(120)</small>

        </div>

        <!-- Price -->

        <div class="price-box">

            <span class="price">
                ₹${product.price}
            </span>

            <span class="old-price">
                ₹${product.mrp || product.price}
            </span>

        </div>

        <!-- Stock -->

        <div class="stock-status">

            ${
                product.stock <= 0

                ? `<span class="out-stock">
                        🔴 Out of Stock
                   </span>`

                : product.stock <= 5

                ? `<span class="low-stock">
                        🟡 Only ${product.stock} left
                   </span>`

                : `<span class="in-stock">
                        🟢 In Stock
                   </span>`
            }

        </div>

    </div>

    `;

}