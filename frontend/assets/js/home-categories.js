// ======================================
// Home Categories
// ======================================

async function loadHomeCategories() {

    const grid = document.getElementById("category-grid");

    if (!grid) return;

    try {

        const response = await fetch(
            "https://snackible-backend.onrender.com/api/categories"
        );

        if (!response.ok) {
            throw new Error("Failed to load categories");
        }

        const categories = await response.json();

        const html = categories
            .filter(category => category.status)
            .map(category => `
                <a
                    href="category-products.html?category=${category.slug}"
                    class="category-card">

                    <img
                        src="${category.image}"
                        alt="${category.name}"
                        loading="lazy"
                        decoding="async">

                    <span>${category.name}</span>

                </a>
            `)
            .join("");

        grid.innerHTML = html;

    } catch (error) {

        console.error("Categories loading error:", error);

        grid.innerHTML = `
            <p class="category-error">
                Categories could not be loaded.
            </p>
        `;
    }
}

loadHomeCategories();