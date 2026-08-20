// ======================================
// Home Categories - Optimized
// ======================================

async function loadHomeCategories() {

    const grid =
        document.getElementById("category-grid");

    if (!grid) return;

    try {

        const controller =
            new AbortController();

        const timeout =
            setTimeout(() => {
                controller.abort();
            }, 5000);

        const response =
            await fetch(
                "https://snackible-backend.onrender.com/api/categories",
                {
                    signal: controller.signal,
                    cache: "no-store"
                }
            );

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error("Failed to load categories");
        }

        const categories =
            await response.json();

        const activeCategories =
            categories.filter(
                category => category.status
            );

        const html =
            activeCategories.map(category => {

                return `
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
                `;

            }).join("");

        grid.innerHTML = html;

    } catch (error) {

        console.warn(
            "Categories API unavailable:",
            error.message
        );

    }
}

loadHomeCategories();