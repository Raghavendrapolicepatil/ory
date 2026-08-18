// ==========================================
// Orymart Banner Management
// ==========================================

const API = "https://snackible-backend.onrender.com/api/banners";

const form = document.getElementById("bannerForm");
const bannerList = document.getElementById("bannerList");


let editId = null;

// ==========================================
// Load Banners
// ==========================================

async function loadBanners() {

    try {

        const response = await fetch(API);

        const banners = await response.json();

        bannerList.innerHTML = "";

        if (banners.length === 0) {

            bannerList.innerHTML = "<p>No Banners Found</p>";

            return;

        }

        banners.forEach(banner => {

    const imagePath = banner.image.startsWith("assets/")
        ? "../" + banner.image
        : banner.image;

    bannerList.innerHTML += `

    <div class="banner-card">

        <img
            class="banner-image"
            src="${imagePath}"
            alt="${banner.title}">

                <div class="banner-content">

                    <h3>${banner.title}</h3>

                    <p>${banner.subtitle || ""}</p>

                    <p>

                        <strong>Order :</strong>

                        ${banner.order}

                    </p>

                    <p>

                        <strong>Status :</strong>

                        ${banner.status ? "Active" : "Inactive"}

                    </p>

                    <div class="banner-actions">

                        <button
                            class="edit-btn"
                            onclick="editBanner('${banner._id}')">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteBanner('${banner._id}')">

                            Delete

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ==========================================
// Add / Update Banner
// ==========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const banner = {

        title: document.getElementById("title").value,

        subtitle: document.getElementById("subtitle").value,

        image: document.getElementById("image").value,

        link: document.getElementById("link").value,

        order: Number(document.getElementById("order").value),

        status: true

    };

    try {

        if (editId === null) {

            await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(banner)

            });

            alert("✅ Banner Added");

        }

        else {

            await fetch(`${API}/${editId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(banner)

            });

            alert("✅ Banner Updated");

            editId = null;

        }

        form.reset();

        loadBanners();

    }

    catch (error) {

        console.log(error);

    }

});

// ==========================================
// Edit Banner
// ==========================================

async function editBanner(id) {

    const response = await fetch(API);

    const banners = await response.json();

    const banner = banners.find(b => b._id === id);

    if (!banner) return;

    editId = id;

    document.getElementById("title").value = banner.title;

    document.getElementById("subtitle").value = banner.subtitle;

    document.getElementById("image").value = banner.image;

    document.getElementById("link").value = banner.link;

    document.getElementById("order").value = banner.order;

}

// ==========================================
// Delete Banner
// ==========================================

async function deleteBanner(id) {

    const ok = confirm("Delete this banner?");

    if (!ok) return;

    await fetch(`${API}/${id}`, {

        method: "DELETE"

    });

    alert("🗑 Banner Deleted");

    loadBanners();

}

// ==========================================
// Start
// ==========================================

loadBanners();