// ======================================
// Snackible Category V3
// ======================================

const API = "https://snackible-backend.onrender.com/api";

let allProducts = [];
let allCategories = [];
let filteredProducts = [];

let categorySlug =
new URLSearchParams(window.location.search)
.get("category") || "";

// ======================================
// Elements
// ======================================

const productContainer =
document.getElementById("product-container");

const sidebar =
document.getElementById("category-sidebar");

const categoryTitle =
document.getElementById("category-title");

const categoryHeading =
document.getElementById("category-heading");

const productCount =
document.getElementById("product-count");

const searchInput =
document.getElementById("searchInput");

const loader =
document.getElementById("page-loader");

const emptyState =
document.getElementById("empty-state");

const floatingCart =
document.getElementById("floatingCartBar");

const floatingCount =
document.getElementById("floating-cart-count");

const floatingTotal =
document.getElementById("floating-cart-total");

// ======================================
// Load Products & Categories
// ======================================

async function loadData(){

    try{

        showLoader(true);

        const [productsRes,categoriesRes] =
        await Promise.all([

            fetch(API + "/products"),

            fetch(API + "/categories")

        ]);

        allProducts =
        await productsRes.json();

        allCategories =
        await categoriesRes.json();

        if(!categorySlug && allCategories.length){

            categorySlug =
            allCategories[0].slug;

        }

        renderSidebar();

        filterProducts();

        updateFloatingCart();

        showLoader(false);

    }

    catch(err){

        console.error(err);

        showLoader(false);

    }

}

// ======================================
// Loader
// ======================================

function showLoader(show){

    if(!loader) return;

    loader.style.display =
    show ? "flex" : "none";

}

// ======================================
// Format Category
// ======================================

function formatCategory(name){

    return name
        .replace(/-/g," ")
        .replace(/\b\w/g,c=>c.toUpperCase());

}

// ======================================
// Sidebar
// ======================================

function renderSidebar(){

    if(!sidebar) return;

    sidebar.innerHTML = "";

    allCategories.forEach(cat=>{

        sidebar.insertAdjacentHTML("beforeend",`

        <div
            class="category-item ${cat.slug===categorySlug?"active":""}"
            onclick="changeCategory('${cat.slug}')">

            <img
                loading="lazy"
                src="${cat.image}"
                alt="${cat.name}">

            <span>${cat.name}</span>

        </div>

        `);

    });

}

// ======================================
// Change Category
// ======================================

