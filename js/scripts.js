window.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const homeSection = document.querySelector(".home");
    const introSection = document.querySelector(".intro");

    if (!homeSection || !introSection) {
        body.classList.remove("intro-active");
        body.classList.remove("logo-hidden");
        body.classList.add("logo-visible");
        body.style.overflow = "auto";
        body.style.overflowX = "hidden";

        window.requestAnimationFrame(() => {
            window.dispatchEvent(new Event("logo:refresh"));
        });
        return;
    }

    body.classList.add("intro-active", "logo-hidden");
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

    if (body.classList.contains("intro-active")) {
        hideLogo();
    } else {
        showLogo();
    }
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

    let mediaTitleEl = media.querySelector(".home_header-media-title");

    if (!mediaTitleEl) {
        mediaTitleEl = document.createElement("span");
        mediaTitleEl.className = "home_header-media-title";
        mediaTitleEl.setAttribute("aria-hidden", "true");
        media.appendChild(mediaTitleEl);
    }

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

    let pendingProjectTitle = "";
    const updateProjectTitleVisibility = () => {
        if (!mediaTitleEl) {
            return;
        }
        if (isMediaExpanded && pendingProjectTitle) {
            mediaTitleEl.textContent = pendingProjectTitle;
        } else {
            mediaTitleEl.textContent = "";
        }
    };

    const setProjectTitle = (title) => {
        pendingProjectTitle = title || "";
        updateProjectTitleVisibility();
    };

    const projectData = [
        {
            title: "Cofi",
            href: "cofi.html",
            image: "media/img/cofi/cofi_individual.webp",
            alt: "Cofi branding packaging"
        },
        {
            title: "Thompson",
            href: "thompson.html",
            image: "media/img/thompson/thompson_mural_comida.webp",
            alt: "Thompson food mural"
        },
        {
            title: "Madrid Fusión",
            href: "madrid_fusion.html",
            image: "media/img/madrid_fusion/madrid_fusion_totebag.webp",
            alt: "Madrid Fusión tote bag"
        },
        {
            title: "Minority",
            href: "minority.html",
            image: "media/img/minority/minority_app_icon.webp",
            alt: "Minority app icon"
        },
        {
            title: "Valencia Wines",
            href: "valencia_wines.html",
            image: "media/img/valencia_wines/valenci_wines_tres.webp",
            alt: "Valencia Wines bottles"
        },
        {
            title: "Keller",
            href: "keller.html",
            image: "media/img/keller/keller_camiseta.webp",
            alt: "Keller apparel graphic"
        },
        {
            title: "Chupa Chups",
            href: "chupachups.html",
            image: "media/img/chupachups/chupachups_lettering.webp",
            alt: "Chupa Chups lettering"
        },
        {
            title: "ADN Forum",
            href: "adn_forum.html",
            image: "media/img/adn/adn_vertical_foto.webp",
            alt: "ADN Forum poster"
        }
    ];

    if (!projectData.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCROLL_SCRUB = 1.2;
    const SCROLL_EASE = "power3.out";
    const MEDIA_ANIMATION_DURATION = 1.15;
    const nav = document.querySelector("nav");
    const pinnedTop = () => {
        const navHeight = nav ? nav.offsetHeight : 0;
        return navHeight + window.innerHeight * 0.01;
    };
    const targetWidth = () => window.innerWidth;
    const copyTop = () => {
        if (!headerCopy.length) {
            return window.innerHeight - window.innerHeight * 0.05;
        }
        return headerCopy.reduce((minTop, copy) => {
            const rect = copy.getBoundingClientRect();
            return Math.min(minTop, rect.top);
        }, Number.POSITIVE_INFINITY);
    };
    const targetHeight = () => {
        const topLimit = pinnedTop();
        const bottomLimit = copyTop() - window.innerHeight * 0.02;
        const available = bottomLimit - topLimit;
        return Math.max(available, 320);
    };

    let timeline = null;
    let pinTrigger = null;
    let imageSwapTween = null;
    let isMediaExpanded = false;
    const setExpandedState = (expanded) => {
        isMediaExpanded = expanded;
        media.classList.toggle("home_header-media--expanded", expanded);
        if (expanded) {
            gsap.set(media, {
                paddingLeft: "3%",
                paddingRight: "3%"
            });
        } else {
            gsap.set(media, {
                paddingLeft: 0,
                paddingRight: 0,
                width: "",
                height: "",
                top: "",
                bottom: "",
                yPercent: 0
            });
        }
        updateProjectTitleVisibility();
    };
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
        setExpandedState(false);
        driver.value = Math.max(0, activeIndex);
        lastDriverValue = driver.value;
    };

    const applyPinnedState = () => {
        gsap.set(media, {
            width: targetWidth(),
            height: targetHeight(),
            top: pinnedTop(),
            bottom: "auto",
            yPercent: 0,
            paddingLeft: "3%",
            paddingRight: "3%"
        });
        setExpandedState(true);
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
        setProjectTitle(project.title);

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
        const exitOffset = direction === "down" ? 80 : -80;

        gsap.set(mediaImage, {
            xPercent: enterOffset,
            autoAlpha: 1
        });

        imageSwapTween = gsap.timeline({
            defaults: {
                duration: 0.85,
                ease: "power2.out"
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

    const advanceProject = (direction = "down") => {
        if (!projectData.length) {
            return;
        }

        const nextIndex = (activeIndex + 1) % projectData.length;
        applyProject(nextIndex, {
            direction
        });

        if (
            !timeline ||
            !timeline.scrollTrigger ||
            !timeline.scrollTrigger.isActive()
        ) {
            driver.value = nextIndex;
            lastDriverValue = driver.value;
        }
    };

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
            smoothChildTiming: true,
            scrollTrigger: {
                ...scrollTriggerConfig,
                scrub: SCROLL_SCRUB
            }
        });

        timeline.to(media, {
            width: () => targetWidth(),
            height: () => targetHeight(),
            top: () => pinnedTop(),
            bottom: "auto",
            yPercent: 0,
            paddingLeft: "3%",
            paddingRight: "3%",
            duration: MEDIA_ANIMATION_DURATION,
            ease: SCROLL_EASE,
            onStart: () => {
                driver.value = Math.max(0, activeIndex);
                lastDriverValue = driver.value;
            },
            onComplete: () => {
                setExpandedState(true);
            },
            onReverseComplete: () => {
                setExpandedState(false);
                driver.value = Math.max(0, activeIndex);
                lastDriverValue = driver.value;
            }
        });

        timeline.to(driver, {
            value: projectData.length - 1 + 0.999,
            startAt: () => ({
                value: Math.max(0, activeIndex)
            }),
            duration: Math.max(1, projectData.length),
            ease: "power1.inOut",
            onStart: () => {
                setExpandedState(true);
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

    const inactivityDelay = 5000;
    let inactivityTimer = null;
    let lastInteractionTime = Date.now();

    const scheduleInactivityAdvance = () => {
        window.clearTimeout(inactivityTimer);
        inactivityTimer = window.setTimeout(() => {
            const now = Date.now();
            if (now - lastInteractionTime < inactivityDelay) {
                scheduleInactivityAdvance();
                return;
            }

            if (isMediaExpanded) {
                lastInteractionTime = now;
                scheduleInactivityAdvance();
                return;
            }

            advanceProject("down");
            lastInteractionTime = now;
            scheduleInactivityAdvance();
        }, inactivityDelay);
    };

    const registerInteraction = () => {
        lastInteractionTime = Date.now();
        scheduleInactivityAdvance();
    };

    window.addEventListener("scroll", registerInteraction, {
        passive: true
    });
    window.addEventListener("wheel", registerInteraction, {
        passive: true
    });
    window.addEventListener("touchmove", registerInteraction, {
        passive: true
    });

    scheduleInactivityAdvance();

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
