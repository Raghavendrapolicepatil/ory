/*====================================================
            PRINT APPLICATION
            Part 1 - Core Setup
====================================================*/
pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.js";

/*====================================================
                    DOM ELEMENTS
====================================================*/

const DOM = {

    // Upload
    fileInput: document.getElementById("fileInput"),

    // Preview
    previewBox: document.getElementById("previewBox"),
    prevPageBtn: document.getElementById("prevPage"),
    nextPageBtn: document.getElementById("nextPage"),
    pageIndicator: document.getElementById("pageIndicator"),

    // Uploaded Files
    uploadedFilesList: document.getElementById("uploadedFilesList"),
    fileCount: document.getElementById("fileCount"),

    // Paper Size
    paperButtons: document.querySelectorAll(
        "#paperSize .chip"
    ),

    // Print Type
    printTypeButtons: document.querySelectorAll(
        "#printType .chip"
    ),

    // Print Side
    printSideButtons: document.querySelectorAll(
        "#printSide .chip"
    ),

    // Copies
    decreaseCopies: document.getElementById("decreaseCopies"),
    increaseCopies: document.getElementById("increaseCopies"),
    copiesCount: document.getElementById("copiesCount"),

    // Bottom Bar
    bottomPages: document.getElementById("bottomPages"),
    bottomSheets: document.getElementById("bottomSheets"),
    bottomPrice: document.getElementById("bottomPrice"),

    addToCartBtn: document.getElementById("addToCartBtn")

};



/* ==========================================
            IndexedDB
========================================== */

let db;

const request = indexedDB.open("PatilPrintDB", 1);

request.onupgradeneeded = function (event) {

    db = event.target.result;

    if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
    }

};

request.onsuccess = function (event) {

    db = event.target.result;

    loadSavedFiles();

};

request.onerror = function () {

    console.log("IndexedDB Error");

};

/*====================================================
                    APPLICATION STATE
====================================================*/

const App = {

    files: [],

    selectedFileId: null,

    currentPdf: null,

    isLoading: false

};



/*====================================================
                    PRICE CONFIG
====================================================*/

const PRICE = {

    A4: {

        bw: 2,

        colour: 10

    },

    A3: {

        bw: 5,

        colour: 20

    },

    A5: {

        bw: 1,

        colour: 5

    }

};



/*====================================================
                DEFAULT SETTINGS
====================================================*/

const DEFAULT_SETTINGS = {

    paperSize: "A4",

    printType: "bw",

    printSide: "single",

    copies: 1

};



/*====================================================
                FILE OBJECT CREATOR
====================================================*/

function createFileObject(file){

    return{

        id:
            crypto.randomUUID(),

        file,

        pdf:null,

        thumbnail:null,

        pages:1,

        currentPage:1,

        settings:{
            ...DEFAULT_SETTINGS
        }

    };

}



/*====================================================
                GET SELECTED FILE
====================================================*/

function getSelectedFile(){

    return App.files.find(

        item=>item.id===App.selectedFileId

    );

}



/*====================================================
                FORMAT FILE SIZE
====================================================*/

function formatFileSize(bytes){

    if(bytes<1024){

        return bytes+" B";

    }

    if(bytes<1024*1024){

        return(
            bytes/1024
        ).toFixed(1)+" KB";

    }

    return(
        bytes/1024/1024
    ).toFixed(2)+" MB";

}



/*====================================================
                    RESET PREVIEW
====================================================*/

function resetPreview(){

    DOM.previewBox.innerHTML=`

        <div class="empty-preview">

            <i class="fa-regular fa-file-lines"></i>

            <p>Select a file to preview</p>

        </div>

    `;

    DOM.pageIndicator.textContent="Page 0 / 0";

}



/*====================================================
                    UPDATE FILE COUNT
====================================================*/

function updateFileCount(){

    const total=App.files.length;

    DOM.fileCount.textContent=

        total===1

        ? "1 File"

        : `${total} Files`;

}



/*====================================================
                    INITIALIZATION
====================================================*/

function init(){

    resetPreview();

    updateFileCount();

}

init();
/*====================================================
                FILE UPLOAD
====================================================*/

