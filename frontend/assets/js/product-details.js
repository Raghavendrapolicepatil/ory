// ==========================================
// SNACKIBLE PRODUCT DETAILS V2
// PART 1
// ==========================================

// Product
let currentProduct = null;

// Products
let allProducts = [];

// Selected Variant
let currentVariant = null;

// URL Product ID
const productId = Number(
    new URLSearchParams(
        window.location.search
    ).get("id")
);

// ==========================================
// PAGE START
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    loadProduct

);

// ==========================================
// LOAD PRODUCT
// ==========================================

async function loadProduct(){

    showLoader();

    try{

        const response =
        await fetch(
            "https://snackible-backend.onrender.com/api/products"
        );

        allProducts =
        await response.json();

        currentProduct =
        allProducts.find(item=>

            Number(item.id)===productId

        );

        if(!currentProduct){

            showNotFound();

            return;

        }

renderProduct();

renderVariants();

initGallery();

initViewer();

preloadImages();

initPageActions();

initCart();

updateBottomPrice();

renderRelatedProducts();



hideLoader();

    }

    catch(error){

        console.error(

            "Product Error:",

            error

        );

        showNotFound();

    }

}


// ==========================================
// RENDER PRODUCT
// ==========================================

function renderProduct(){

    renderBasicInfo();

    renderImage();

    renderBadges();

    renderStock();

}
//==========================================
// renderVariants
//==========================================

function renderVariants() {

    const section = document.getElementById("variant-section");
    const list = document.getElementById("variant-list");

    if (!section || !list) return;

    list.innerHTML = "";

    if (
        !currentProduct.variants ||
        currentProduct.variants.length === 0
    ) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";

    currentVariant = currentProduct.variants[0];

    currentProduct.variants.forEach((variant, index) => {

        const discount =
            Math.round(
                ((variant.mrp - variant.price) / variant.mrp) * 100
            );

        const card = document.createElement("div");

        card.className = "variant-card";

        if (index === 0) {
            card.classList.add("active");
        }

        card.innerHTML = `
            <div class="variant-name">${variant.name}</div>

            <div class="variant-price">
                ₹${variant.price}
            </div>

            <div class="variant-mrp">
                ₹${variant.mrp}
            </div>

            <div class="variant-off">
                ${discount}% OFF
            </div>
        `;

        card.onclick = () => {

            currentVariant = variant;

            document
                .querySelectorAll(".variant-card")
                .forEach(card =>
                    card.classList.remove("active")
                );

            card.classList.add("active");

            applyVariant();

        };

        list.appendChild(card);

    });

    applyVariant();

}

//===========================================
//apply Variant
//===========================================

function applyVariant() {

    if (!currentVariant) return;

    const price =
        document.getElementById("product-price");

    const mrp =
        document.getElementById("product-mrp");

    const weight =
        document.getElementById("detail-weight");

    const bottom =
        document.getElementById("bottom-price");

    const image =
        document.getElementById("product-image");

    const discount =
        document.getElementById("product-discount");

    if (price)
        price.textContent =
        "₹" + currentVariant.price;

    if (mrp)
        mrp.textContent =
        "₹" + currentVariant.mrp;

    if (weight)
        weight.textContent =
        currentVariant.weight;

    if (bottom)
        bottom.textContent =
        "₹" + currentVariant.price;

    if (discount) {

        const off =
            Math.round(
                ((currentVariant.mrp - currentVariant.price)
                / currentVariant.mrp) * 100
            );

        discount.textContent =
        off + "% OFF";

    }

    if (image && currentVariant.image) {

        image.src = currentVariant.image;

    }

}

// ==========================================
// BASIC INFO
// ==========================================

