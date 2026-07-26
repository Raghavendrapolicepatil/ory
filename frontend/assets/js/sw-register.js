if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("./service-worker.js");
      console.log("✅ Registered", reg);
    } catch (err) {
      console.error("❌ Registration Failed", err);
    }
  });
}