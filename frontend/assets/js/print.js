/*==================================
        DOM Elements
==================================*/

const fileInput = document.getElementById("fileInput");

const uploadedFilesList =
document.getElementById("uploadedFilesList");

const fileCount =
document.getElementById("fileCount");

const previewBox =
document.getElementById("previewBox");

const pageIndicator =
document.getElementById("pageIndicator");

const prevPage =
document.getElementById("prevPage");

const nextPage =
document.getElementById("nextPage");


/*==================================
        Variables
==================================*/

let uploadedFiles = [];

let selectedFile = null;

let currentPage = 1;

let totalPages = 1;


/*==================================
        Upload Files
==================================*/

fileInput.addEventListener("change", uploadFiles);

function uploadFiles(e){

    const files = [...e.target.files];

    files.forEach(file=>{

        uploadedFiles.push({

            id:Date.now()+Math.random(),

            file:file,

            pages:1,

            currentPage:1,

            settings:{

                paperSize:"A4",

                printType:"bw",

                printSide:"single",

                copies:1

            }

        });

    });

    renderUploadedFiles();

}


/*==================================
        Render Uploaded Files
==================================*/

function renderUploadedFiles(){

    uploadedFilesList.innerHTML="";

    fileCount.textContent=
    `${uploadedFiles.length} Files`;

    uploadedFiles.forEach(item=>{

        const isPDF =
        item.file.type==="application/pdf";

        const div=document.createElement("div");

        div.className="uploaded-file";

        if(selectedFile?.id===item.id){

            div.classList.add("active");

        }

        div.innerHTML=`

        <div class="file-left">

            <div class="file-icon">

                <i class="fa-regular
                ${isPDF
                ?"fa-file-pdf"
                :"fa-file-image"}">

                </i>

            </div>

            <div class="file-info">

                <h4>${item.file.name}</h4>

                <p>${formatSize(item.file.size)}</p>

            </div>

        </div>

        `;

        div.addEventListener("click",()=>{

            selectFile(item.id);

        });

        uploadedFilesList.appendChild(div);

    });

}


/*==================================
        Select File
==================================*/

function selectFile(id){

    selectedFile =
    uploadedFiles.find(
        file=>file.id===id
    );

    currentPage =
    selectedFile.currentPage;

    renderUploadedFiles();

    loadPreview();

    loadSettings();

    updatePrice();

}


/*==================================
        File Size
==================================*/

function formatSize(bytes){

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
    ).toFixed(1)+" MB";

}
/*==================================
        Preview
==================================*/

async function loadPreview(){

    if(!selectedFile){

        previewBox.innerHTML=`

            <div class="empty-preview">

                <i class="fa-regular fa-file-lines"></i>

                <p>Select a file to preview</p>

            </div>

        `;

        pageIndicator.textContent="Page 0 / 0";

        return;

    }

    const file=selectedFile.file;

    if(file.type==="application/pdf"){

        showPdfPreview(file);

    }else{

        showImagePreview(file);

    }

}


/*==================================
        Image Preview
==================================*/

function showImagePreview(file){

    currentPage=1;

    totalPages=1;

    pageIndicator.textContent="Page 1 / 1";

    const url=URL.createObjectURL(file);

    previewBox.innerHTML=`

        <div class="paper">

            <img
                id="previewImage"
                class="preview-image"
                src="${url}"
                alt="Preview">

        </div>

    `;

}


/*==================================
        PDF Preview
==================================*/

async function showPdfPreview(file){

    const buffer=await file.arrayBuffer();

    const pdf=await pdfjsLib
    .getDocument({
        data:buffer
    }).promise;

    totalPages=pdf.numPages;

    selectedFile.pages=totalPages;

    renderPdfPage(pdf,currentPage);

}


/*==================================
        Render PDF Page
==================================*/