function renderBasicInfo(){

    setText(

        "product-brand",

        currentProduct.brand ||

        "Snackible"

    );

    setText(

        "product-name",

        currentProduct.name

    );

    setText(

        "product-rating",

        currentProduct.rating ||

        "4.5"

    );

    setText(

        "review-count",

        (currentProduct.reviewCount||0)

        +" Ratings"

    );

    setText(

        "product-price",

        "₹"+currentProduct.price

    );

    setText(

        "product-mrp",

        "₹"+currentProduct.mrp

    );

    setText(

        "product-discount",

        currentProduct.discount ||

        ""

    );

    setText(

        "product-description",

        currentProduct.description ||

        "No description available."

    );

    setText(

        "detail-brand",

        currentProduct.brand ||

        "-"

    );

    setText(

        "detail-category",

        currentProduct.category ||

        "-"

    );

    setText(

        "detail-weight",

        currentProduct.weight ||

        "-"

    );

    setText(

        "detail-sku",

        currentProduct.sku ||

        "-"

    );

    setText(

        "detail-seller",

        currentProduct.seller ||

        "Snackible Grocery"

    );

    setText(

        "bottom-price",

        "₹"+currentProduct.price

    );

}

// ==========================================
// PRODUCT IMAGE
// ==========================================

function renderImage(){

    const img =

    document.getElementById(

        "product-image"

    );

    if(!img) return;

    img.src =

    currentProduct.image ||

    "assets/images/no-image.webp";

    img.alt =

    currentProduct.name;

    img.onerror = ()=>{

        img.src=

        "assets/images/no-image.webp";

    };

}

// ==========================================
// BADGES
// ==========================================

function renderBadges(){

    toggleBadge(

        "best-badge",

        currentProduct.bestSeller

    );

    toggleBadge(

        "new-badge",

        currentProduct.newArrival

    );

    toggleBadge(

        "trend-badge",

        currentProduct.trending

    );

}

// ==========================================
// STOCK
// ==========================================

function renderStock(){

    const stock =

    document.getElementById(

        "stock-status"

    );

    if(!stock) return;

    stock.className =

    "stock-status";

    if(currentProduct.stock<=0){

        stock.classList.add(

            "out"

        );

        stock.innerHTML=

        "🔴 Out of Stock";

        return;

    }

    if(currentProduct.stock<=5){

        stock.classList.add(

            "low"

        );

        stock.innerHTML=

        "🟡 Only "

        +currentProduct.stock+

        " Left";

        return;

    }

    stock.innerHTML=

    "🟢 In Stock";

}

// ==========================================
// LOADER
// ==========================================

function showLoader(){

    document

    .getElementById(

        "page-loader"

    )

    ?.classList.remove(

        "hide"

    );

}

function hideLoader(){

    document

    .getElementById(

        "page-loader"

    )

    ?.classList.add(

        "hide"

    );

}

// ==========================================
// HELPERS
// ==========================================

function setText(id,text){

    const el =

    document.getElementById(id);

    if(el){

        el.textContent=text;

    }

}

function toggleBadge(id,show){

    const badge=

    document.getElementById(id);

    if(!badge) return;

    badge.style.display=

    show

    ?

    "inline-flex"

    :

    "none";

}

// ==========================================
// NOT FOUND
// ==========================================

function showNotFound(){

    document.body.innerHTML=

    `

    <div style="

    height:100vh;

    display:flex;

    justify-content:center;

    align-items:center;

    flex-direction:column;

    gap:15px;

    font-family:sans-serif;">

        <h2>

        Product Not Found

        </h2>

        <button

        onclick="history.back()">

        Go Back

        </button>

    </div>

    `;

}
// ==========================================
// PART 2
// GALLERY
// ==========================================

// Gallery Images
let galleryImages = [];

// ==========================================
// INIT GALLERY
// ==========================================

function initGallery(){

    const thumbList =
    document.getElementById(
        "thumbnail-list"
    );

    if(!thumbList) return;

    galleryImages = [];

    // Main Image

    if(currentProduct.image){

        galleryImages.push(

            currentProduct.image

        );

    }

    // Gallery Images

    if(

        Array.isArray(

            currentProduct.gallery

        )

    ){

        currentProduct.gallery.forEach(img=>{

            if(

                img &&

                !galleryImages.includes(img)

            ){

                galleryImages.push(img);

            }

        });

    }

    // No Image

    if(galleryImages.length===0){

        galleryImages.push(

            "assets/images/no-image.webp"

        );

    }

    thumbList.innerHTML="";

    galleryImages.forEach(

        (image,index)=>{

            createThumbnail(

                image,

                index

            );

        }

    );

    changeImage(

        galleryImages[0]

    );

}


