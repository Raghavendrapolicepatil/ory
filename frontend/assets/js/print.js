/*==================================
        DOM Elements
==================================*/

const fileInput = document.getElementById("fileInput");
const uploadedFilesList = document.getElementById("uploadedFilesList");
const fileCount = document.getElementById("fileCount");
const previewBox = document.getElementById("previewBox");


/*==================================
        Variables
==================================*/

let uploadedFiles = [];
let selectedFileIndex = -1;


/*==================================
        Upload Files
==================================*/

fileInput.addEventListener("change", (e) => {

    const files = [...e.target.files];

    files.forEach(file => {

        uploadedFiles.push({
            file: file,
            currentPage: 1
        });

    });

    renderUploadedFiles();

});


/*==================================
        Render Uploaded Files
==================================*/

function renderUploadedFiles() {

    uploadedFilesList.innerHTML = "";

    fileCount.textContent = `${uploadedFiles.length} Files`;

    uploadedFiles.forEach((item, index) => {

        const isPdf = item.file.type === "application/pdf";

        const fileCard = document.createElement("div");

        fileCard.className =
            `uploaded-file ${index === selectedFileIndex ? "active" : ""}`;

        fileCard.innerHTML = `

            <div class="file-left">

                <div class="file-icon">

                    <i class="fa-regular ${
                        isPdf
                        ? "fa-file-pdf"
                        : "fa-file-image"
                    }"></i>

                </div>

                <div class="file-info">

                    <h4>${item.file.name}</h4>

                    <p>${formatFileSize(item.file.size)}</p>

                </div>

            </div>

            <div class="file-right">

                <button
                    class="file-action delete-btn"
                    data-index="${index}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

        fileCard.addEventListener("click", () => {

            selectedFileIndex = index;

            renderUploadedFiles();

            loadPreview();

        });

        uploadedFilesList.appendChild(fileCard);

    });

}


/*==================================
        Delete File
==================================*/

uploadedFilesList.addEventListener("click", (e) => {

    const btn = e.target.closest(".delete-btn");

    if(!btn) return;

    e.stopPropagation();

    const index = Number(btn.dataset.index);

    uploadedFiles.splice(index,1);

    if(selectedFileIndex >= uploadedFiles.length){

        selectedFileIndex = uploadedFiles.length - 1;

    }

    renderUploadedFiles();

    loadPreview();

});


/*==================================
        File Size
==================================*/

function formatFileSize(bytes){

    if(bytes < 1024){

        return bytes + " B";

    }

    if(bytes < 1024 * 1024){

        return (bytes/1024).toFixed(1) + " KB";

    }

    return (bytes/(1024*1024)).toFixed(1) + " MB";

}


/*==================================
        Preview Placeholder
==================================*/

function loadPreview(){

    previewBox.innerHTML = `

        <div class="empty-preview">

            <i class="fa-regular fa-file-lines"></i>

            <p>Preview Coming...</p>

        </div>

    `;

}
/*==================================
        Preview Variables
==================================*/

let currentPage = 1;
let totalPages = 1;


/*==================================
        Load Preview
==================================*/

async function loadPreview() {

    if (selectedFileIndex === -1) {

        previewBox.innerHTML = `
            <div class="empty-preview">
                <i class="fa-regular fa-file-lines"></i>
                <p>Select a file to preview</p>
            </div>
        `;

        return;
    }

    const file = uploadedFiles[selectedFileIndex].file;

    if (file.type === "application/pdf") {

        showPdfPreview(file);

    } else {

        showImagePreview(file);

    }

}


/*==================================
        Image Preview
==================================*/

function showImagePreview(file) {

    totalPages = 1;
    currentPage = 1;

    pageIndicator.textContent = "Image";

    const url = URL.createObjectURL(file);

    previewBox.innerHTML = `
        <img
            id="previewImage"
            src="${url}"
            alt="Preview"
            class="preview-image">
    `;

}


/*==================================
        PDF Preview
==================================*/

async function showPdfPreview(file) {

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: buffer
    }).promise;

    totalPages = pdf.numPages;

    renderPdfPage(pdf, currentPage);

}


/*==================================
        Render PDF Page
==================================*/

async function renderPdfPage(pdf, pageNo) {

    const page = await pdf.getPage(pageNo);

    const viewport = page.getViewport({
        scale: 1.5
    });

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: ctx,
        viewport
    }).promise;

    previewBox.innerHTML = "";

    previewBox.appendChild(canvas);

    pageIndicator.textContent =
        `Page ${pageNo} / ${totalPages}`;

}


/*==================================
        Previous Page
==================================*/

prevPage.addEventListener("click", async () => {

    if (selectedFileIndex === -1) return;

    const file = uploadedFiles[selectedFileIndex].file;

    if (file.type !== "application/pdf") return;

    if (currentPage <= 1) return;

    currentPage--;

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: buffer
    }).promise;

    renderPdfPage(pdf, currentPage);

});


/*==================================
        Next Page
==================================*/

nextPage.addEventListener("click", async () => {

    if (selectedFileIndex === -1) return;

    const file = uploadedFiles[selectedFileIndex].file;

    if (file.type !== "application/pdf") return;

    if (currentPage >= totalPages) return;

    currentPage++;

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: buffer
    }).promise;

    renderPdfPage(pdf, currentPage);

});
/*==================================
        DOM Elements
==================================*/

const paperButtons = document.querySelectorAll("#paperSize .chip");
const printTypeButtons = document.querySelectorAll("#printType .chip");
const printSideButtons = document.querySelectorAll("#printSide .chip");

const minusCopy = document.getElementById("minusCopy");
const plusCopy = document.getElementById("plusCopy");
const copiesCount = document.getElementById("copiesCount");


/*==================================
        Print Settings
==================================*/

let paperSize = "A4";
let printType = "bw";
let printSide = "single";
let copies = 1;


/*==================================
        Active Chip
==================================*/

function setActive(buttons, clickedButton){

    buttons.forEach(btn=>btn.classList.remove("active"));

    clickedButton.classList.add("active");

}


/*==================================
        Paper Size
==================================*/

paperButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        setActive(paperButtons,button);

        paperSize = button.textContent.trim();

        updatePrice();

    });

});


/*==================================
        Print Type
==================================*/

printTypeButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        setActive(printTypeButtons,button);

        printType = button.textContent.trim().toLowerCase();

        updatePreviewColor();

        updatePrice();

    });

});


/*==================================
        Print Side
==================================*/

printSideButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        setActive(printSideButtons,button);

        printSide = button.textContent.trim();

        updatePrice();

    });

});


/*==================================
        Copies
==================================*/

minusCopy.addEventListener("click",()=>{

    if(copies===1) return;

    copies--;

    copiesCount.textContent = copies;

    updatePrice();

});


plusCopy.addEventListener("click",()=>{

    copies++;

    copiesCount.textContent = copies;

    updatePrice();

});


/*==================================
        Preview B&W / Colour
==================================*/

function updatePreviewColor(){

    const img = previewBox.querySelector("img");
    const canvas = previewBox.querySelector("canvas");

    const isBW =
        printType.includes("b");

    if(img){

        img.style.filter =
            isBW
            ? "grayscale(100%)"
            : "none";

    }

    if(canvas){

        canvas.style.filter =
            isBW
            ? "grayscale(100%)"
            : "none";

    }

}
/*==================================
        Bottom Elements
==================================*/

const bottomPages = document.getElementById("bottomPages");
const bottomSheets = document.getElementById("bottomSheets");
const bottomPrice = document.getElementById("bottomPrice");
const addToCartBtn = document.getElementById("addToCartBtn");


/*==================================
        Price Settings
==================================*/

const PRICE = {
    bw: 3,
    colour: 10
};


/*==================================
        Update Price
==================================*/

function updatePrice(){

    if(selectedFileIndex === -1){

        bottomPages.textContent = "0 Pages";
        bottomSheets.textContent = "0 Sheets";
        bottomPrice.textContent = "₹0";

        return;
    }

    const item = uploadedFiles[selectedFileIndex];

    const pages = item.pages || 1;

    const totalPages = pages * copies;

    const totalSheets =
        printSide.toLowerCase().includes("front")
        ? Math.ceil(totalPages / 2)
        : totalPages;

    const rate =
        printType.includes("colour")
        ? PRICE.colour
        : PRICE.bw;

    const totalPrice = totalPages * rate;

    bottomPages.textContent =
        `${totalPages} Pages`;

    bottomSheets.textContent =
        `${totalSheets} Sheets`;

    bottomPrice.textContent =
        `₹${totalPrice}`;

}


/*==================================
        Add To Cart
==================================*/

addToCartBtn.addEventListener("click",()=>{

    if(selectedFileIndex === -1){

        alert("Please select a file.");

        return;

    }

    const item = uploadedFiles[selectedFileIndex];

    const cart = JSON.parse(
        localStorage.getItem("printCart")
    ) || [];

    cart.push({

        name:item.file.name,

        pages:item.pages || 1,

        copies:copies,

        paperSize:paperSize,

        printType:printType,

        printSide:printSide,

        price:bottomPrice.textContent

    });

    localStorage.setItem(
        "printCart",
        JSON.stringify(cart)
    );

    alert("Added to Cart Successfully");

});


/*==================================
        First Load
==================================*/

updatePrice();