DOM.fileInput.addEventListener("change", handleFileUpload);

async function handleFileUpload(e) {

    const files = [...e.target.files];

    if (!files.length) return;

    for (const file of files) {

        const exists = App.files.some(item =>
            item.file.name === file.name &&
            item.file.size === file.size &&
            item.file.lastModified === file.lastModified
        );

        if (exists) continue;

        const fileObject = createFileObject(file);

        if (file.type === "application/pdf") {

            await preparePDF(fileObject);

        } else {

            await prepareImage(fileObject);

        }

        App.files.push(fileObject);
        saveFile(fileObject);
    }

    renderUploadedFiles();

    updateFileCount();

    

    if (!App.selectedFileId && App.files.length) {

        selectFile(App.files[0].id);

    }

    DOM.fileInput.value = "";

    refreshPriceEngine();

}



/*====================================================
                PREPARE PDF
====================================================*/

async function preparePDF(fileObject) {

    const buffer = await fileObject.file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: buffer
    }).promise;

    fileObject.pdf = pdf;

    fileObject.pages = pdf.numPages;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({
        scale: 0.35
    });

    const canvas = document.createElement("canvas");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport
    }).promise;

    fileObject.thumbnail = canvas.toDataURL();

}



/*====================================================
                PREPARE IMAGE
====================================================*/

async function prepareImage(fileObject) {

    fileObject.pages = 1;

    fileObject.thumbnail =
        URL.createObjectURL(fileObject.file);

}



/*====================================================
                SAVE IMAGE
====================================================*/
function saveFile(fileObject) {

    const tx = db.transaction("files", "readwrite");

    const store = tx.objectStore("files");

    store.put({
        id: fileObject.id,
        data: fileObject
    });

}

function loadSavedFiles() {

    const tx = db.transaction("files", "readonly");

    const store = tx.objectStore("files");

    const request = store.getAll();

    request.onsuccess = function () {

        const result = request.result;

        if (result.length === 0) return;

        App.files = result.map(item => item.data);

        renderUploadedFiles();

        if (App.files.length > 0) {
            selectFile(App.files[0].id);
        }

    };

}
function clearSavedFiles() {

    const tx = db.transaction("files", "readwrite");

    tx.objectStore("files").clear();

}

/*====================================================
            RENDER UPLOADED FILES
====================================================*/

function renderUploadedFiles() {

    DOM.uploadedFilesList.innerHTML = "";

    App.files.forEach(file => {

        const active =
            file.id === App.selectedFileId
                ? "active"
                : "";

        const typeIcon =
            file.file.type === "application/pdf"
                ? "fa-file-pdf"
                : "fa-file-image";

        const card = document.createElement("div");

        card.className = `uploaded-file ${active}`;

        card.innerHTML = `

<div class="file-left">

    <img
        class="file-thumb"
        src="${file.thumbnail}"
        alt="thumbnail">

    <div class="file-info">

        <h4>${file.file.name}</h4>

        <p>

            ${file.pages} Page${file.pages>1?"s":""}
            •
            ${formatFileSize(file.file.size)}

        </p>

    </div>

</div>

<div class="file-actions">

    <button
        class="delete-file"
        data-id="${file.id}">

        <i class="fa-solid fa-trash"></i>

    </button>

</div>

`;

        card.querySelector(".file-left")
            .addEventListener("click", () => {

                selectFile(file.id);

            });

        card.querySelector(".delete-file")
            .addEventListener("click", e => {

                e.stopPropagation();

                deleteFile(file.id);

            });

        DOM.uploadedFilesList.appendChild(card);

    });

}



/*====================================================
                DELETE FILE
====================================================*/

function deleteFile(id) {

    const index =
        App.files.findIndex(f => f.id === id);

    if (index === -1) return;

    const file = App.files[index];

    if (file.thumbnail &&
        file.file.type !== "application/pdf") {

        URL.revokeObjectURL(file.thumbnail);

    }

    App.files.splice(index, 1);

    if (App.selectedFileId === id) {

        App.selectedFileId = null;

    }

    updateFileCount();

    renderUploadedFiles();

    if (!App.selectedFileId && App.files.length) {

        selectFile(App.files[0].id);

    }

    if (!App.files.length) {

        resetPreview();

        refreshPriceEngine();

    }

}



