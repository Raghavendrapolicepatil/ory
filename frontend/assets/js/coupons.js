// ==========================================
// Orymart Coupons
// ==========================================

function applyCoupon(code) {

    localStorage.setItem(
        "selectedCoupon",
        code
    );

    const toast =
        document.getElementById("coupon-toast");

    toast.textContent =
        `${code} applied successfully`;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}