// ==========================================
// OryMart Home Categories - Fast
// ==========================================

async function loadHomeCategories() {

    const grid =
        document.getElementById("category-grid");

    if (!grid) return;


    const CACHE_KEY =
        "orymart_categories_cache";


    // ======================================
    // Render Categories
    // ======================================

    function renderCategories(categories) {

        if (!categories.length) return;


        grid.innerHTML =
            categories.map(category => {

                return `
                    <a
                        href="category-products.html?category=${category.slug}"
                        class="category-card">

                        <img
                            src="${category.image}"
                            alt="${category.name}"
                            loading="lazy"
                            decoding="async">

                        <span>
                            ${category.name}
                        </span>

                    </a>
                `;

            }).join("");

    }


    // ======================================
    // 1. Cache - Immediately
    // ======================================

    try {

        const cached =
            localStorage.getItem(CACHE_KEY);


        if (cached) {

            const data =
                JSON.parse(cached);


            if (
                data.categories &&
                Array.isArray(data.categories) &&
                data.categories.length
            ) {

                renderCategories(
                    data.categories
                );


                console.log(
                    "⚡ Categories loaded from cache"
                );

            }

        }

    } catch (error) {

        console.warn(
            "Category cache error:",
            error
        );

    }


    // ======================================
    // 2. API - Background Update
    // ======================================

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

            throw new Error(
                "Failed to load categories"
            );

        }


        const categories =
            await response.json();


        const activeCategories =
            categories.filter(
                category => category.status
            );


        if (!activeCategories.length) return;


        // ==================================
        // Save Cache
        // ==================================

        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({

                categories:
                    activeCategories,

                savedAt:
                    Date.now()

            })
        );


        // ==================================
        // Update Screen
        // ==================================

        renderCategories(
            activeCategories
        );


        console.log(
            "✅ Fresh categories loaded"
        );


    } catch (error) {

        console.warn(
            "Categories API unavailable:",
            error.message
        );

    }

}


// ==========================================
// Start
// ==========================================

loadHomeCategories();