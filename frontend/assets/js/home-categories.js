// ======================================
// Home Categories
// ======================================

async function loadHomeCategories() {

    try {

        const response = await fetch("https://snackible-backend.onrender.com/api/categories");

        const categories = await response.json();

        const grid = document.getElementById("category-grid");

        grid.innerHTML = "";

        categories.forEach(category => {

            if (!category.status) return;

            grid.innerHTML += `

            <a href="category-products.html?category=${category.slug}" class="category-card">

                <img
                    src="${category.image}"
                    alt="${category.name}">

                <span>${category.name}</span>

            </a>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

loadHomeCategories();