// ==========================================
// CREATE THUMB
// ==========================================

function createThumbnail(image,index){

    const thumb =

    document.createElement(

        "div"

    );

    thumb.className =

    "thumbnail";

    if(index===0){

        thumb.classList.add(

            "active"

        );

    }

    thumb.innerHTML=

    `
    <img

    src="${image}"

    loading="lazy"

    onerror="this.src='assets/images/no-image.webp'">

    `;

    thumb.onclick=()=>{

        changeImage(

            image

        );

        document

        .querySelectorAll(

            ".thumbnail"

        )

        .forEach(item=>{

            item.classList.remove(

                "active"

            );

        });

        thumb.classList.add(

            "active"

        );

    };

    document

    .getElementById(

        "thumbnail-list"

    )

    .appendChild(

        thumb

    );

}

// ==========================================
// CHANGE IMAGE
// ==========================================

function changeImage(image){

    const img =

    document.getElementById(

        "product-image"

    );

    if(!img) return;

    img.classList.remove(

        "fade"

    );

    void img.offsetWidth;

    img.classList.add(

        "fade"

    );

    img.src=image;

    img.onerror=()=>{

        img.src=

        "assets/images/no-image.webp";

    };

}

// ==========================================
// IMAGE VIEWER
// ==========================================

function initViewer(){

    const image =

    document.getElementById(

        "product-image"

    );

    const viewer =

    document.getElementById(

        "image-viewer"

    );

    const preview =

    document.getElementById(

        "preview-image"

    );

    const close =

    document.getElementById(

        "close-viewer"

    );

    if(

        !image ||

        !viewer ||

        !preview ||

        !close

    ) return;

    image.onclick=()=>{

        preview.src=image.src;

        viewer.classList.add(

            "show"

        );

    };

    close.onclick=()=>{

        viewer.classList.remove(

            "show"

        );

    };

    viewer.onclick=(e)=>{

        if(e.target===viewer){

            viewer.classList.remove(

                "show"

            );

        }

    };

}

// ==========================================
// PRELOAD IMAGES
// ==========================================

function preloadImages(){

    galleryImages.forEach(src=>{

        const img=new Image();

        img.src=src;

    });

}
// ==========================================
// PART 3
// WISHLIST + SHARE + ACCORDION
// ==========================================

// ==========================================
// INIT PAGE ACTIONS
// ==========================================

function initPageActions(){

    initWishlist();

    initShare();

    initAccordion();


updateBottomPrice();
}

// ==========================================
// WISHLIST
// ==========================================

function initWishlist(){

    const btn = document.getElementById("wishlist-btn");

    if(!btn || !currentProduct) return;

    updateWishlistIcon();

    btn.onclick = ()=>{

        if(typeof toggleWishlist==="function"){

            toggleWishlist({

                id:currentProduct.id,
                name:currentProduct.name,
                price:currentProduct.price,
                image:currentProduct.image,
                weight:currentProduct.weight

            },btn);

        }

        setTimeout(updateWishlistIcon,100);

    };

}

function updateWishlistIcon(){

    const icon =
    document.querySelector("#wishlist-btn i");

    if(!icon) return;

    let wish = false;

    if(typeof isWishlisted==="function"){

        wish = isWishlisted(currentProduct.id);

    }

    if(wish){

        icon.className="ri-heart-fill";

        icon.style.color="#ff3b5c";

        icon.animate([

            {transform:"scale(.8)"},

            {transform:"scale(1.2)"},

            {transform:"scale(1)"}

        ],{

            duration:250

        });

    }

    else{

        icon.className="ri-heart-line";

        icon.style.color="";

    }

}

// ==========================================
// SHARE
// ==========================================

