// ==========================================
// PDF.js Worker
// ==========================================

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.js";

// ==========================================
// Elements
// ==========================================

const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const pageCount = document.getElementById("pageCount");
const fileInfo = document.getElementById("fileInfo");
const previewContainer = document.getElementById("previewContainer");

const qtyText = document.getElementById("copyCount");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");

const totalPrice = document.getElementById("totalPrice");
const addToCartBtn = document.getElementById("addToCartBtn");

const typeRadios = document.querySelectorAll("input[name='type']");
const sideRadios = document.querySelectorAll("input[name='side']");

// ==========================================
// Variables
// ==========================================

let copies = 1;
let pages = 0;

const BW_PRICE = 5;
const COLOR_PRICE = 15;

// ==========================================
// File Upload
// ==========================================

fileInput.addEventListener("change", async () => {

    const file = fileInput.files[0];

    if (!file) return;

    fileInfo.style.display = "block";

    fileName.textContent = file.name;

    previewContainer.innerHTML = "";

    // PDF
    if (file.type === "application/pdf") {

        const buffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
            data: buffer
        }).promise;

        pages = pdf.numPages;

    }

    // Image
    else {

        pages = 1;

        const img = document.createElement("img");

        img.src = URL.createObjectURL(file);

        img.style.width = "100%";
        img.style.maxWidth = "250px";
        img.style.borderRadius = "12px";
        img.style.marginTop = "15px";

        previewContainer.appendChild(img);

    }

    pageCount.textContent = `Pages : ${pages}`;

    updatePrice();

});

// ==========================================
// Price Calculation
// ==========================================

function updatePrice() {

    const colour =
        document.querySelector("input[name='type']:checked").value === "colour";

    const doubleSide =
        document.querySelector("input[name='side']:checked").value === "double";

    let rate = colour ? COLOR_PRICE : BW_PRICE;

    let total = pages * copies * rate;

    if (doubleSide) {

        total = Math.ceil(total * 0.9);

    }

    totalPrice.textContent = `₹${total}`;

}

// ==========================================
// Quantity
// ==========================================

plusBtn.addEventListener("click", () => {

    copies++;

    qtyText.textContent = copies;

    updatePrice();

});

minusBtn.addEventListener("click", () => {

    if (copies <= 1) return;

    copies--;

    qtyText.textContent = copies;

    updatePrice();

});

// ==========================================
// Radio Change
// ==========================================

typeRadios.forEach(radio => {

    radio.addEventListener("change", updatePrice);

});

sideRadios.forEach(radio => {

    radio.addEventListener("change", updatePrice);

});

// ==========================================
// Add To Cart
// ==========================================

addToCartBtn.addEventListener("click", () => {

    if (!fileInput.files.length) {

        alert("Please upload a document first.");

        return;

    }

    alert(
`Added Successfully

📄 ${fileName.textContent}

Pages : ${pages}

Copies : ${copies}

Total : ${totalPrice.textContent}`
    );

});

// ==========================================
// Initial
// ==========================================

updatePrice();