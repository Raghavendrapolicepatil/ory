/* ==========================================
   DOM ELEMENTS
========================================== */

const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const previewContainer = document.getElementById("previewContainer");

const summaryFiles = document.getElementById("summaryFiles");
const summaryPages = document.getElementById("summaryPages");
const summaryPaper = document.getElementById("summaryPaper");
const summarySide = document.getElementById("summarySide");
const summaryType = document.getElementById("summaryType");

const totalPrice = document.getElementById("totalPrice");
const bottomTotalPrice = document.getElementById("bottomTotalPrice");

const copyCount = document.getElementById("copyCount");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");

const addToCartBtn = document.getElementById("addToCartBtn");

/* ==========================================
   DATA
========================================== */

let uploadedFiles = [];
let totalPages = 0;
let copies = 1;

/* ==========================================
   PRICE
========================================== */

const PRICE = {

    bw: 3,
    colour: 10

};

/* ==========================================
   UPLOAD FILES TO SERVER
========================================== */

async function uploadPrintFiles(files) {

    const formData = new FormData();

    files.forEach(file => {

        formData.append("files", file);

    });

    try {

        const response = await fetch(
            "https://snackible-backend.onrender.com/api/print-upload",
            {

                method: "POST",

                body: formData

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Upload failed.");

        }

        return data.files;

    }

    catch (error) {

        console.error(error);

        alert(error.message);

        return null;

    }

}

/* ==========================================
   FILE UPLOAD
========================================== */

fileInput.addEventListener("change", async (e) => {

    const files = Array.from(e.target.files);

    if (files.length === 0) {

        return;

    }

    const validFiles = files.filter(validateFile);

    if (validFiles.length === 0) {

        return;

    }

    const uploaded = await uploadPrintFiles(validFiles);

    if (!uploaded) {

        return;

    }

    uploadedFiles.push(

        ...validFiles.map((file, index) => ({

            file,

            server: uploaded[index]

        }))

    );

    renderFileList();

    loadPreview();

});

/* ==========================================
   VALIDATION
========================================== */

function validateFile(file){

    const allowed = [

        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp"

    ];

    if(!allowed.includes(file.type)){

        alert(file.name + " is not supported.");

        return false;

    }

    return true;

}
/* ==========================================
   FILE LIST
========================================== */

function renderFileList() {

    if (uploadedFiles.length === 0) {

        fileList.innerHTML = `
            <div class="empty-state">
                <i class="ri-folder-open-line"></i>
                <h4>No files selected</h4>
                <p>Upload PDF or Images to continue.</p>
            </div>
        `;

        totalPages = 0;
        updateSummary();
        return;
    }

    fileList.innerHTML = "";

    uploadedFiles.forEach((file, index) => {

        const item = document.createElement("div");
        item.className = "file-item";

        item.innerHTML = `

            <i class="${getFileIcon(file)}"></i>

            <div class="file-details">

                <h4>${file.file.name}</h4>

<p>${formatFileSize(file.file.size)}</p>

            </div>

            <button class="remove-file" onclick="removeFile(${index})">

                <i class="ri-delete-bin-line"></i>

            </button>

        `;

        fileList.appendChild(item);

    });

    calculatePages();

}

/* ==========================================
   REMOVE FILE
========================================== */

function removeFile(index) {

    uploadedFiles.splice(index, 1);

    renderFileList();
    loadPreview();

}

/* ==========================================
   FILE ICON
========================================== */

function getFileIcon(file) {

    if (file.type === "application/pdf") {

        return "ri-file-pdf-line";

    }

    return "ri-image-line";

}

/* ==========================================
   FILE SIZE
========================================== */

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (bytes / 1024).toFixed(1) + " KB";

    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}

/* ==========================================
   PAGE CALCULATION
========================================== */

async function calculatePages() {

    totalPages = 0;

    for (const item of uploadedFiles) {

    const file = item.file;

        if (file.type === "application/pdf") {

            const buffer = await file.arrayBuffer();

            const pdf = await pdfjsLib.getDocument({

                data: buffer

            }).promise;

            totalPages += pdf.numPages;

        } else {

            // One image = One page
            totalPages++;

        }

    }

    updateSummary();

}
/* ==========================================
   PREVIEW
========================================== */

async function loadPreview() {

    if (uploadedFiles.length === 0) {

        previewContainer.innerHTML = `
            <div class="preview-placeholder">
                <i class="ri-file-search-line"></i>
                <h4>No Preview</h4>
                <p>Upload a PDF or Image</p>
            </div>
        `;

        return;

    }

    const file = uploadedFiles[0].file;

    if (file.type === "application/pdf") {

        await showPdfPreview(file);

    } else {

        showImagePreview(file);

    }

}

/* ==========================================
   PDF PREVIEW
========================================== */

async function showPdfPreview(file) {

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({

        data: buffer

    }).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({

        scale: 1.2

    });

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({

        canvasContext: ctx,
        viewport

    }).promise;

    previewContainer.innerHTML = "";
    previewContainer.appendChild(canvas);

}

/* ==========================================
   IMAGE PREVIEW
========================================== */