function initShare(){

    const btn =
    document.getElementById("share-btn");

    if(!btn) return;

    btn.onclick = async()=>{

        const data={

            title:currentProduct.name,

            text:currentProduct.name,

            url:window.location.href

        };

        try{

            if(navigator.share){

                await navigator.share(data);

            }

            else{

                await navigator.clipboard.writeText(

                    window.location.href

                );

                showToast("Link Copied");

            }

        }

        catch(err){

            console.log(err);

        }

    };

}

// ==========================================
// ACCORDION
// ==========================================

function initAccordion(){

    createAccordion(

        "about-toggle",

        "about-content"

    );

    createAccordion(

        "details-toggle",

        "details-content"

    );

}

function createAccordion(buttonId,contentId){

    const button =
    document.getElementById(buttonId);

    const content =
    document.getElementById(contentId);

    if(!button || !content) return;

    const arrow =
    button.querySelector("i");

    content.style.maxHeight="0px";

    content.style.overflow="hidden";

    content.style.transition=

    "max-height .35s ease";

    button.onclick=()=>{

        const open=

        content.style.maxHeight!=="0px";

        if(open){

            content.style.maxHeight="0px";

            arrow.style.transform=

            "rotate(0deg)";

        }

        else{

            content.style.maxHeight=

            content.scrollHeight+

            "px";

            arrow.style.transform=

            "rotate(180deg)";

        }

    };

}
// ==========================================
// PART 4
// CART + BUY NOW
// ==========================================

// ==========================================
// INIT CART
// ==========================================

function initCart(){

    renderCart();

    document
    .getElementById("plus-btn")
    ?.addEventListener("click",plusCurrentProduct);

    document
    .getElementById("minus-btn")
    ?.addEventListener("click",minusCurrentProduct);

    document
    .getElementById("buy-now")
    ?.addEventListener("click",buyNow);


}



// ==========================================
// RENDER CART
// ==========================================
console.log("renderCart", currentVariant);
function renderCart(){

    const addBtn =
    document.getElementById("add-cart-btn");

    const cartBox =
    document.getElementById("cart-box");

    const qtyBox =
    document.getElementById("quantity-box");

    const buyBtn =
    document.getElementById("buy-now");

    if(
        !addBtn ||
        !cartBox ||
        !qtyBox ||
        !buyBtn
    ) return;

    // Out Of Stock

    if(currentProduct.stock<=0){

        addBtn.disabled=true;

        addBtn.innerHTML="Out of Stock";

        buyBtn.style.display="none";

        qtyBox.style.display="none";

        return;

    }

   const qty =
getProductQty(getCurrentCartId());
    // No Item

    if(qty===0){

        cartBox.style.display="block";

        qtyBox.style.display="none";

        buyBtn.style.display="none";

        addBtn.disabled=false;

        addBtn.innerHTML=`

        <i class="ri-shopping-cart-2-line"></i>

        Add to Cart

        `;

        addBtn.onclick=addCurrentProduct;

        return;

    }

    // Added

    cartBox.style.display="none";

    qtyBox.style.display="flex";

    buyBtn.style.display="flex";

    document.getElementById(
        "product-qty"
    ).textContent=qty;

}

// ==========================================
// ADD
// ==========================================



function addCurrentProduct(){

    const variantId = currentVariant
        ? currentProduct.id + "-" + currentVariant.name
        : currentProduct.id;

    const productPrice = currentVariant
        ? currentVariant.price
        : currentProduct.price;

    const productImage = currentVariant
        ? currentVariant.image
        : currentProduct.image;

    const productWeight = currentVariant
        ? currentVariant.weight
        : currentProduct.weight;

    addToCart(
        variantId,
        currentProduct.name,
        productPrice,
        productImage,
        productWeight
    );

    renderCart();
    refreshFloatingCart();
    updateBottomPrice();
    showToast("Added to Cart");

}
// ==========================================
// PLUS
// ==========================================

function getCurrentCartId() {

    return currentVariant
        ? currentProduct.id + "-" + currentVariant.name
        : currentProduct.id;

}