/*====================================================
                SELECT FILE
====================================================*/

function selectFile(id) {

    App.selectedFileId = id;

    renderUploadedFiles();

    loadSelectedFile();

    loadFileSettings();
}
/*====================================================
            LOAD SELECTED FILE
====================================================*/

async function loadSelectedFile() {

    const fileObject = getSelectedFile();

    if (!fileObject) {

        resetPreview();
        return;

    }

    App.isLoading = true;

    DOM.previewBox.innerHTML = `

        <div class="preview-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>Loading Preview...</p>

        </div>

    `;

    try {

        if (fileObject.file.type === "application/pdf") {

            await showPDFPreview(fileObject);

        } else {

            await showImagePreview(fileObject);

        }

    } catch (error) {

        console.error(error);

        DOM.previewBox.innerHTML = `

            <div class="empty-preview">

                <i class="fa-solid fa-circle-exclamation"></i>

                <p>Unable to load preview.</p>

            </div>

        `;

    }

    App.isLoading = false;

}



/*====================================================
            SHOW IMAGE PREVIEW
====================================================*/

async function showImagePreview(fileObject) {

    DOM.pageIndicator.textContent = "Page 1 / 1";

    const imageURL = URL.createObjectURL(fileObject.file);

    DOM.previewBox.innerHTML = `
        <div class="preview-paper">
            <img
                id="previewImage"
                class="preview-image"
                src="${imageURL}"
                alt="Preview">
        </div>
    `;

    const img = document.getElementById("previewImage");

    img.onload = () => {
        URL.revokeObjectURL(imageURL);
    };

    updateNavigation(fileObject);
}

/*====================================================
            SHOW PDF PREVIEW
====================================================*/

async function showPDFPreview(fileObject) {

    await renderPDFPage(

        fileObject,

        fileObject.currentPage

    );

}



/*====================================================
            CREATE A4 PAPER
====================================================*/

function createPaper() {

    DOM.previewBox.innerHTML = `

        <div class="preview-paper">

            <canvas
                id="pdfCanvas">

            </canvas>

        </div>

    `;

    return document.getElementById("pdfCanvas");

}
/*====================================================
                RENDER PDF PAGE
====================================================*/

async function renderPDFPage(fileObject, pageNumber) {

    if (!fileObject.pdf) return;

    const pdfPage = await fileObject.pdf.getPage(pageNumber);

    const paper = createPaper();

    const container = DOM.previewBox.querySelector(".preview-paper");

    const containerWidth = container.clientWidth - 30;

    const viewport = pdfPage.getViewport({ scale: 1 });

    const scale = containerWidth / viewport.width;

    const scaledViewport = pdfPage.getViewport({
        scale
    });

    const context = paper.getContext("2d");

    const devicePixelRatio = window.devicePixelRatio || 1;

    paper.width = scaledViewport.width * devicePixelRatio;
    paper.height = scaledViewport.height * devicePixelRatio;

    paper.style.width = scaledViewport.width + "px";
    paper.style.height = scaledViewport.height + "px";

    context.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );

    context.clearRect(
        0,
        0,
        paper.width,
        paper.height
    );

    await pdfPage.render({

        canvasContext: context,

        viewport: scaledViewport

    }).promise;

    fileObject.currentPage = pageNumber;

    DOM.pageIndicator.textContent =
        `Page ${pageNumber} / ${fileObject.pages}`;

updateNavigation(fileObject);

}
/*====================================================
                PREVIOUS PAGE
====================================================*/

DOM.prevPageBtn.addEventListener("click", async () => {

    const fileObject = getSelectedFile();

    if (!fileObject) return;

    if (fileObject.file.type !== "application/pdf") return;

    if (fileObject.currentPage <= 1) return;

    fileObject.currentPage--;

    await renderPDFPage(
        fileObject,
        fileObject.currentPage
    );

});


/*====================================================
                NEXT PAGE
====================================================*/

