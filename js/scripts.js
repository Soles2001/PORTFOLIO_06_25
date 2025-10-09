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

        const alonsoLogoEl = document.querySelector(".alonso");
        if (alonsoLogoEl) {
            alonsoLogoEl.classList.remove("is-hidden");
        }

        document.body.classList.add("logo-visible");
        document.body.classList.remove("logo-hidden");

        window.requestAnimationFrame(() => {
            window.dispatchEvent(new Event("logo:refresh"));
        });
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
document.addEventListener("DOMContentLoaded", setupStackedGallery);
document.addEventListener("DOMContentLoaded", setupFooterThemeToggle);

function setupHomeHeaderScroll() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    if (!gsap.plugins || !gsap.plugins.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const headerWrapper = document.querySelector(".home_header");
    const media = document.querySelector(".home_header-media");
    const mediaLink = media ? media.querySelector("a") : null;
    const mediaImage = mediaLink ? mediaLink.querySelector("img") : null;
    const headerCopy = gsap.utils.toArray(".home_header-copy");

    if (!headerWrapper || !media || !mediaLink || !mediaImage) {
        return;
    }

    mediaLink.classList.add("home_header-media-link");
    mediaImage.classList.add("home_header-media-image", "home_header-media-image--current");

    let mediaTransitionImage = mediaLink.querySelector(".home_header-media-image--transition");

    if (!mediaTransitionImage) {
        mediaTransitionImage = mediaImage.cloneNode(false);
        mediaTransitionImage.classList.remove("home_header-media-image--current");
        mediaTransitionImage.classList.add("home_header-media-image", "home_header-media-image--transition");
        mediaTransitionImage.setAttribute("aria-hidden", "true");
        mediaTransitionImage.style.opacity = "0";
        mediaTransitionImage.style.transform = "translate3d(0, 0, 0)";
        mediaLink.appendChild(mediaTransitionImage);
    }

    gsap.set([mediaImage, mediaTransitionImage], {
        xPercent: 0
    });
    gsap.set(mediaTransitionImage, {
        autoAlpha: 0
    });

    const projectData = [
        {
            href: "cofi.html",
            image: "media/img/cofi/cofi_individual.webp",
            alt: "Cofi branding packaging"
        },
        {
            href: "thompson.html",
            image: "media/img/thompson/thompson_mural_comida.webp",
            alt: "Thompson food mural"
        },
        {
            href: "madrid_fusion.html",
            image: "media/img/madrid_fusion/madrid_fusion_totebag.webp",
            alt: "Madrid Fusión tote bag"
        },
        {
            href: "minority.html",
            image: "media/img/minority/minority_app_icon.webp",
            alt: "Minority app icon"
        },
        {
            href: "valencia_wines.html",
            image: "media/img/valencia_wines/valenci_wines_tres.webp",
            alt: "Valencia Wines bottles"
        },
        {
            href: "keller.html",
            image: "media/img/keller/keller_camiseta.webp",
            alt: "Keller apparel graphic"
        },
        {
            href: "chupachups.html",
            image: "media/img/chupachups/chupachups_lettering.webp",
            alt: "Chupa Chups lettering"
        },
        {
            href: "adn_forum.html",
            image: "media/img/adn/adn_vertical_foto.webp",
            alt: "ADN Forum poster"
        }
    ];

    if (!projectData.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetHeight = () => window.innerHeight * 0.6;
    const targetWidth = () => window.innerWidth;

    let timeline = null;
    let pinTrigger = null;
    let imageSwapTween = null;
    let isMediaExpanded = false;
    let activeIndex = -1;
    const driver = {
        value: 0
    };
    let lastDriverValue = driver.value;

    const clearMediaStyles = () => {
        gsap.set(media, {
            width: "",
            height: "",
            top: "",
            bottom: "",
            yPercent: 0
        });
        gsap.set(mediaImage, {
            xPercent: 0
        });
        if (mediaTransitionImage) {
            gsap.set(mediaTransitionImage, {
                xPercent: 0,
                autoAlpha: 0
            });
        }
    };

    const applyPinnedState = () => {
        gsap.set(media, {
            width: targetWidth(),
            height: targetHeight(),
            top: "50%",
            bottom: "auto",
            yPercent: -50
        });
        isMediaExpanded = true;
    };

    const toggleCopyRelease = (released) => {
        if (!headerCopy.length) {
            return;
        }

        headerCopy.forEach((copy) => {
            copy.classList.toggle("is-released", released);
        });
    };

    const applyProject = (index, options = {}) => {
        if (index < 0 || index >= projectData.length || index === activeIndex) {
            return;
        }

        const previousIndex = activeIndex;
        const project = projectData[index];
        const immediate = Boolean(options.immediate) || !project.image;
        const requestedDirection = options.direction;
        const direction = requestedDirection === "up" || requestedDirection === "down"
            ? requestedDirection
            : previousIndex === -1 || index >= previousIndex
                ? "down"
                : "up";

        activeIndex = index;

        if (project.href) {
            mediaLink.setAttribute("href", project.href);
        }

        const setCurrentImage = () => {
            if (project.image) {
                mediaImage.setAttribute("src", project.image);
            } else {
                mediaImage.removeAttribute("src");
            }
            mediaImage.setAttribute("alt", project.alt || "");
        };

        if (immediate) {
            setCurrentImage();
            gsap.set(mediaImage, {
                xPercent: 0,
                autoAlpha: 1
            });
            if (mediaTransitionImage) {
                gsap.set(mediaTransitionImage, {
                    xPercent: 0,
                    autoAlpha: 0
                });
            }
            imageSwapTween = null;
            return;
        }

        if (imageSwapTween) {
            imageSwapTween.kill();
            imageSwapTween = null;
        }

        if (mediaTransitionImage) {
            const currentSrc = mediaImage.getAttribute("src");
            const currentAlt = mediaImage.getAttribute("alt") || "";
            if (currentSrc) {
                mediaTransitionImage.setAttribute("src", currentSrc);
                mediaTransitionImage.setAttribute("alt", currentAlt);
                gsap.set(mediaTransitionImage, {
                    xPercent: 0,
                    autoAlpha: 1
                });
            } else {
                mediaTransitionImage.removeAttribute("src");
                mediaTransitionImage.setAttribute("alt", "");
                gsap.set(mediaTransitionImage, {
                    autoAlpha: 0
                });
            }
        }

        setCurrentImage();

        const enterOffset = direction === "down" ? -100 : 100;
        const exitOffset = direction === "down" ? 100 : -100;

        gsap.set(mediaImage, {
            xPercent: enterOffset,
            autoAlpha: 1
        });

        imageSwapTween = gsap.timeline({
            defaults: {
                duration: 0.6,
                ease: "power3.inOut"
            },
            onComplete: () => {
                if (mediaTransitionImage) {
                    gsap.set(mediaTransitionImage, {
                        autoAlpha: 0,
                        xPercent: 0
                    });
                }
            }
        });

        if (mediaTransitionImage) {
            imageSwapTween.to(mediaTransitionImage, {
                xPercent: exitOffset
            }, 0);
        }

        imageSwapTween.to(mediaImage, {
            xPercent: 0
        }, 0);
    };

    applyProject(0, {
        immediate: true
    });

    const getScrollLength = () => {
        const viewport = window.innerHeight;
        return Math.max(viewport * 1.6, projectData.length * viewport * 0.9);
    };

    const buildTimeline = () => {
        if (timeline) {
            timeline.scrollTrigger.kill();
            timeline.kill();
            timeline = null;
        }

        if (pinTrigger) {
            pinTrigger.kill();
            pinTrigger = null;
        }

        clearMediaStyles();
        isMediaExpanded = false;
        driver.value = 0;
        lastDriverValue = driver.value;
        gsap.killTweensOf(driver);

        const scrollTriggerConfig = {
            trigger: headerWrapper,
            start: "top top",
            end: () => "+=" + getScrollLength(),
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: clearMediaStyles,
            onKill: clearMediaStyles,
            onLeave: () => toggleCopyRelease(true),
            onEnterBack: () => toggleCopyRelease(false)
        };

        if (prefersReducedMotion) {
            applyPinnedState();
            pinTrigger = ScrollTrigger.create({
                ...scrollTriggerConfig,
                onRefresh: () => {
                    applyPinnedState();
                    applyProject(0, {
                        immediate: true
                    });
                }
            });
            return;
        }

        if (headerCopy.length) {
            gsap.set(headerCopy, {
                opacity: 1
            });
        }

        timeline = gsap.timeline({
            scrollTrigger: {
                ...scrollTriggerConfig,
                scrub: true
            }
        });

        timeline.to(media, {
            width: () => targetWidth(),
            height: () => targetHeight(),
            top: "50%",
            bottom: "auto",
            yPercent: -50,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                isMediaExpanded = true;
            },
            onReverseComplete: () => {
                isMediaExpanded = false;
                applyProject(0, {
                    immediate: true
                });
                lastDriverValue = driver.value;
            }
        });

        timeline.to(driver, {
            value: projectData.length - 1 + 0.999,
            duration: Math.max(1, projectData.length),
            ease: "none",
            onStart: () => {
                isMediaExpanded = true;
                lastDriverValue = driver.value;
            },
            onUpdate: () => {
                if (!isMediaExpanded) {
                    return;
                }

                const rawValue = driver.value;
                const nextIndex = Math.min(projectData.length - 1, Math.floor(rawValue));
                const direction = rawValue >= lastDriverValue ? "down" : "up";

                if (nextIndex !== activeIndex) {
                    applyProject(nextIndex, {
                        direction
                    });
                }

                lastDriverValue = rawValue;
            }
        });
    };

    buildTimeline();

    const refreshScroll = () => {
        if (timeline) {
            timeline.invalidate();
            if (timeline.scrollTrigger) {
                timeline.scrollTrigger.refresh();
            }
        } else if (pinTrigger) {
            pinTrigger.refresh();
        } else if (ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    };

    const handleResize = () => {
        buildTimeline();
        refreshScroll();
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
        }
    };

    window.addEventListener("logo:refresh", refreshScroll);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
}