function getCurrentCartId() {
    return currentVariant
        ? currentProduct.id + "-" + currentVariant.name
        : currentProduct.id;
}

function plusCurrentProduct(){

    increaseQty(getCurrentCartId());

    renderCart();

    updateBottomPrice();

}

// ==========================================
// MINUS
// ==========================================

function minusCurrentProduct(){

    decreaseQty(currentProduct.id);

    renderCart();

    updateBottomPrice();

    refreshFloatingCart();

}

// ==========================================
// BUY NOW
// ==========================================

function buyNow(){

    if(

        getProductQty(

            currentProduct.id

        )===0

    ){

        addCurrentProduct();

    }

    location.href="checkout.html";

}

// ==========================================
// BOTTOM PRICE
// ==========================================

function updateBottomPrice(){

    const price=

    currentVariant

    ?

    currentVariant.price

    :

    currentProduct.price;

    document.getElementById(

        "bottom-price"

    ).textContent=

    "₹"+price;

}

// ==========================================
// CART SYNC
// ==========================================

window.addEventListener(

    "cartUpdated",

    ()=>{

        renderCart();

    }

);

window.addEventListener(

    "pageshow",

    ()=>{

        renderCart();

    }

);
// ==========================================
// PART 5
// RELATED PRODUCTS
// ==========================================

function renderRelatedProducts(){

    const container =
    document.getElementById(
        "related-products"
    );

    if(!container) return;

    container.innerHTML="";

    const related = allProducts.filter(product=>

        product.category===currentProduct.category &&

        product.id!==currentProduct.id &&

        product.isActive!==false

    );

    if(related.length===0){

        container.innerHTML=`

        <div class="empty-related">

            No Related Products

        </div>

        `;

        return;

    }

    related.slice(0,10).forEach(product=>{

        container.insertAdjacentHTML(

            "beforeend",

            createRelatedCard(product)

        );

    });

}

// ==========================================
// RELATED CARD
// ==========================================

function createRelatedCard(product){

    const wish =

    typeof isWishlisted==="function"

    ?

    isWishlisted(product.id)

    :

    false;

    return `

    <div
        class="related-card fade">

        <button

            class="wishlist-btn"

            onclick="event.stopPropagation();
            toggleRelatedWishlist(${product.id},this)">

            <i class="${
                wish
                ?
                "ri-heart-fill"
                :
                "ri-heart-line"
            }"></i>

        </button>

        <img

            src="${
                product.image ||
                "assets/images/no-image.webp"
            }"

            loading="lazy"

            onerror="this.src='assets/images/no-image.webp'"

            onclick="openProduct(${product.id})">

        <div class="related-info">

            <h4>

                ${product.name}

            </h4>

            <p>

                ${product.weight || ""}

            </p>

            <div class="related-price">

                <span class="price">

                    ₹${product.price}

                </span>

                <span class="mrp">

                    ₹${product.mrp}

                </span>

            </div>

            <button

                class="related-add"

                onclick="event.stopPropagation();
                addRelatedProduct(${product.id})">

                ADD

            </button>

        </div>

    </div>

    `;

}

// ==========================================
// OPEN PRODUCT
// ==========================================

function openProduct(id){

    location.href=

    "product-details.html?id="+id;

}

// ==========================================
// ADD RELATED PRODUCT
// ==========================================

function addRelatedProduct(id){

    const product =

    allProducts.find(item=>

        item.id===id

    );

    if(!product) return;

    addToCart(

        product.id,

        product.name,

        product.price,

        product.image

    );

    showToast(

        "Added to Cart"

    );

}

//flowting cart



// ==========================================
// RELATED WISHLIST
// ==========================================

function toggleRelatedWishlist(id,button){

    const product =

    allProducts.find(item=>

        item.id===id

    );

    if(!product) return;

    if(typeof toggleWishlist==="function"){

        toggleWishlist({

            id:product.id,

            name:product.name,

            price:product.price,

            image:product.image,

            weight:product.weight

        },button);

    }

}

// ==========================================
// REFRESH RELATED
// ==========================================