DOM.nextPageBtn.addEventListener("click", async () => {

    const fileObject = getSelectedFile();

    if (!fileObject) return;

    if (fileObject.file.type !== "application/pdf") return;

    if (fileObject.currentPage >= fileObject.pages) return;

    fileObject.currentPage++;

    await renderPDFPage(
        fileObject,
        fileObject.currentPage
    );

});


/*====================================================
            UPDATE NAVIGATION
====================================================*/

function updateNavigation(fileObject) {

    if (!fileObject) {

        DOM.prevPageBtn.disabled = true;
        DOM.nextPageBtn.disabled = true;

        return;
    }

    if (fileObject.file.type !== "application/pdf") {

        DOM.prevPageBtn.disabled = true;
        DOM.nextPageBtn.disabled = true;

        DOM.pageIndicator.textContent = "Page 1 / 1";

        return;
    }

    DOM.prevPageBtn.disabled =
        fileObject.currentPage === 1;

    DOM.nextPageBtn.disabled =
        fileObject.currentPage === fileObject.pages;

}


/*====================================================
            REFRESH CURRENT PREVIEW
====================================================*/

async function refreshPreview() {

    const fileObject = getSelectedFile();

    if (!fileObject) return;

    if (fileObject.file.type === "application/pdf") {

        await renderPDFPage(
            fileObject,
            fileObject.currentPage
        );

    } else {

        await showImagePreview(fileObject);

    }

    updateNavigation(fileObject);

}
/*====================================================
            PAPER SIZE EVENTS
====================================================*/

DOM.paperButtons.forEach(button => {

    button.addEventListener("click", () => {

        const file = getSelectedFile();

        if (!file) return;

        file.settings.paperSize = button.dataset.size;

        setActiveChip(
            DOM.paperButtons,
            button
        );

        refreshPreview();

        updatePriceAfterChange();
    });

});


/*====================================================
            PRINT TYPE EVENTS
====================================================*/

DOM.printTypeButtons.forEach(button => {

    button.addEventListener("click", () => {

        const file = getSelectedFile();

        if (!file) return;

        file.settings.printType = button.dataset.type;

        setActiveChip(
            DOM.printTypeButtons,
            button
        );

        updatePreviewFilter();

        updatePriceAfterChange();

    });

});


/*====================================================
            ACTIVE CHIP
====================================================*/

function setActiveChip(group, activeButton) {

    group.forEach(button => {

        button.classList.remove("active");

    });

    activeButton.classList.add("active");

}


/*====================================================
        UPDATE PREVIEW FILTER
====================================================*/

function updatePreviewFilter() {

    const file = getSelectedFile();

    if (!file) return;

    const filter =

        file.settings.printType === "bw"

        ? "grayscale(100%)"

        : "none";

    const img =
        DOM.previewBox.querySelector("img");

    const canvas =
        DOM.previewBox.querySelector("canvas");

    if (img) {

        img.style.filter = filter;

    }

    if (canvas) {

        canvas.style.filter = filter;

    }

}
/*====================================================
                PRINT SIDE EVENTS
====================================================*/

DOM.printSideButtons.forEach(button => {

    button.addEventListener("click", () => {

        const file = getSelectedFile();

        if (!file) return;

        file.settings.printSide = button.dataset.side;

        setActiveChip(
            DOM.printSideButtons,
            button
        );

        updatePriceAfterChange();

    });

});


/*====================================================
                INCREASE COPIES
====================================================*/

DOM.increaseCopies.addEventListener("click", () => {

    const file = getSelectedFile();

    if (!file) return;

    file.settings.copies++;

    DOM.copiesCount.textContent =
        file.settings.copies;

    updatePriceAfterChange();

});


/*====================================================
                DECREASE COPIES
====================================================*/

DOM.decreaseCopies.addEventListener("click", () => {

    const file = getSelectedFile();

    if (!file) return;

    if (file.settings.copies <= 1) return;

    file.settings.copies--;

    DOM.copiesCount.textContent =
        file.settings.copies;

    updatePriceAfterChange();

});


/*====================================================
            LOAD COMPLETE SETTINGS
====================================================*/

