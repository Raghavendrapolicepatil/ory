// Refresh Button
document.getElementById("retryBtn").addEventListener("click", () => {

    if (navigator.onLine) {
        window.location.href = "index.html";
    } else {
        alert("No internet connection.\nPlease check your network.");
    }

});


// Auto Redirect when Internet Returns
window.addEventListener("online", () => {
    window.location.href = "index.html";
});


// Optional: Console Message
window.addEventListener("offline", () => {
    console.log("You are offline");
});