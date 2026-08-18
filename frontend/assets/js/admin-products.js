// ==========================================
// Orymart Admin Products
// ==========================================

const API = "https://snackible-backend.onrender.com/api/products";

// Elements
const form = document.getElementById("productForm");
const productsBox = document.getElementById("products");
const searchInput = document.getElementById("searchProduct");
const previewImage = document.getElementById("previewImage");
const productCount = document.getElementById("productCount");
const toast = document.getElementById("toast");

//NEW CODE CALCULETE

const mrpInput = document.getElementById("mrp");
const priceInput = document.getElementById("price");
const discountInput = document.getElementById("discount");

function updateDiscount() {

    const mrp = Number(mrpInput.value);
    const price = Number(priceInput.value);

    if (mrp > 0 && price > 0 && price <= mrp) {

        const discount = ((mrp - price) / mrp) * 100;

        discountInput.value = Math.round(discount) + "%";

    } else {

        discountInput.value = "";

    }

}

mrpInput.addEventListener("input", updateDiscount);
priceInput.addEventListener("input", updateDiscount);

// Variables
let allProducts = [];
let editId = null;

// ==========================================
// Toast
// ==========================================

function showToast(message){

    if(!toast){

        alert(message);

        return;

    }

    toast.textContent = message;

    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display = "none";

    },2000);

}





// ==========================================
// Render Products
// ==========================================