async function renderPdfPage(pdf,pageNumber){

    const page=await pdf.getPage(pageNumber);

    const viewport=page.getViewport({

        scale:1.5

    });

    const canvas=document.createElement("canvas");

    const context=
    canvas.getContext("2d");

    canvas.width=viewport.width;

    canvas.height=viewport.height;

    await page.render({

        canvasContext:context,

        viewport:viewport

    }).promise;

    previewBox.innerHTML=`

        <div class="paper">

        </div>

    `;

    previewBox
    .querySelector(".paper")
    .appendChild(canvas);

    pageIndicator.textContent=
    `Page ${pageNumber} / ${totalPages}`;

}


/*==================================
        Previous Page
==================================*/

prevPage.addEventListener("click",async()=>{

    if(!selectedFile) return;

    if(selectedFile.file.type!=="application/pdf") return;

    if(currentPage<=1) return;

    currentPage--;

    const pdf=await pdfjsLib
    .getDocument({

        data:await selectedFile
        .file
        .arrayBuffer()

    }).promise;

    renderPdfPage(pdf,currentPage);

});


/*==================================
        Next Page
==================================*/

nextPage.addEventListener("click",async()=>{

    if(!selectedFile) return;

    if(selectedFile.file.type!=="application/pdf") return;

    if(currentPage>=totalPages) return;

    currentPage++;

    const pdf=await pdfjsLib
    .getDocument({

        data:await selectedFile
        .file
        .arrayBuffer()

    }).promise;

    renderPdfPage(pdf,currentPage);

});
/*==================================
        DOM Elements
==================================*/

const paperButtons = document.querySelectorAll("#paperSize .chip");
const printTypeButtons = document.querySelectorAll("#printType .chip");
const printSideButtons = document.querySelectorAll("#printSide .chip");

const decreaseCopies = document.getElementById("decreaseCopies");
const increaseCopies = document.getElementById("increaseCopies");
const copiesCount = document.getElementById("copiesCount");


/*==================================
        Load Settings
==================================*/

function loadSettings(){

    if(!selectedFile) return;

    const settings = selectedFile.settings;

    copiesCount.textContent = settings.copies;

    setActiveChip(
        paperButtons,
        settings.paperSize,
        "size"
    );

    setActiveChip(
        printTypeButtons,
        settings.printType,
        "type"
    );

    setActiveChip(
        printSideButtons,
        settings.printSide,
        "side"
    );

    updatePreviewColor();

}


/*==================================
        Active Chip
==================================*/

function setActiveChip(buttons,value,data){

    buttons.forEach(btn=>{

        btn.classList.remove("active");

        if(btn.dataset[data]===value){

            btn.classList.add("active");

        }

    });

}


/*==================================
        Paper Size
==================================*/

paperButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(!selectedFile) return;

        paperButtons.forEach(btn=>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedFile.settings.paperSize =
        button.dataset.size;

        updatePrice();

    });

});


/*==================================
        Print Type
==================================*/

printTypeButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(!selectedFile) return;

        printTypeButtons.forEach(btn=>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedFile.settings.printType =
        button.dataset.type;

        updatePreviewColor();

        updatePrice();

    });

});


/*==================================
        Print Side
==================================*/

printSideButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(!selectedFile) return;

        printSideButtons.forEach(btn=>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedFile.settings.printSide =
        button.dataset.side;

        updatePrice();

    });

});


/*==================================
        Copies
==================================*/

increaseCopies.addEventListener("click",()=>{

    if(!selectedFile) return;

    selectedFile.settings.copies++;

    copiesCount.textContent =
    selectedFile.settings.copies;

    updatePrice();

});


decreaseCopies.addEventListener("click",()=>{

    if(!selectedFile) return;

    if(selectedFile.settings.copies===1) return;

    selectedFile.settings.copies--;

    copiesCount.textContent =
    selectedFile.settings.copies;

    updatePrice();

});


/*==================================
        Preview Colour
==================================*/

