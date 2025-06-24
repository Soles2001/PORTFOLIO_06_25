window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();

    tl.to(".home", {
        top: 0,
        duration: 1.5,
        ease: "power2.inOut",
        delay: 2
    }).to(".home", {
        onStart: () => {
            document.body.style.overflow = "auto";
            document.body.style.overflowX = "hidden";
        }
    });
});


// NAVBAR FIX
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".burger");
    const overlay = document.querySelector(".overlay");

    if (!toggleButton || !overlay) return;

    let isOpen = false;

    const timeline = gsap.timeline({
        paused: true
    });

    timeline.to(".overlay", {
        duration: 0.5,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power4.inOut"
    });

    timeline.fromTo(".menu-item p", {
        y: 225,
    }, {
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "power4.out"
    }, "-=0.3");

    toggleButton.addEventListener("click", function () {
        toggleButton.classList.toggle("active");
        isOpen ? timeline.reverse() : timeline.play();
        isOpen = !isOpen;
    });

    // Animar h1 después de que los marquees terminen (4s)
    // Mostrar h1 + side images después de que los marquees terminen (4s)
    gsap.set(".reveal-title h1", {
        y: 100
    });
    gsap.set(".reveal-title h2", {
        y: 120
    });
    gsap.set(".reveal-title p", {
        y: 140
    });
    gsap.set(".left-img", {
        x: -440
    });
    gsap.set(".right-img", {
        x: 440
    });

    gsap.to(".marquee-track.left", {
        left: "100%",
        duration: 3,
        delay: 3,
        ease: "power2.easeIn"
    });

    gsap.to(".marquee-track.right", {
        right: "100%",
        duration: 3,
        delay: 3,
        ease: "power2.easeIn"
    });

    gsap.timeline({
            delay: 5.5
        })
        .to(".reveal-title h1,.reveal-title h2,.reveal-title p ", {
            duration: 1,
            opacity: 1,
            y: 0,
            ease: "power3.easeOut"
        })

        .to(".left-img,.right-img", {
            duration: 1,
            opacity: 1,
            x: 0,
            ease: "power3.easeIn",
        }, );

});