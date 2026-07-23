// ======================================
// Snackible Products V2
// ======================================

let allProducts = [];

// ======================================
// Floating Cart
// ======================================

function refreshFloatingCart(){

    const bar = document.getElementById("floatingCartBar");
    const count = document.getElementById("floating-cart-count");
    const total = document.getElementById("floating-cart-total");

    if(!bar) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0){

        bar.style.display = "none";
        return;

    }

    const items = cart.reduce((sum,item)=>sum + item.qty,0);
    const amount = cart.reduce((sum,item)=>sum + (item.price * item.qty),0);

    count.textContent = `${items} Items`;
    total.textContent = `₹${amount}`;

    bar.style.display = "flex";

}

// ======================================
// Load Products
// ======================================

async function loadProducts(){

    try{

        const response =
        await fetch("https://snackible-backend.onrender.com/api/products");

        allProducts =
        await response.json();

        renderProducts();

        renderTodaysDeals();

        animateCards();

        initSearch();

    }

    catch(err){

        console.error("Products Load Error:",err);

    }

}

// ======================================
// Search Init
// ======================================

function initSearch(){

    const searchInput =
    document.getElementById("searchInput");

    if(!searchInput) return;

    searchInput.addEventListener("input",function(){

        const keyword =
        this.value.trim().toLowerCase();

        // Empty Search
        if(keyword===""){

            document
            .querySelectorAll(".product-slider")
            .forEach(box=>box.innerHTML="");

            renderProducts();

            renderTodaysDeals();

            animateCards();

            return;

        }

        // Clear all category containers
        document
        .querySelectorAll(".product-slider")
        .forEach(box=>box.innerHTML="");

        // Search Products
        const filtered =
        allProducts.filter(product=>

            product.name
            .toLowerCase()
            .includes(keyword)

        );

        filtered.forEach(product=>{

            const container =
            document.getElementById(product.category);

            if(!container) return;

            container.insertAdjacentHTML(

                "beforeend",

                createProductCard(product)

            );

        });

    });

}

// ======================================
// Today's Deals
// ======================================

function renderTodaysDeals(){

    const box =
    document.getElementById("todays-deals");

    if(!box) return;

    box.innerHTML = "";

    allProducts
    .filter(product=>

        product.todayDeal===true &&

        product.stock>0

    )
    .forEach(product=>{

        box.insertAdjacentHTML(

            "beforeend",

            createProductCard(product)

        );

    });

}

// ======================================
// Render Products
// ======================================

function renderProducts(){

    // Pehle sab category containers clear
    document
    .querySelectorAll(".product-slider")
    .forEach(box=>{

        box.innerHTML="";

    });

    // Products render
    allProducts.forEach(product=>{

        const container =
        document.getElementById(product.category);

        if(!container) return;

        container.insertAdjacentHTML(

            "beforeend",

            createProductCard(product)

        );

    });

}

// ======================================
// Premium Product Card
// ======================================

function createProductCard(product){

    return `

    <div class="product-card">

        <span class="discount">
            ${product.discount || "0% OFF"}
        </span>

        <button
            class="wishlist-btn"
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
            style="${
                isWishlisted(product.id)
                ? "color:#ff3b5c"
                : ""
            }"></i>

        </button>

        <div class="image-box">

            <img
                loading="lazy"
                src="${product.image}"
                alt="${product.name}"
                onclick="window.location='product-details.html?id=${product.id}'">

            <div
                class="floating-cart-btn"
                id="cart-${product.id}">

                ${
                    product.stock<=0
                    ?
                    `<button class="out-stock-btn" disabled>
                        Out
                    </button>`
                    :
                    renderCartButton(product)
                }

            </div>

        </div>

        <div class="delivery-tag">
            ⚡ 15 mins
        </div>

        <h4
            onclick="window.location='product-details.html?id=${product.id}'">

            ${product.name}

        </h4>

        <div class="weight-chip">
            ${product.weight || ""}
        </div>

        <div class="rating-row">

            <i class="ri-star-fill"></i>

            <span>4.6</span>

            <small>(120)</small>

        </div>

        <div class="price-box">

            <span class="price">
                ₹${product.price}
            </span>

            <span class="old-price">
                ₹${product.mrp}
            </span>

        </div>

    </div>

    `;

}

// ======================================
// Cart Button
// ======================================

function renderCartButton(product){

    const qty = getProductQty(product.id);

    if(qty===0){

        return `

        <button
            class="add-btn"
            onclick="addProduct(
                ${product.id},
                '${product.name.replace(/'/g,"\\'")}',
                ${product.price},
                '${product.image}'
            )">

            <i class="ri-add-line"></i>

        </button>

        `;

    }

    return `

    <div class="quantity-control">

        <button
            onclick="minusProduct(${product.id})">

            <i class="ri-subtract-line"></i>

        </button>

        <span>${qty}</span>

        <button
            onclick="plusProduct(${product.id})">

            <i class="ri-add-line"></i>

        </button>

    </div>

    `;

}

// ======================================
// Add Product
// ======================================

function addProduct(id,name,price,image){

    addToCart(id,name,price,image);

    refreshProduct(id);

    refreshFloatingCart();

}

// ======================================
// Plus
// ======================================

function plusProduct(id){

    increaseQty(id);

    refreshProduct(id);

    refreshFloatingCart();

}

// ======================================
// Minus
// ======================================

function minusProduct(id){

    decreaseQty(id);

    refreshProduct(id);

    refreshFloatingCart();

}

// ======================================
// Refresh Product
// ======================================

function refreshProduct(id){

    const box =
    document.getElementById("cart-"+id);

    if(!box) return;

    const product =
    allProducts.find(p=>p.id===id);

    if(!product) return;

    box.innerHTML =
    renderCartButton(product);

}

// ======================================
// Card Animation
// ======================================

function animateCards(){

    document
    .querySelectorAll(".product-card")
    .forEach((card,index)=>{

        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";

        setTimeout(()=>{

            card.style.transition = ".3s";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        },index*20);

    });

}

// ======================================
// Refresh All Cart Buttons
// ======================================

function refreshAllProducts(){

    allProducts.forEach(product=>{

        refreshProduct(product.id);

    });

}

// ======================================
// Browser Back
// ======================================

window.addEventListener("pageshow",()=>{

    updateCartCount();

    refreshAllProducts();

    refreshFloatingCart();

});

// ======================================
// Cart Updated
// ======================================

window.addEventListener("cartUpdated",()=>{

    refreshAllProducts();

    refreshFloatingCart();

});

// ======================================
// Storage Sync
// ======================================

window.addEventListener("storage",()=>{

    refreshAllProducts();

    refreshFloatingCart();

});

// ======================================
// Start
// ======================================

document.addEventListener("DOMContentLoaded",()=>{

    loadProducts();

});