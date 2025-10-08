window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add("intro-active", "logo-hidden");
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
    }).add(() => {
        document.body.classList.remove("intro-active");
        window.dispatchEvent(new Event("logo:refresh"));
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

    gsap.set(".marquee-track.left", {
        left: "-140%"
    });

    const leftAnim = gsap.timeline({
        delay: 3
    });


   // REGISTRAMOS CURVA PERSONALIZADA
CustomEase.create("slowInMiddle", "M0,0 C0.2,0 0.3,0.5 0.5,0.5 0.7,0.5 0.8,1 1,1");

// MARQUEE IZQUIERDA
gsap.set(".marquee-track.left", { left: "-140%" });

gsap.to(".marquee-track.left", {
  left: "100%",
  duration: 8,
  delay: 3,
  ease: "slowInMiddle"
});

// MARQUEE DERECHA
gsap.set(".marquee-track.right", { right: "-140%" });

gsap.to(".marquee-track.right", {
  right: "100%",
  duration: 8,
  delay: 3,
  ease: "slowInMiddle"
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
    xTo = gsap.quickTo(cursor, "x", {
        duration: 0.3,
        ease: "power3"
    }),
    yTo = gsap.quickTo(cursor, "y", {
        duration: 0.3,
        ease: "power3"
    });

// center cursor on pointer, and scale it to 20px
gsap.set(cursor, {
    scale: 0.2,
    xPercent: -50,
    yPercent: -50
});

window.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
});

items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        gsap.to(cursor, {
            scale: 1.5,
            duration: 0.2,
            overwrite: "auto"
        })
    });
    item.addEventListener("mouseleave", () => {
        gsap.to(cursor, {
            scale: 0.2,
            duration: 0.2,
            overwrite: "auto"
        })
    });
});

const alonsoLogo = document.querySelector(".alonso");
const rootElement = document.documentElement;

if (alonsoLogo) {
    const body = document.body;
    let hideThreshold = 160;
    let ticking = false;
    let isVisible = false;

    const calculateThreshold = (logoHeight) => {
        if (logoHeight && Number.isFinite(logoHeight)) {
            hideThreshold = Math.max(Math.round(logoHeight + 40), 160);
        }
    };

    const setNavOffset = () => {
        const rect = alonsoLogo.getBoundingClientRect();
        let height = rect.height;

        if (height === 0 && alonsoLogo.naturalWidth) {
            const scale = window.innerWidth / alonsoLogo.naturalWidth;
            height = alonsoLogo.naturalHeight * scale;
        }

        if (height > 0) {
            rootElement.style.setProperty("--logo-nav-offset", `${height}px`);
            calculateThreshold(height);
        }
    };

    const showLogo = () => {
        if (isVisible) return;
        alonsoLogo.classList.remove("is-hidden");
        body.classList.add("logo-visible");
        body.classList.remove("logo-hidden");
        isVisible = true;
    };

    const hideLogo = () => {
        if (!alonsoLogo.classList.contains("is-hidden")) {
            alonsoLogo.classList.add("is-hidden");
        }
        body.classList.add("logo-hidden");
        body.classList.remove("logo-visible");
        isVisible = false;
    };

    const updateLogoState = () => {
        if (body.classList.contains("intro-active")) {
            hideLogo();
            ticking = false;
            return;
        }

        if (window.scrollY <= hideThreshold) {
            showLogo();
        } else {
            hideLogo();
        }

        ticking = false;
    };

    const requestStateUpdate = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateLogoState);
            ticking = true;
        }
    };

    const refreshMetrics = () => {
        setNavOffset();
        requestStateUpdate();
    };

    if (alonsoLogo.complete) {
        refreshMetrics();
    } else {
        alonsoLogo.addEventListener("load", refreshMetrics);
    }

    hideLogo();
    requestStateUpdate();

    window.addEventListener("scroll", requestStateUpdate, {
        passive: true
    });
    window.addEventListener("resize", refreshMetrics);
    window.addEventListener("orientationchange", refreshMetrics);
    window.addEventListener("logo:refresh", () => {
        refreshMetrics();
        updateLogoState();
    });
}

document.addEventListener("DOMContentLoaded", setupHomeHeaderScroll);

function setupHomeHeaderScroll() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    if (!gsap.plugins || !gsap.plugins.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const heroSection = document.querySelector(".home-hero");
    const headerWrapper = document.querySelector(".home_header");
    const media = document.querySelector(".home_header-media");

    if (!heroSection || !headerWrapper || !media) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const baseWidth = () => {
        const width = Math.max(window.innerWidth * 0.32, 220);
        return Math.min(width, targetWidth() * 0.75);
    };

    const targetWidth = () => Math.max(window.innerWidth * 0.8, 320);

    let timeline = null;

    const buildTimeline = () => {
        if (timeline) {
            timeline.scrollTrigger.kill();
            timeline.kill();
            timeline = null;
        }

        const base = `${baseWidth()}px`;
        const target = `${targetWidth()}px`;

        gsap.set(media, {
            width: base
        });

        if (prefersReducedMotion) {
            gsap.set(media, {
                width: target
            });
            return;
        }

        timeline = gsap.timeline({
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "+=140%",
                scrub: true,
                pin: headerWrapper,
                pinSpacing: true,
                anticipatePin: 1
            }
        });

        timeline.to(media, {
            width: target,
            ease: "none"
        });
    };

    buildTimeline();

    const handleResize = () => {
        buildTimeline();
        if (ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
}
