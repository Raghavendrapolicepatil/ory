// ==========================================
// PRINT PAGE
// ==========================================

const fileInput = document.getElementById("fileInput");

const qtyText = document.querySelector(".qty span");

const minusBtn = document.querySelector(".qty button:first-child");

const plusBtn = document.querySelector(".qty button:last-child");

const totalPrice = document.querySelector(".total-card h2");

const addBtn = document.querySelector(".order-btn");

const typeRadios = document.querySelectorAll("input[name='type']");

const sideRadios = document.querySelectorAll("input[name='side']");

let copies = 1;

// Base Prices
const BW_PRICE = 5;
const COLOR_PRICE = 15;

// ==========================================
// File Upload
// ==========================================

fileInput.addEventListener("change", () => {

    if (fileInput.files.length > 0) {

        document.querySelector(".upload-box p").textContent =
            fileInput.files[0].name;

    } else {

        document.querySelector(".upload-box p").textContent =
            "Supported: PDF, JPG, PNG";

    }

});

// ==========================================
// Calculate Price
// ==========================================

function updatePrice() {

    let price =
        document.querySelector("input[name='type']:checked").nextSibling.textContent.trim() ===
        "Colour"
            ? COLOR_PRICE
            : BW_PRICE;

    if (
        document.querySelector("input[name='side']:checked")
            .nextSibling.textContent.trim() === "Double Side"
    ) {
        price += 2;
    }

    totalPrice.textContent = `₹${price * copies}`;
}

// ==========================================
// Quantity
// ==========================================

plusBtn.onclick = () => {

    copies++;

    qtyText.textContent = copies;

    updatePrice();

};

minusBtn.onclick = () => {

    if (copies > 1) {

        copies--;

        qtyText.textContent = copies;

        updatePrice();

    }

};

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
// Add to Cart
// ==========================================

addBtn.onclick = () => {

    if (!fileInput.files.length) {

        alert("Please upload your document.");

        return;

    }

    alert(
        `Document Added!\n\nCopies : ${copies}\nTotal : ${totalPrice.textContent}`
    );

};

// Initial Price
updatePrice();