function showImagePreview(file) {

    const reader = new FileReader();

    reader.onload = function (e) {

        previewContainer.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
        `;

    };

    reader.readAsDataURL(file);

}

/* ==========================================
   COPIES
========================================== */

plusBtn.addEventListener("click", () => {

    copies++;

    copyCount.textContent = copies;

    updateSummary();

});

minusBtn.addEventListener("click", () => {

    if (copies > 1) {

        copies--;

        copyCount.textContent = copies;

        updateSummary();

    }

});

/* ==========================================
   SUMMARY + PRICE
========================================== */

function updateSummary() {

    summaryFiles.textContent = uploadedFiles.length;
    summaryPages.textContent = totalPages;
    summaryPaper.textContent = "A4";

    const side =
        document.querySelector('input[name="side"]:checked');

    const type =
        document.querySelector('input[name="printType"]:checked');

    const sideValue = side ? side.value : "Single Side";
    const typeValue = type ? type.value : "bw";

    summarySide.textContent = sideValue;
    summaryType.textContent =
        typeValue === "colour"
            ? "Colour"
            : "Black & White";

    let pages = totalPages * copies;

    let rate =
        typeValue === "colour"
            ? PRICE.colour
            : PRICE.bw;

    const amount = pages * rate;

    totalPrice.textContent = `₹${amount}`;
    bottomTotalPrice.textContent = `₹${amount}`;

}
/* ==========================================
   OPTION CHANGE LISTENERS
========================================== */

document
    .querySelectorAll('input[name="printType"], input[name="side"]')
    .forEach(input => {

        input.addEventListener("change", () => {

            updateSummary();

        });

    });

/* ==========================================
   SHEET CALCULATION
========================================== */

function calculateSheets() {

    const side =
        document.querySelector('input[name="side"]:checked');

    const sideValue = side ? side.value : "Single Side";

    if (sideValue === "Front & Back") {

        return Math.ceil(totalPages / 2) * copies;

    }

    return totalPages * copies;

}

/* ==========================================
   PRICE CALCULATION
========================================== */

function calculateTotalPrice() {

    const type =
        document.querySelector('input[name="printType"]:checked');

    const typeValue = type ? type.value : "bw";

    const rate =
        typeValue === "colour"
            ? PRICE.colour
            : PRICE.bw;

    return calculateSheets() * rate;

}

/* ==========================================
   UPDATE PRICE
========================================== */

function refreshPrice() {

    const amount = calculateTotalPrice();

    totalPrice.textContent = `₹${amount}`;
    bottomTotalPrice.textContent = `₹${amount}`;

}

/* ==========================================
   UPDATE SUMMARY
========================================== */

const oldUpdateSummary = updateSummary;

updateSummary = function () {

    oldUpdateSummary();

    const sheets = calculateSheets();

    summaryPages.textContent =
        `${totalPages} Pages (${sheets} Sheets)`;

    refreshPrice();

};

/* ==========================================
   IMAGE PAIR PLACEHOLDER
========================================== */

/*
Future Version

Example

Image1 + Image2 = 1 Sheet
Image3          = 1 Sheet
Image4          = 1 Sheet

Total = 3 Sheets

A custom pairing UI will generate
the sheet count instead of automatic
Front & Back calculation.

Current version uses automatic calculation.
*/
/* ==========================================
   ADD TO CART
========================================== */

addToCartBtn.addEventListener("click", addToCart);

function addToCart() {

    if (uploadedFiles.length === 0) {

        alert("Please upload at least one file.");
        return;

    }

    const printType =
        document.querySelector('input[name="printType"]:checked')?.value || "bw";

    const side =
        document.querySelector('input[name="side"]:checked')?.value || "Single Side";

    const order = {

        id: Date.now(),

        files: uploadedFiles.map(item => ({

    name: item.file.name,
    size: item.file.size,
    type: item.file.type,

    url: item.server.url,
    fileName: item.server.fileName

})),

        totalFiles: uploadedFiles.length,

        totalPages: totalPages,

        totalSheets: calculateSheets(),

        copies: copies,

        paper: "A4",

        printType: printType,

        side: side,

        totalPrice: calculateTotalPrice(),

        createdAt: new Date().toISOString()

    };

    const cart =
        JSON.parse(localStorage.getItem("printCart")) || [];

    cart.push(order);

    localStorage.setItem(
        "printCart",
        JSON.stringify(cart)
    );

    alert("✅ Print order added to cart.");

}

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderFileList();

    loadPreview();

    copyCount.textContent = copies;

    updateSummary();

});

/* ==========================================
   OPTIONAL RESET
========================================== */

function resetPrintForm() {

    uploadedFiles = [];
    totalPages = 0;
    copies = 1;

    fileInput.value = "";

    copyCount.textContent = copies;

    renderFileList();

    loadPreview();

    updateSummary();

}

/* ==========================================
   FUTURE FEATURES
========================================== */

/*

Upcoming Features

✔ Drag & Drop Upload
✔ Multiple PDF Preview
✔ Page Selection
✔ Custom Image Pairing
✔ Print Orientation
✔ Paper Size (A3/A4/A5)
✔ Lamination
✔ Spiral Binding
✔ Document Naming
✔ Quantity per File
✔ Delivery Date
✔ Coupon Code
✔ Print Instructions

*/