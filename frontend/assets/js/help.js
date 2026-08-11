// ==========================================
// Patil Groceries Help & Support
// ==========================================

const helpForm = document.getElementById("helpForm");

// ==========================================
// Submit Form
// ==========================================

if (helpForm) {

    helpForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const name =
            helpForm.querySelector('input[type="text"]').value.trim();

        const mobile =
            helpForm.querySelector('input[type="tel"]').value.trim();

        const message =
            helpForm.querySelector("textarea").value.trim();

        if (!name || !mobile || !message) {

            alert("Please fill all fields.");

            return;

        }

        // Save Locally (Temporary)
        const supportMessages =
            JSON.parse(localStorage.getItem("supportMessages")) || [];

        supportMessages.push({

            id: Date.now(),

            name,

            mobile,

            message,

            date: new Date().toLocaleString()

        });

        localStorage.setItem(

            "supportMessages",

            JSON.stringify(supportMessages)

        );

        alert("✅ Your message has been sent successfully.");

        helpForm.reset();

    });

}

// ==========================================
// WhatsApp Support
// ==========================================

const whatsappBtn =
    document.querySelector(".whatsapp-btn");

if (whatsappBtn) {

    whatsappBtn.href =
        "https://wa.me/91 8073307807";

    whatsappBtn.target = "_blank";

}