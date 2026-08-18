// ==========================================
// Orymart Admin Categories
// ==========================================

const API = "https://snackible-backend.onrender.com/api/categories";

const form = document.getElementById("categoryForm");
const categoryList = document.getElementById("categoryList");

let editId = null;

// ==========================================
// Load Categories
// ==========================================

async function loadCategories() {

    try {

        const response = await fetch(API);

        const categories = await response.json();

        categoryList.innerHTML = "";

        categories.forEach(category => {

    const imagePath = category.image
        ? "../" + category.image
        : "../assets/images/no-image.png";

    categoryList.innerHTML += `

    <div class="category-card">

        <img
            class="category-image"
            src="${imagePath}"
            alt="${category.name}">

                <h3>${category.name}</h3>

                <p><strong>Slug :</strong> ${category.slug}</p>

                <p>
    <strong>Position :</strong>
    ${category.sortOrder || 1}
</p>

                <p>
                    <strong>Status :</strong>
                    ${category.status ? "Active" : "Inactive"}
                </p>

                <div class="actions">

                    <button
                        class="edit-btn"
                        onclick="editCategory('${category._id}')">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteCategory('${category._id}')">

                        Delete

                    </button>

                </div>

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// ==========================================
// Add / Update Category
// ==========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

   const category = {

    name: document.getElementById("name").value,

    slug: document.getElementById("slug").value,

    image: document.getElementById("image").value,

    sortOrder: Number(
        document.getElementById("sortOrder").value
    ),

    status: true

};

    try {

        if (editId === null) {

            await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(category)

            });

            alert("✅ Category Added");

        } else {

            await fetch(`${API}/${editId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(category)

            });

            alert("✅ Category Updated");

            editId = null;

        }

        form.reset();

        loadCategories();

    } catch (error) {

        console.error(error);

    }

});

// ==========================================
// Edit Category
// ==========================================

async function editCategory(id) {

    const response = await fetch(API);

    const categories = await response.json();

    const category = categories.find(c => c._id === id);

    if (!category) return;

    editId = id;

    document.getElementById("name").value = category.name;

    document.getElementById("slug").value = category.slug;

    document.getElementById("image").value = category.image;

    document.getElementById("sortOrder").value =
    category.sortOrder || 1;

}

// ==========================================
// Delete Category
// ==========================================

async function deleteCategory(id) {

    const ok = confirm("Delete this category?");

    if (!ok) return;

    await fetch(`${API}/${id}`, {

        method: "DELETE"

    });

    alert("🗑 Category Deleted");

    loadCategories();

}

// ==========================================
// Start
// ==========================================

loadCategories();