window.addEventListener("load",()=>{

    setTimeout(()=>{

        document.getElementById("loader")
        .classList.add("hide");

        document.getElementById("app")
        .style.display="block";

    },1200);

});