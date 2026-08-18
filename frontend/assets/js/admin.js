// ==========================================
// Orymart Admin Panel
// ==========================================

const API = "https://snackible-backend.onrender.com/api/products";

const form = document.getElementById("productForm");

const productsBox = document.getElementById("products");

let editId = null;

// ==========================================
// Upload Image
// ==========================================



// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch(API);

        const products = await response.json();

        productsBox.innerHTML = "";

        products.forEach(product => {

            // Image URL Fix
            const imageUrl = product.image.startsWith("http")
                ? product.image
                : "https://snackible-backend.onrender.com" + product.image;

            productsBox.innerHTML += `

            <div class="admin-card">

                <img src="${product.image || product.thumbnail}" alt="${product.name || product.fileName}">

                <h3>${product.name}</h3>

                <p><b>₹${product.price}</b></p>

                <p>${product.weight}</p>

                <p>${product.category}</p>

                <div class="admin-actions">

                   <button
    class="edit-btn"
    onclick="editProduct('${product._id}')">

    Edit

</button>

<button
    class="delete-btn"
    onclick="deleteProduct('${product._id}')">

    Delete

</button>
                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

loadProducts();

// ==========================================
// Add / Update Product
// ==========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

const product = {

    name: document.getElementById("name").value.trim(),

    category: document.getElementById("category").value.trim(),

    price: Number(document.getElementById("price").value),

    mrp: Number(document.getElementById("mrp").value),

    weight: document.getElementById("weight").value.trim(),

    discount: document.getElementById("discount").value.trim(),

    brand: document.getElementById("brand").value.trim(),

    stock: Number(document.getElementById("stock").value),

    image: document.getElementById("image").value.trim(),

    description: document.getElementById("description").value.trim(),

    todayDeal: document.getElementById("todayDeal").checked,

    featured: document.getElementById("featured").checked,

    bestSeller: document.getElementById("bestSeller").checked,

    newArrival: document.getElementById("newArrival").checked,

    trending: document.getElementById("trending").checked

    

};

    try {

        if (editId === null) {

            const response = await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(product)

            });

            if (!response.ok) {

                throw new Error("Product Add Failed");

            }

            alert("✅ Product Added");

        } else {

            const response = await fetch(`${API}/${editId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(product)

            });

            if (!response.ok) {

                throw new Error("Product Update Failed");

            }

            alert("✅ Product Updated");

            editId = null;

        }

        form.reset();

        loadProducts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

// ==========================================
// Image Preview
// ==========================================

const imageFile = document.getElementById("imageFile");
const previewImage = document.getElementById("previewImage");

imageFile.addEventListener("change", () => {

    const file = imageFile.files[0];

    if (!file) return;

    previewImage.src = URL.createObjectURL(file);

    previewImage.style.display = "block";

});

// ==========================================
// Edit Product
// ==========================================

async function editProduct(id) {

    try {

        const response = await fetch(`${API}/${id}`);
        const product = await response.json();

        editId = id;

        document.getElementById("name").value = product.name;
        document.getElementById("category").value = product.category;
        document.getElementById("price").value = product.price;
        document.getElementById("mrp").value = product.mrp;
        document.getElementById("weight").value = product.weight;
        document.getElementById("discount").value = product.discount;
        document.getElementById("brand").value = product.brand;
        document.getElementById("stock").value = product.stock;
        document.getElementById("image").value = product.image;
        document.getElementById("description").value = product.description;

        // Product Tags
        document.getElementById("todayDeal").checked = product.todayDeal || false;
        document.getElementById("featured").checked = product.featured || false;
        document.getElementById("bestSeller").checked = product.bestSeller || false;
        document.getElementById("newArrival").checked = product.newArrival || false;
        document.getElementById("trending").checked = product.trending || false;

        form.querySelector("button").innerHTML =
            '<i class="ri-save-line"></i> Update Product';

    } catch (error) {

        console.error(error);
        alert("Unable to load product.");

    }

}
// ==========================================
// Delete Product
// ==========================================

async function deleteProduct(id) {

    const ok = confirm("Delete this product?");

    if (!ok) return;

    try {

        const response = await fetch(`${API}/${id}`, {

            method: "DELETE"

        });

        if (!response.ok) {

            throw new Error("Delete Failed");

        }

        alert("✅ Product Deleted");

        loadProducts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}