function loadFileSettings() {

    const file = getSelectedFile();

    if (!file) return;

    DOM.copiesCount.textContent =
        file.settings.copies;

    DOM.paperButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.size ===
            file.settings.paperSize
        );

    });

    DOM.printTypeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.type ===
            file.settings.printType
        );

    });

    DOM.printSideButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.side ===
            file.settings.printSide
        );

    });

    updatePreviewFilter();

}
/*====================================================
            REFRESH COMPLETE UI
====================================================*/

function refreshUI() {

    const file = getSelectedFile();

    if (!file) {

        updatePriceAfterChange();
        return;

    }

    loadFileSettings();

    updatePreviewFilter();

    updateNavigation(file);

    updatePriceAfterChange();

    updateUploadedFileCard(file);

}



/*====================================================
        UPDATE FILE CARD DETAILS
====================================================*/

function updateUploadedFileCard(file) {

    const cards = DOM.uploadedFilesList.querySelectorAll(".uploaded-file");

    cards.forEach(card => {

        const deleteBtn = card.querySelector(".delete-file");

        if (!deleteBtn) return;

        if (deleteBtn.dataset.id !== file.id) return;

        const info = card.querySelector(".file-info p");

        if (!info) return;

        const s = file.settings;

        info.textContent =

            `${file.pages} Page${file.pages > 1 ? "s" : ""} • ` +
            `${s.paperSize} • ` +
            `${s.printType === "bw" ? "B&W" : "Colour"} • ` +
            `${s.printSide === "single" ? "Single" : "Front & Back"} • ` +
            `${s.copies} Cop${s.copies > 1 ? "ies" : "y"}`;

    });

}



/*====================================================
        UPDATE ALL FILE CARDS
====================================================*/

function refreshAllFileCards() {

    App.files.forEach(file => {

        updateUploadedFileCard(file);

    });

}



/*====================================================
        SETTINGS CHANGED
====================================================*/

function onSettingsChanged() {

    refreshUI();

}



/*====================================================
        AUTO REFRESH
====================================================*/

window.addEventListener("resize", () => {

    const file = getSelectedFile();

    if (!file) return;

    refreshPreview();

});



/*====================================================
        INITIAL UI SYNC
====================================================*/

refreshAllFileCards();

updatePriceAfterChange();

/*====================================================
            CALCULATE FILE PRICE
====================================================*/

function calculateFilePrice(file) {

    if (!file) {

        return {

            pages: 0,

            sheets: 0,

            price: 0

        };

    }

    const settings = file.settings;

    const totalPages =
        (file.pages || 1) * settings.copies;

    let totalSheets = totalPages;

    if (settings.printSide === "double") {

        totalSheets = Math.ceil(totalPages / 2);

    }

    const paperPrice =
        PRICE[settings.paperSize];

    const pricePerPage =
        paperPrice[settings.printType];

    const totalPrice =
        totalPages * pricePerPage;

    return {

        pages: totalPages,

        sheets: totalSheets,

        price: totalPrice

    };

}



/*====================================================
            CALCULATE ALL FILES
====================================================*/

function calculateOrder() {

    let totalPages = 0;

    let totalSheets = 0;

    let totalPrice = 0;

    App.files.forEach(file => {

        const result =
            calculateFilePrice(file);

        totalPages += result.pages;

        totalSheets += result.sheets;

        totalPrice += result.price;

    });

    return {

        pages: totalPages,

        sheets: totalSheets,

        price: totalPrice

    };

}
/*====================================================
            UPDATE BOTTOM BAR
====================================================*/

function updateBottomBar() {

    const summary = calculateOrder();

    DOM.bottomPages.textContent =
        `${summary.pages} Page${summary.pages !== 1 ? "s" : ""}`;

    DOM.bottomSheets.textContent =
        `${summary.sheets} Sheet${summary.sheets !== 1 ? "s" : ""}`;

    DOM.bottomPrice.textContent =
        formatPrice(summary.price);

}



/*====================================================
            FORMAT PRICE
====================================================*/

function formatPrice(price) {

    return `₹${price.toFixed(2)}`;

}



/*====================================================
            UPDATE PRICE
====================================================*/

