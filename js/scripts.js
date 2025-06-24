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

    gsap.to(".marquee-track.left", {
        left: "100%",
        duration: 2.5,
        delay: 3,
        ease: "power2.easeIn"
    });

    gsap.to(".marquee-track.right", {
        right: "100%",
        duration: 2.5,
        delay: 3,
        ease: "power2.easeIn"
    });

    gsap.timeline({
            delay: 4.5
        })
        .to(".reveal-title h1,.reveal-title h2,.reveal-title p ", {
            duration: 1,
            opacity: 1,
            y: 0,
            ease: "power3.easeOut"
        })

    // .to("#escorpionModel", {
    //     duration: 1.5,
    //     left: '5vw',
    //     ease: "power3.out"
    // }, "-=0.5"); // Opcional: solapar un poco con la animación anterir


});


let items = gsap.utils.toArray("a"),
    cursor = document.querySelector("#Cursor"),
    xTo = gsap.quickTo(cursor, "x", {duration: 0.3, ease: "power3"}),
    yTo = gsap.quickTo(cursor, "y", {duration: 0.3, ease: "power3"});

// center cursor on pointer, and scale it to 20px
gsap.set(cursor, {scale: 0.2, xPercent: -50, yPercent: -50});

window.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});

items.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    gsap.to(cursor, { scale: 1.5, duration: 0.2, overwrite: "auto" })
  });
  item.addEventListener("mouseleave", () => {
    gsap.to(cursor, { scale: 0.2, duration: 0.2, overwrite: "auto" })
  });
});