function updatePreviewColor(){

    if(!selectedFile) return;

    const img =
    previewBox.querySelector("img");

    const canvas =
    previewBox.querySelector("canvas");

    const isBW =
    selectedFile.settings.printType==="bw";

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
        Price Configuration
==================================*/

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


/*==================================
        Bottom Elements
==================================*/

const bottomPages = document.getElementById("bottomPages");
const bottomSheets = document.getElementById("bottomSheets");
const bottomPrice = document.getElementById("bottomPrice");


/*==================================
        Update Price
==================================*/

function updatePrice(){

    let totalPages = 0;
    let totalSheets = 0;
    let totalPrice = 0;

    uploadedFiles.forEach(file=>{

        const settings = file.settings;

        const pages = file.pages || 1;

        const copies = settings.copies;

        const pricePerPage =
            PRICE[settings.paperSize][settings.printType];

        const pagesAfterCopies =
            pages * copies;

        let sheets;

        if(settings.printSide==="double"){

            sheets = Math.ceil(pagesAfterCopies / 2);

        }else{

            sheets = pagesAfterCopies;

        }

        const filePrice =
            pagesAfterCopies * pricePerPage;

        totalPages += pagesAfterCopies;

        totalSheets += sheets;

        totalPrice += filePrice;

    });

    bottomPages.textContent =
        `${totalPages} Pages`;

    bottomSheets.textContent =
        `${totalSheets} Sheets`;

    bottomPrice.textContent =
        `₹${totalPrice}`;

}


/*==================================
    Update File Details
==================================*/

function updateFileInfo(){

    const cards =
        document.querySelectorAll(".uploaded-file");

    cards.forEach((card,index)=>{

        const file = uploadedFiles[index];

        if(!file) return;

        const p =
            card.querySelector(".file-info p");

        if(!p) return;

        const pages =
            file.pages || 1;

        const settings =
            file.settings;

        p.textContent =
            `${pages} Pages • ${settings.paperSize} • ${settings.printType.toUpperCase()} • ${settings.copies} Copy`;

    });

}


/*==================================
        Auto Refresh
==================================*/

const oldUpdatePrice = updatePrice;

updatePrice = function(){

    oldUpdatePrice();

    updateFileInfo();

};

/*==================================
        Add To Cart
==================================*/

const addToCartBtn =
document.getElementById("addToCartBtn");

addToCartBtn.addEventListener("click",addToCart);

function addToCart(){

    if(uploadedFiles.length===0){

        alert("Please upload at least one file.");

        return;

    }

    const cart =
    JSON.parse(
        localStorage.getItem("printCart")
    ) || [];

    uploadedFiles.forEach(item=>{

        cart.push({

            id:item.id,

            fileName:item.file.name,

            fileType:item.file.type,

            fileSize:item.file.size,

            pages:item.pages,

            settings:{...item.settings},

            addedAt:new Date().toISOString()

        });

    });

    localStorage.setItem(
        "printCart",
        JSON.stringify(cart)
    );

    alert("Files added to cart successfully.");

}


/*==================================
        Delete File
==================================*/

function deleteFile(id){

    uploadedFiles =
    uploadedFiles.filter(file=>file.id!==id);

    if(selectedFile?.id===id){

        selectedFile=null;

        previewBox.innerHTML=`

        <div class="empty-preview">

            <i class="fa-regular fa-file-lines"></i>

            <p>Select a file to preview</p>

        </div>

        `;

        pageIndicator.textContent="Page 0 / 0";

    }

    renderUploadedFiles();

    updatePrice();

}


/*==================================
        Auto Select First File
==================================*/

function autoSelectFirstFile(){

    if(uploadedFiles.length===0) return;

    if(selectedFile) return;

    selectFile(uploadedFiles[0].id);

}


/*==================================
        Render Override
==================================*/

const oldRenderUploadedFiles =
renderUploadedFiles;

renderUploadedFiles=function(){

    oldRenderUploadedFiles();

    autoSelectFirstFile();

};


/*==================================
        Initialization
==================================*/

function init(){

    updatePrice();

}

init();