// ======================================
// Snackible Premium Search
// ======================================

const searchInput = document.getElementById("search-input");
const resultsBox = document.getElementById("search-results");
const recentBox = document.getElementById("recent-searches");
const recentList = document.getElementById("recent-list");
const noResults = document.getElementById("no-results");
const clearBtn = document.getElementById("clear-btn");
const micBtn = document.getElementById("mic-btn");

let products = [];

// ======================================
// Load Products
// ======================================

async function loadProducts(){

    try{

        const response =
        await fetch("https://snackible-backend.onrender.com/api/products");

        products =
        await response.json();

    }

    catch(err){

        console.error(err);

    }

}

// ======================================
// Search
// ======================================
if (searchInput) {
    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value.trim().toLowerCase();

        if (keyword === "") {

            resultsBox.innerHTML = "";

            if (noResults) noResults.style.display = "none";

            loadRecent();

            return;
        }

        if (recentBox) recentBox.style.display = "none";

        const filtered = products.filter(product => {

            const name = (product.name || "").toLowerCase();

            return name.includes(keyword);

        });

        renderResults(filtered);

    });
}

// ======================================
// Render Results
// ======================================

function renderResults(items){

    resultsBox.innerHTML = "";

    if(items.length === 0){

        noResults.style.display = "block";

        return;

    }

    noResults.style.display = "none";

    items.forEach(product=>{

        resultsBox.insertAdjacentHTML(

            "beforeend",

            `

<div class="search-item"
     onclick="openProduct(${product.id})">

    <img
        src="${product.image}"
        alt="${product.name}">

    <div class="search-info">

        <h4>${product.name}</h4>

    </div>

</div>

`

        );

    });

}

// ======================================
// Product Page
// ======================================

function openProduct(id){

    saveRecent();

    window.location =
    "product-details.html?id="+id;

}

// ======================================
// Add Product
// ======================================

function addSearchProduct(id,name,price,image){

    addToCart(id,name,price,image);

}

// ======================================
// Recent Search
// ======================================

function saveRecent(){

    const value =
    searchInput.value.trim();

    if(!value) return;

    let recent =

    JSON.parse(

        localStorage.getItem("recentSearch")

    ) || [];

    recent = recent.filter(item=>item!==value);

    recent.unshift(value);

    recent = recent.slice(0,8);

    localStorage.setItem(

        "recentSearch",

        JSON.stringify(recent)

    );

}

// ======================================
// Load Recent
// ======================================

function loadRecent(){

    recentBox.style.display="block";

    recentList.innerHTML="";

    const recent =

    JSON.parse(

        localStorage.getItem("recentSearch")

    ) || [];

    recent.forEach(item=>{

        recentList.innerHTML +=

        `

<div

class="recent-item"

onclick="searchRecent('${item}')">

${item}

</div>

`;

    });

}

// ======================================
// Search Recent
// ======================================

function searchRecent(text){

    searchInput.value=text;

    searchInput.dispatchEvent(

        new Event("input")

    );

}

// ======================================
// Clear
// ======================================

if (clearBtn) {
    clearBtn.onclick = () => {

        if (searchInput) {
            searchInput.value = "";
            searchInput.focus();
        }

        if (resultsBox) {
            resultsBox.innerHTML = "";
        }

        if (noResults) {
            noResults.style.display = "none";
        }

        loadRecent();
    };
}

// ======================================
// Voice Search
// ======================================

if("webkitSpeechRecognition" in window){

    const recognition =
    new webkitSpeechRecognition();

    recognition.lang="en-IN";

    micBtn.onclick=()=>{

        recognition.start();

    };

    recognition.onresult=(e)=>{

        searchInput.value=

        e.results[0][0].transcript;

        searchInput.dispatchEvent(

            new Event("input")

        );

    };

}

// ======================================
// Start
// ======================================

loadProducts();

loadRecent();