function refreshRelated(){

    renderRelatedProducts();

}

// ==========================================
// AUTO REFRESH
// ==========================================

window.addEventListener(

    "wishlistUpdated",

    refreshRelated

);

window.addEventListener(

    "storage",

    refreshRelated

);


// ==========================================
// PART 6
// FINAL
// ==========================================

// ==========================================
// TOAST
// ==========================================

function showToast(message){

    const toast =
    document.getElementById("toast");

    if(!toast) return;

    toast.querySelector("span").textContent =
    message;

    toast.classList.remove("show");

    void toast.offsetWidth;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(()=>{

        toast.classList.remove("show");

    },2200);

}

// ==========================================
// RIPPLE EFFECT
// ==========================================

document.addEventListener("click",e=>{

    const btn = e.target.closest(

        ".add-cart-btn,.buy-btn,.related-add"

    );

    if(!btn) return;

    const ripple =
    document.createElement("span");

    ripple.className="ripple";

    const rect =
    btn.getBoundingClientRect();

    ripple.style.left=
    (e.clientX-rect.left)+"px";

    ripple.style.top=
    (e.clientY-rect.top)+"px";

    btn.appendChild(ripple);

    setTimeout(()=>{

        ripple.remove();

    },600);

});

// ==========================================
// CART BOUNCE
// ==========================================

function bounceCart(){

    const bar =
    document.querySelector(".bottom-bar");

    if(!bar) return;

    bar.animate([

        {transform:"translateY(80px)"},

        {transform:"translateY(-6px)"},

        {transform:"translateY(0)"}

    ],{

        duration:350,

        easing:"ease"

    });

}

// ==========================================
// HEART BOUNCE
// ==========================================

function heartBounce(){

    const icon =

    document.querySelector(

        "#wishlist-btn i"

    );

    if(!icon) return;

    icon.animate([

        {transform:"scale(.7)"},

        {transform:"scale(1.3)"},

        {transform:"scale(1)"}

    ],{

        duration:280

    });

}

// ==========================================
// AFTER ADD
// ==========================================

const oldAdd =
addCurrentProduct;

addCurrentProduct = function(){

    oldAdd();

    bounceCart();

};

// ==========================================
// LOADER FINISH
// ==========================================

window.addEventListener(

    "load",

    ()=>{

        setTimeout(()=>{

            hideLoader();

        },250);

    }

);

// ==========================================
// AUTO REFRESH
// ==========================================

window.addEventListener(

    "pageshow",

    ()=>{

        if(currentProduct){

            renderCart();

            updateBottomPrice();

        }

    }

);

// ==========================================
// PERFORMANCE
// ==========================================

document.querySelectorAll("img")

.forEach(img=>{

    img.loading="lazy";

});

//floatng cart
document
.getElementById("floating-cart-btn")
?.addEventListener("click",()=>{

    window.location.href="checkout.html";

});
// ==========================================
// FLOATING CART
// ==========================================

function refreshFloatingCart(){

    const bar = document.getElementById("floatingCartBar");
    const count = document.getElementById("floating-cart-count");
    const total = document.getElementById("floating-cart-total");

    if(!bar) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length===0){

        bar.style.display="none";
        return;

    }

    const items = cart.reduce((sum,item)=>sum+item.qty,0);

    const amount = cart.reduce((sum,item)=>{

        return sum + (item.price * item.qty);

    },0);

    count.textContent = items + " Items";

    total.textContent = "₹" + amount;

    bar.style.display="flex";

}

// ==========================================
// FINAL INIT
// ==========================================

function initProductPage(){

    renderProduct();

    renderVariants();

    initGallery();

    initViewer();

    preloadImages();

    initPageActions();

   

    updateBottomPrice();

    renderVariants();

    renderRelatedProducts();

    renderCart();

    refreshFloatingCart();

}

//======================================

//======================================
// ==========================================
// LOAD PRODUCT CHANGE
// ==========================================

// loadProduct() ke andar
// renderProduct()
// ki jagah

// initProductPage()

// call karna.