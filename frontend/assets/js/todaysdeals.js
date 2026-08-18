// ==========================================
// Orymart Today's Deals Countdown
// ==========================================

const hourBox = document.getElementById("hours");

const minuteBox = document.getElementById("minutes");

const secondBox = document.getElementById("seconds");

// ==========================================
// Countdown
// ==========================================

function updateDealsTimer(){

    const now = new Date();

    const end = new Date();

    end.setHours(24,0,0,0);

    const diff = end - now;

    const hours = Math.floor(diff / 1000 / 60 / 60);

    const minutes = Math.floor((diff / 1000 / 60) % 60);

    const seconds = Math.floor((diff / 1000) % 60);

    hourBox.textContent =

        String(hours).padStart(2,"0");

    minuteBox.textContent =

        String(minutes).padStart(2,"0");

    secondBox.textContent =

        String(seconds).padStart(2,"0");

}

updateDealsTimer();

setInterval(updateDealsTimer,1000);

// ==========================================
// Flash Badge Animation
// ==========================================

const flash = document.querySelector(".flash-badge");

if(flash){

    setInterval(()=>{

        flash.animate(

        [

            {

                transform:"scale(1)"

            },

            {

                transform:"scale(1.08)"

            },

            {

                transform:"scale(1)"

            }

        ],

        {

            duration:700

        });

    },1500);

}

// ==========================================
// Banner Glow
// ==========================================

const banner = document.querySelector(".deals-banner");

if(banner){

    setInterval(()=>{

        banner.animate(

        [

            {

                filter:"brightness(1)"

            },

            {

                filter:"brightness(1.08)"

            },

            {

                filter:"brightness(1)"

            }

        ],

        {

            duration:1800

        });

    },2000);

}