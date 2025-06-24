window.addEventListener('DOMContentLoaded', () => {

  const tl = gsap.timeline();

  // Hace subir la "carta" desde abajo (home)
  tl.to(".home", {
    top: 0,
    duration: 1.5,
    ease: "power2.inOut",
    delay: 2
  })

  .to(".home", {
    onStart: () => {
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    }
  });
});






// NAV
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".burger");

    if (!toggleButton) {
        console.error("Elemento .burger no encontrado");
        return;
    }

    let activeItemIndicator = CSSRulePlugin.getRule(".menu-item p#active::after");
    let isOpen = false;

    gsap.set(".menu-item p", {
        y: 225
    });

    const timeline = gsap.timeline({
        paused: true
    });

    timeline.to(".overlay", {
        duration: 0.5,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power4.inOut"
    });

    timeline.to(".menu-item p", {
        duration: 0.5,
        y: 0,
        stagger: 0.2,
        ease: "power4.out"
    }, "-=1");

    timeline.to(activeItemIndicator, {
        width: "100%",
        duration: 1,
        ease: "power4.out",
        delay: 0.5
    }, "<");

    toggleButton.addEventListener("click", function () {
        if (isOpen) {
            timeline.reverse();
        } else {
            timeline.play();
        }
        isOpen = !isOpen;
    });
});