function changeCategory(slug){

    if(slug===categorySlug) return;

    categorySlug = slug;

    history.replaceState(
        {},
        "",
        "?category="+slug
    );

    renderSidebar();

    filterProducts();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// ======================================
// Filter Current Category
// ======================================

function filterProducts() {

    const title = formatCategory(categorySlug);

    if (categoryTitle)
        categoryTitle.textContent = title;

    if (categoryHeading)
        categoryHeading.textContent = title;

    activeFilter = "all";

    document
        .querySelectorAll(".filter-chip")
        .forEach(btn => {
            btn.classList.remove("active");

            if (btn.dataset.filter === "all") {
                btn.classList.add("active");
            }
        });

    applyProductFilter();

}

// ======================================
// Product Filters
// ======================================

let activeFilter = "all";

function applyProductFilter() {

    let products = allProducts.filter(product =>
        product.category === categorySlug
    );

    switch (activeFilter) {

        // ==============================
        // ALL
        // ==============================

        case "all":

            break;


        // ==============================
        // POPULAR
        // ==============================

        case "popular":

            products = products.filter(product =>
                product.trending === true ||
                product.featured === true
            );

            break;


        // ==============================
        // LOW PRICE
        // ==============================

        case "low":

            products.sort((a, b) =>
                Number(a.price) - Number(b.price)
            );

            break;


        // ==============================
        // HIGH PRICE
        // ==============================

        case "high":

            products.sort((a, b) =>
                Number(b.price) - Number(a.price)
            );

            break;


        // ==============================
        // OFFERS
        // ==============================

        case "offers":

            products = products.filter(product => {

                const price = Number(product.price);
                const mrp = Number(product.mrp);

                return mrp > price;

            });

            break;


        // ==============================
        // NEW
        // ==============================

        case "new":

            products = products.filter(product =>
                product.newArrival === true
            );

            break;


        // ==============================
        // BEST SELLER
        // ==============================

        case "bestseller":

            products = products.filter(product =>
                product.bestSeller === true
            );

            break;


        // ==============================
        // FAST DELIVERY
        // ==============================

        case "fast":

            // Abhi tumhare database me
            // fastDelivery field nahi hai.
            // Isliye stock products ko show kar rahe hain.

            products = products.filter(product =>
                Number(product.stock) > 0
            );

            break;

    }


    // ==============================
    // OUT OF STOCK LAST
    // ==============================

    products.sort((a, b) => {

        if (a.stock <= 0 && b.stock > 0)
            return 1;

        if (a.stock > 0 && b.stock <= 0)
            return -1;

        return 0;

    });


    filteredProducts = products;


    // ==============================
    // PRODUCT COUNT
    // ==============================

    if (productCount) {

        productCount.textContent =
            products.length + " Products";

    }


    // ==============================
    // RENDER
    // ==============================

    renderProducts(products);

}


// ======================================
// Product Card
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
                onclick="openProduct(${product.id})">

            <div
                class="floating-cart-btn"
                id="cart-${product.id}">

                ${
                    product.stock <= 0
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

        <h4 onclick="openProduct(${product.id})">
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
// Open Product
// ======================================

function openProduct(id){

    window.location.href =
    "product-details.html?id="+id;

}

// ======================================
// Add Product
// ======================================

function addProduct(id,name,price,image){

    addToCart(id,name,price,image);

    refreshProduct(id);

    updateFloatingCart();

}

// ======================================
// Plus
// ======================================

function plusProduct(id){

    increaseQty(id);

    refreshProduct(id);

    updateFloatingCart();

}

// ======================================
// Minus
// ======================================

function minusProduct(id){

    decreaseQty(id);

    refreshProduct(id);

    updateFloatingCart();

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
// Floating Cart
// ======================================

function updateFloatingCart(){

    const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    if(!floatingCart) return;

    if(cart.length===0){

        floatingCart.style.display="none";

        return;

    }

    floatingCart.style.display="flex";

    let items = 0;
    let total = 0;

    cart.forEach(item=>{

        items += item.qty;

        total += item.qty * item.price;

    });

    floatingCount.textContent =
    items + " Items";

    floatingTotal.textContent =
    "₹" + total;

}

// ======================================
// Search
// ======================================

if(searchInput){

    searchInput.addEventListener("input",()=>{

        const keyword =
        searchInput.value
        .trim()
        .toLowerCase();

        const result =
        filteredProducts.filter(product=>

            product.name
            .toLowerCase()
            .includes(keyword)

        );

        renderProducts(result);

    });

}

// ======================================
// Storage Refresh
// ======================================

window.addEventListener("storage",()=>{

    renderProducts(filteredProducts);

    updateFloatingCart();

    if(typeof updateCartCount==="function"){

        updateCartCount();

    }

});

// ======================================
// Browser Back Refresh
// ======================================

window.addEventListener("pageshow",()=>{

    renderProducts(filteredProducts);

    updateFloatingCart();

    if(typeof updateCartCount==="function"){

        updateCartCount();

    }

});

// ======================================
// Page Loaded
// ======================================

window.addEventListener("load",()=>{

    if(productContainer){

        productContainer.style.opacity="1";

        productContainer.style.transform="translateY(0)";

    }

});

// ======================================
// Start
// ======================================

loadData();

window.addEventListener("cartUpdated", () => {

    if (
        typeof filteredProducts !== "undefined" &&
        Array.isArray(filteredProducts)
    ) {

        filteredProducts.forEach(product => {

            refreshProduct(product.id);

        });

    }

    updateFloatingCart();

});

// ======================================
// Filter Buttons
// ======================================

document.querySelectorAll(".filter-chip").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".filter-chip")
            .forEach(btn =>
                btn.classList.remove("active")
            );

        button.classList.add("active");

        activeFilter =
            button.dataset.filter || "all";

        applyProductFilter();

    });

});