function renderProducts(products){

    productsBox.innerHTML = "";

    if(productCount){
        productCount.textContent = products.length;
    }

    if(products.length === 0){

        productsBox.innerHTML = `
            <div class="empty-products">
                <i class="ri-shopping-basket-line"></i>
                <h3>No Products Found</h3>
            </div>
        `;

        return;
    }

    products.forEach(product=>{

        const imagePath = product.image && product.image.startsWith("assets/")
            ? "../" + product.image
            : (product.image || "../assets/images/no-image.png");

        const stockClass =
            product.stock <= 0
            ? "out-stock"
            : product.stock <= 5
            ? "low-stock"
            : "in-stock";

        const stockText =
            product.stock <= 0
            ? "🔴 Out of Stock"
            : product.stock <= 5
            ? "🟡 Low Stock"
            : "🟢 In Stock";

        productsBox.innerHTML += `

<div class="product-card">

    <img src="${imagePath}" alt="${product.name}">

    <div class="product-content">

        <h3>${product.name}</h3>

        <div class="price-row">
            <span class="price">₹${product.price}</span>
            <span class="mrp">₹${product.mrp}</span>
        </div>

        <div class="product-details">
            <span>Category</span>
            <strong>${product.category || "-"}</strong>

            <span>Brand</span>
            <strong>${product.brand || "-"}</strong>

            <span>Weight</span>
            <strong>${product.weight || "-"}</strong>

            <span>Stock</span>
            <strong>${product.stock}</strong>

            <span>Shelf Life</span>
<strong>
    ${product.shelfLifeDays
        ? product.shelfLifeDays + " Days"
        : "-"}
</strong>
        </div>

        <div class="stock ${stockClass}">
            ${stockText}
        </div>

        <div class="product-tags">
            ${product.todayDeal ? `<span>Today's Deal</span>` : ""}
            ${product.featured ? `<span>Featured</span>` : ""}
            ${product.bestSeller ? `<span>Best Seller</span>` : ""}
            ${product.newArrival ? `<span>New Arrival</span>` : ""}
            ${product.trending ? `<span>Trending</span>` : ""}
        </div>

        <p style="margin-top:15px;color:#666;">
            ${product.description || ""}
        </p>

        <div class="actions">

            <button
                class="edit-btn"
                onclick="editProduct(${product.id})">
                <i class="ri-edit-line"></i>
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteProduct(${product.id})">
                <i class="ri-delete-bin-6-line"></i>
                Delete
            </button>

        </div>

    </div>

</div>

`;

    });

}

// ==========================================
// Load Products
// ==========================================

async function loadProducts(){

    try{

        const response = await fetch(API);

        if(!response.ok){
            throw new Error("Failed to fetch products");
        }

        allProducts = await response.json();

        renderProducts(allProducts);

    }
    catch(error){

        console.error(error);

        allProducts = [];

        renderProducts([]);

        showToast("❌ Failed to load products");

    }

}

// ==========================================
// Search Products
// ==========================================

if(searchInput){

    searchInput.addEventListener("input",()=>{

        const keyword = searchInput.value
            .toLowerCase()
            .trim();

        const filtered = allProducts.filter(product=>{

            return (

                (product.name || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (product.category || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (product.brand || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (product.weight || "")
                .toLowerCase()
                .includes(keyword)

            );

        });

        renderProducts(filtered);

    });

}

// ==========================================
// Edit Product
// ==========================================

function editProduct(id){

    const product = allProducts.find(p => p.id == id);

    if(!product){

        showToast("❌ Product Not Found");
        return;

    }

    editId = product.id;

    document.getElementById("name").value = product.name || "";
    document.getElementById("category").value = product.category || "";
    document.getElementById("price").value = product.price || "";
    document.getElementById("mrp").value = product.mrp || "";
    updateDiscount();
    document.getElementById("weight").value = product.weight || "";
    document.getElementById("discount").value = product.discount || "";
    document.getElementById("brand").value = product.brand || "";
    document.getElementById("stock").value = product.stock || "";
    document.getElementById("shelfLifeDays").value =product.shelfLifeDays || "";
    loadExtraDetails(product.extraDetails || []);
    document.getElementById("image").value = product.image || "";
    document.getElementById("gallery1").value = product.gallery?.[0] || "";
document.getElementById("gallery2").value = product.gallery?.[1] || "";
document.getElementById("gallery3").value = product.gallery?.[2] || "";
document.getElementById("gallery4").value = product.gallery?.[3] || "";

loadVariants(product.variants || []);

    document.getElementById("description").value = product.description || "";

    document.getElementById("todayDeal").checked = product.todayDeal || false;
    document.getElementById("featured").checked = product.featured || false;
    document.getElementById("bestSeller").checked = product.bestSeller || false;
    document.getElementById("newArrival").checked = product.newArrival || false;
    document.getElementById("trending").checked = product.trending || false;

    if(product.image){

        previewImage.src = product.image.startsWith("assets/")
            ? "../" + product.image
            : product.image;

        previewImage.style.display = "block";

    } else {

        previewImage.style.display = "none";

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ==========================================
// Save Product
// ==========================================

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const product={

        name:document.getElementById("name").value.trim(),

        category:document.getElementById("category").value.trim(),

        price:Number(document.getElementById("price").value),

        mrp:Number(document.getElementById("mrp").value),

        weight:document.getElementById("weight").value.trim(),

        discount:document.getElementById("discount").value.trim(),

        brand:document.getElementById("brand").value.trim(),

        stock:Number(document.getElementById("stock").value),

        shelfLifeDays:Number(
    document.getElementById("shelfLifeDays").value
) || null,

extraDetails: getExtraDetails(),

image: (() => {

    const value =
        document.getElementById("image").value.trim();

    if (!value) return "";

    if (value.startsWith("assets/")) {
        return value;
    }

    return `assets/images/products/${value}`;

})(),

gallery: [
    document.getElementById("gallery1").value.trim(),
    document.getElementById("gallery2").value.trim(),
    document.getElementById("gallery3").value.trim(),
    document.getElementById("gallery4").value.trim()
].filter(img => img),

description: document.getElementById("description").value.trim(),

        todayDeal:document.getElementById("todayDeal").checked,

        featured:document.getElementById("featured").checked,

        bestSeller:document.getElementById("bestSeller").checked,

        newArrival:document.getElementById("newArrival").checked,

        trending:document.getElementById("trending").checked,

variants: getVariants()

    };

    try{

        let response;

        if(editId){

            response=await fetch(`${API}/${editId}`,{

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(product)

            });

        }else{

            response=await fetch(API,{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(product)

            });

        }

        if(!response.ok){

            const data=await response.json();

            throw new Error(data.message||"Save Failed");

        }

        showToast(

            editId
            ? "✅ Product Updated"
            : "✅ Product Added"

        );

        editId=null;

        form.reset();

        variantContainer.innerHTML = "";

        previewImage.src="";

        previewImage.style.display="none";

        await loadProducts();


document.getElementById("gallery1").value = "";
document.getElementById("gallery2").value = "";
document.getElementById("gallery3").value = "";
document.getElementById("gallery4").value = "";


    }

    catch(error){

        console.error(error);

        showToast("❌ "+error.message);

    }

});



// ==========================================
// Delete Product
// ==========================================

async function deleteProduct(id){

    if(!id){

        showToast("❌ Invalid Product ID");

        return;

    }

    const ok=confirm("Delete this product?");

    if(!ok) return;

    try{

        const response=await fetch(`${API}/${id}`,{

            method:"DELETE"

        });

        if(!response.ok){

            const data=await response.json();

            throw new Error(data.message||"Delete Failed");

        }

        showToast("🗑 Product Deleted");

        loadProducts();

    }

    catch(error){

        console.error(error);

        showToast("❌ "+error.message);

    }

}

// ==========================================
// Start
// ==========================================

loadProducts();

// ==========================================
// Variant Manager
// ==========================================

const variantContainer = document.getElementById("variantContainer");
const addVariantBtn = document.getElementById("addVariantBtn");

if (addVariantBtn) {
    addVariantBtn.addEventListener("click", () => addVariant());
}

function addVariant(data = {}) {

    const card = document.createElement("div");

    card.className = "variant-item";

    card.innerHTML = `

        <div class="form-grid">

            <input class="variant-name"
                   type="text"
                   placeholder="Variant Name"
                   value="${data.name || ""}">

            <input class="variant-weight"
                   type="text"
                   placeholder="Weight"
                   value="${data.weight || ""}">

            <input class="variant-price"
                   type="number"
                   placeholder="Price"
                   value="${data.price || ""}">

            <input class="variant-mrp"
                   type="number"
                   placeholder="MRP"
                   value="${data.mrp || ""}">

            <input class="variant-stock"
                   type="number"
                   placeholder="Stock"
                   value="${data.stock || ""}">

            <input class="variant-image"
                   type="text"
                   placeholder="Image URL"
                   value="${data.image || ""}">

        </div>

        <div style="margin-top:10px">

            <button
                type="button"
                class="delete-btn">

                Remove Variant

            </button>

        </div>

    `;
    card.querySelector(".delete-btn").onclick = () => {

        card.remove();

    };

    variantContainer.appendChild(card);

}




function getVariants() {

    return [...document.querySelectorAll(".variant-item")]

        .map(item => ({

            name: item.querySelector(".variant-name").value.trim(),

            weight: item.querySelector(".variant-weight").value.trim(),

            price: Number(item.querySelector(".variant-price").value),

            mrp: Number(item.querySelector(".variant-mrp").value),

            stock: Number(item.querySelector(".variant-stock").value),

            image: item.querySelector(".variant-image").value.trim()

        }))

        .filter(v => v.name);

}

function loadVariants(variants = []) {

    variantContainer.innerHTML = "";

    variants.forEach(v => addVariant(v));

}

// ==========================================
// Extra Product Details
// ==========================================

function getExtraDetails(){

    const details = [];

    for(let i = 1; i <= 4; i++){

        const label =
            document.getElementById(`detailLabel${i}`)?.value.trim();

        const value =
            document.getElementById(`detailValue${i}`)?.value.trim();

        if(label && value){

            details.push({
                label: label,
                value: value
            });

        }

    }

    return details;

}


function loadExtraDetails(details = []){

    for(let i = 1; i <= 4; i++){

        const labelInput =
            document.getElementById(`detailLabel${i}`);

        const valueInput =
            document.getElementById(`detailValue${i}`);

        if(labelInput) labelInput.value = "";
        if(valueInput) valueInput.value = "";

    }

    details.slice(0,4).forEach((detail, index) => {

        const number = index + 1;

        const labelInput =
            document.getElementById(`detailLabel${number}`);

        const valueInput =
            document.getElementById(`detailValue${number}`);

        if(labelInput){
            labelInput.value = detail.label || "";
        }

        if(valueInput){
            valueInput.value = detail.value || "";
        }

    });

}