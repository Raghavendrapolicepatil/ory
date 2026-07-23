// ==========================================
// PRODUCT VARIANTS
// ==========================================

function initVariants(product){

    const container =
        document.getElementById(
            "variant-list"
        );

    if(!container) return;

    container.innerHTML = "";

    // ======================================
    // NO VARIANTS
    // ======================================

    if(
        !product.variants ||
        product.variants.length===0
    ){

        container.style.display="none";

        return;

    }

    container.style.display="flex";

    // ======================================
    // CREATE VARIANTS
    // ======================================

    product.variants.forEach(

        (variant,index)=>{

            const card =
                document.createElement("div");

            card.className =
                "variant-card";

            if(index===0){

                card.classList.add(
                    "active"
                );

            }

            const discount =

                variant.mrp>variant.price

                ?

                Math.round(

                    (
                        (variant.mrp-
                        variant.price)

                        /

                        variant.mrp

                    )*100

                )+"% OFF"

                :

                "";

            card.innerHTML=

            `

            <div class="variant-name">

                ${variant.name}

            </div>

            <div class="variant-price">

                ₹${variant.price}

            </div>

            <div class="variant-mrp">

                ₹${variant.mrp}

            </div>

            <div class="variant-off">

                ${discount}

            </div>

            `;

            card.addEventListener(

                "click",

                ()=>{

                    selectVariant(

                        variant,

                        card,

                        product

                    );

                }

            );

            container.appendChild(

                card

            );

        }

    );

}

// ==========================================
// SELECT VARIANT
// ==========================================

function selectVariant(

    variant,

    card,

    product

){

    currentVariant = variant;

    // Active Card

    document

    .querySelectorAll(

        ".variant-card"

    )

    .forEach(item=>{

        item.classList.remove(

            "active"

        );

    });

    card.classList.add(

        "active"

    );

    // ======================================
    // PRICE
    // ======================================

    document

    .getElementById(

        "product-price"

    )

    .textContent=

    "₹"+variant.price;

    document

    .getElementById(

        "bottom-price"

    )

    .textContent=

    "₹"+variant.price;

    document

    .getElementById(

        "product-mrp"

    )

    .textContent=

    "₹"+variant.mrp;

    const discount =

        variant.mrp>variant.price

        ?

        Math.round(

            (
                (variant.mrp-
                variant.price)

                /

                variant.mrp

            )*100

        )+"% OFF"

        :

        "";

    document

    .getElementById(

        "product-discount"

    )

    .textContent=

    discount;

    // ======================================
    // STOCK
    // ======================================

    document

    .getElementById(

        "detail-weight"

    )

    .textContent=

    variant.name;

    document

    .getElementById(

        "detail-stock"

    )

    .textContent=

    variant.stock;

    const stockBox =

        document.getElementById(

            "stock-status"

        );

    if(variant.stock>0){

        stockBox.innerHTML=

        `<i class="ri-checkbox-circle-fill"></i>
        In Stock`;

        stockBox.classList.remove(

            "out"

        );

    }

    else{

        stockBox.innerHTML=

        `<i class="ri-close-circle-fill"></i>
        Out of Stock`;

        stockBox.classList.add(

            "out"

        );

    }

    // ======================================
    // IMAGE
    // ======================================

    if(

        variant.image

    ){

        document

        .getElementById(

            "product-image"

        )

        .src=

        variant.image;

    }

    // ======================================
    // CART
    // ======================================

    if(typeof renderCartButton==="function"){

        renderCartButton();

    }

}