// ==========================================
// Orymart Help & Support
// ==========================================

const helpForm = document.getElementById("helpForm");

const WHATSAPP_NUMBER = "918073072838";


// ==========================================
// Submit Form
// ==========================================

if (helpForm) {

    helpForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            document.getElementById("helpName").value.trim();

        const mobile =
            document.getElementById("helpPhone").value.trim();

        const message =
            document.getElementById("helpMessage").value.trim();


        // Check fields

        if (!name || !mobile || !message) {

            alert("Please fill all fields.");

            return;

        }


        // ==========================================
        // Create WhatsApp Message
        // ==========================================

        const whatsappMessage =
`Hello Orymart Support,

Name: ${name}
Mobile: ${mobile}

Message:
${message}`;


        // ==========================================
        // Open WhatsApp
        // ==========================================

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;


        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );


        // Clear form

        helpForm.reset();

    });

}


// ==========================================
// Direct WhatsApp Support
// ==========================================

const whatsappBtn =
    document.querySelector(".whatsapp-btn");

if (whatsappBtn) {

    whatsappBtn.href =
        "https://wa.me/918073072838";

    whatsappBtn.target = "_blank";

    whatsappBtn.rel =
        "noopener noreferrer";

}