function updatePrice() {

    updateBottomBar();

}



/*====================================================
            EMPTY ORDER
====================================================*/

function isOrderEmpty() {

    return App.files.length === 0;

}



/*====================================================
            RESET BOTTOM BAR
====================================================*/

function resetBottomBar() {

    DOM.bottomPages.textContent =
        "0 Pages";

    DOM.bottomSheets.textContent =
        "0 Sheets";

    DOM.bottomPrice.textContent =
        "₹0.00";

}



/*====================================================
            REFRESH PRICE ENGINE
====================================================*/

function refreshPriceEngine() {

    if (isOrderEmpty()) {

        resetBottomBar();

        return;

    }

    updatePrice();

}



/*====================================================
        AUTO PRICE REFRESH
====================================================*/

function updatePriceAfterChange() {

    refreshPriceEngine();

}
/*====================================================
            BUILD ORDER SUMMARY
====================================================*/

function buildOrderSummary() {

    const items = [];

    App.files.forEach(file => {

        const calculation = calculateFilePrice(file);

        items.push({

            id: file.id,

            fileName: file.file.name,

            fileType: file.file.type,

            paperSize: file.settings.paperSize,

            printType: file.settings.printType,

            printSide: file.settings.printSide,

            copies: file.settings.copies,

            pages: calculation.pages,

            sheets: calculation.sheets,

            price: calculation.price

        });

    });

    const totals = calculateOrder();

    return {

        items,

        totalFiles: App.files.length,

        totalPages: totals.pages,

        totalSheets: totals.sheets,

        totalPrice: totals.price

    };

}



/*====================================================
            GET CART PAYLOAD
====================================================*/

function getCartPayload() {

    return {

        createdAt: new Date().toISOString(),

        order: buildOrderSummary()

    };

}



/*====================================================
            PRINT ORDER (DEBUG)
====================================================*/

function printOrderSummary() {

    console.table(

        buildOrderSummary().items

    );

    console.log(

        "Order Summary:",

        buildOrderSummary()

    );

}



/*====================================================
            ORDER TOTALS
====================================================*/

function getOrderTotals() {

    return calculateOrder();

}



/*====================================================
            REFRESH ORDER
====================================================*/

function refreshOrder() {

    refreshPriceEngine();

    refreshAllFileCards();

}
/*====================================================
                ADD TO CART
====================================================*/

DOM.addToCartBtn.addEventListener("click", addToCart);

function addToCart() {

    if (App.files.length === 0) {

        alert("Please upload at least one file.");

        return;

    }

    const payload = getCartPayload();

    let cart = JSON.parse(
        localStorage.getItem("printCart")
    ) || [];

    cart.push(payload);

    localStorage.setItem(

        "printCart",

        JSON.stringify(cart)

    );

   window.location.href = "checkout.html";

}



/*====================================================
            GET SAVED CART
====================================================*/

function getSavedCart() {

    return JSON.parse(

        localStorage.getItem("printCart")

    ) || [];

}



/*====================================================
            CLEAR CURRENT SESSION
====================================================*/

function clearPrintSession() {

    App.files.forEach(file => {

        if (

            file.file.type !== "application/pdf" &&

            file.thumbnail

        ) {

            URL.revokeObjectURL(file.thumbnail);

        }

    });

    App.files = [];

    App.selectedFileId = null;

    App.currentPdf = null;

    DOM.uploadedFilesList.innerHTML = "";

    updateFileCount();

    resetPreview();

    resetBottomBar();

}



/*====================================================
            REMOVE CART ITEM
====================================================*/

function removeCartItem(index) {

    let cart = getSavedCart();

    if (

        index < 0 ||

        index >= cart.length

    ) return;

    cart.splice(index, 1);

    localStorage.setItem(

        "printCart",

        JSON.stringify(cart)

    );

}



/*====================================================
            CLEAR CART
====================================================*/

function clearCart() {

    localStorage.removeItem("printCart");

}



/*====================================================
            APP INITIALIZATION
====================================================*/

function initializeApplication() {

    updateFileCount();

    resetPreview();

    refreshPriceEngine();

}

initializeApplication();