function setupStackedGallery() {
    const galleryItems = Array.from(document.querySelectorAll("#gallery .gallery-item"));

    if (!galleryItems.length) {
        return;
    }

    galleryItems.forEach((item, index) => {
        item.style.zIndex = String(galleryItems.length - index + 2);
    });

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    if (!gsap.plugins || !gsap.plugins.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        return;
    }

    galleryItems.forEach((item) => {
        gsap.set(item, {
            scale: 0.96
        });

        ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: () => "+=" + window.innerHeight * 0.6,
            onEnter: () => {
                gsap.to(item, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            },
            onLeave: () => {
                gsap.to(item, {
                    scale: 0.96,
                    duration: 0.3,
                    ease: "power2.inOut",
                    overwrite: "auto"
                });
            },
            onEnterBack: () => {
                gsap.to(item, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            },
            onLeaveBack: () => {
                gsap.to(item, {
                    scale: 0.96,
                    duration: 0.3,
                    ease: "power2.inOut",
                    overwrite: "auto"
                });
            }
        });
    });
}

function setupFooterThemeToggle() {
    const footer = document.querySelector("footer");

    if (!footer) {
        return;
    }

    const toggleTheme = (isVisible) => {
        document.body.classList.toggle("footer-theme", isVisible);
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    toggleTheme(entry.isIntersecting);
                });
            }, {
                threshold: 0.2,
                rootMargin: "0px 0px -16%"
            }
        );

        observer.observe(footer);
        return;
    }

    const handleScroll = () => {
        const rect = footer.getBoundingClientRect();
        toggleTheme(rect.top < window.innerHeight && rect.bottom > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
        passive: true
    });
}
