window.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const homeSection = document.querySelector(".home");
    const introSection = document.querySelector(".intro");
    const INTRO_SEEN_KEY = "introSeen";
    let hasSeenIntro = false;

    try {
        hasSeenIntro = sessionStorage.getItem(INTRO_SEEN_KEY) === "true";
    } catch (error) {
        hasSeenIntro = false;
    }

    const markIntroSeen = () => {
        try {
            sessionStorage.setItem(INTRO_SEEN_KEY, "true");
        } catch (error) {}
    };

    if (!homeSection || !introSection || hasSeenIntro) {
        body.classList.remove("intro-active");
        body.classList.remove("logo-hidden");
        body.classList.add("logo-visible");
        body.style.overflow = "auto";
        body.style.overflowX = "hidden";

        if (homeSection) {
            homeSection.style.top = "0";
        }

        if (introSection) {
            introSection.style.display = "none";
        }

        const alonsoLogoEl = document.querySelector(".alonso");
        if (alonsoLogoEl) {
            alonsoLogoEl.classList.remove("is-hidden");
        }

        window.requestAnimationFrame(() => {
            window.dispatchEvent(new Event("logo:refresh"));
        });

        markIntroSeen();
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

        markIntroSeen();
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
document.addEventListener("DOMContentLoaded", setupProjectSlider);
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
    const headerCopy = gsap.utils.toArray(".home_header-copy");
    const track = media ? media.querySelector(".home_header-media-track") : null;
    const cards = track ? gsap.utils.toArray(".home_header-media-card") : [];

    if (!headerWrapper || !media || !track || !cards.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    const getScrollLength = () => {
        const viewport = window.innerHeight;
        return Math.max(viewport * 1.6, cards.length * viewport * 0.9);
    };

    let timeline = null;
    let pinTrigger = null;
    let isMediaExpanded = false;
    let maxTrackOffset = 0;

    const setExpandedState = (expanded) => {
        isMediaExpanded = expanded;
        media.classList.toggle("home_header-media--expanded", expanded);
    };

    const resetTrackPosition = () => {
        gsap.set(track, {
            x: 0
        });
        maxTrackOffset = 0;
    };

    const clearMediaStyles = () => {
        gsap.set(media, {
            width: "",
            height: "",
            top: "",
            bottom: "",
            yPercent: 0,
            paddingLeft: "",
            paddingRight: ""
        });
        resetTrackPosition();
        setExpandedState(false);
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

    const computeTrackMetrics = () => {
        const availableWidth = media.clientWidth;
        const totalWidth = track.scrollWidth;
        maxTrackOffset = Math.max(0, totalWidth - availableWidth);
        return maxTrackOffset;
    };

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

        if (prefersReducedMotion) {
            applyPinnedState();
            computeTrackMetrics();
            pinTrigger = ScrollTrigger.create({
                ...scrollTriggerConfig,
                onRefresh: () => {
                    applyPinnedState();
                    computeTrackMetrics();
                    resetTrackPosition();
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
                scrub: 1.6
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
            duration: 1.15,
            ease: "power3.out",
            onStart: () => {
                resetTrackPosition();
                setExpandedState(false);
            },
            onComplete: () => {
                setExpandedState(true);
                computeTrackMetrics();
            },
            onReverseComplete: () => {
                clearMediaStyles();
            }
        }).to(track, {
            x: () => -computeTrackMetrics(),
            duration: Math.max(1, cards.length - 1),
            ease: "none",
            onStart: () => {
                computeTrackMetrics();
            }
        }, ">-0.05");
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
    };

    window.addEventListener("logo:refresh", refreshScroll);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
}

function setupProjectSlider() {
    if (!document.body.classList.contains("project-page")) {
        return;
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    if (!gsap.plugins || !gsap.plugins.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const cover = document.querySelector(".project-cover");
    const sliderSection = document.querySelector(".project-slider");
    const media = sliderSection ? sliderSection.querySelector(".project-slider__media") : null;
    const track = media ? media.querySelector(".project-slider__track") : null;
    const cards = track ? gsap.utils.toArray(".project-slider__card") : [];

    if (!cover || !sliderSection || !media || !track || !cards.length) {
        return;
    }

    const nav = document.querySelector("nav");
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let timeline = null;
    let pinTrigger = null;
    let maxTrackOffset = 0;

    const targetWidth = () => {
        const viewportWidth = window.innerWidth;
        const width = viewportWidth * 0.94;
        return Math.min(Math.max(width, 220), viewportWidth);
    };

    const computeTopOffset = () => {
        const navHeight = nav ? nav.offsetHeight : 0;
        return navHeight + window.innerHeight * 0.03;
    };

    const computeHeight = () => {
        const navHeight = nav ? nav.offsetHeight : 0;
        const viewport = window.innerHeight;
        const available = viewport - navHeight - viewport * 0.06;
        return Math.max(available, 320);
    };

    const setExpandedState = (expanded) => {
        media.classList.toggle("project-slider__media--expanded", expanded);
    };

    const resetTrackPosition = () => {
        gsap.set(track, {
            x: 0
        });
        maxTrackOffset = 0;
    };

    const clearMediaStyles = () => {
        gsap.set(media, {
            width: "",
            height: "",
            top: "",
            bottom: "",
            yPercent: 0,
            paddingLeft: "",
            paddingRight: ""
        });
        resetTrackPosition();
        setExpandedState(false);
    };

    const applyPinnedState = () => {
        gsap.set(media, {
            width: targetWidth(),
            height: computeHeight(),
            top: computeTopOffset(),
            bottom: "auto",
            yPercent: 0,
            paddingLeft: "",
            paddingRight: ""
        });
        setExpandedState(true);
    };

    const computeTrackMetrics = () => {
        maxTrackOffset = Math.max(0, track.scrollWidth - media.clientWidth);
        return maxTrackOffset;
    };

    const getProjectedTravel = () => Math.max(0, track.scrollWidth - targetWidth());

    const getScrollLength = () => {
        const viewport = window.innerHeight;
        const travel = getProjectedTravel();
        return Math.max(viewport * 1.2, travel + viewport * 0.5);
    };

    const computeStartOffset = () => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const coverRect = cover.getBoundingClientRect();
        const sliderRect = sliderSection.getBoundingClientRect();
        const coverCenterScroll = scrollY + coverRect.top + coverRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const sliderTopScroll = scrollY + sliderRect.top;
        return Math.round(coverCenterScroll - viewportCenter - sliderTopScroll);
    };

    const formatStartOffset = (offset) => {
        if (Math.abs(offset) < 1) {
            return "top top";
        }
        if (offset > 0) {
            return "top+=" + offset + " top";
        }
        return "top-=" + Math.abs(offset) + " top";
    };

    const scrollTriggerConfig = {
        trigger: sliderSection,
        start: () => formatStartOffset(computeStartOffset()),
        end: () => "+=" + getScrollLength(),
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: clearMediaStyles,
        onKill: clearMediaStyles
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

        if (prefersReducedMotion) {
            applyPinnedState();
            computeTrackMetrics();
            pinTrigger = ScrollTrigger.create({
                ...scrollTriggerConfig,
                onRefresh: () => {
                    applyPinnedState();
                    computeTrackMetrics();
                    resetTrackPosition();
                }
            });
            return;
        }

        timeline = gsap.timeline({
            smoothChildTiming: true,
            scrollTrigger: {
                ...scrollTriggerConfig,
                scrub: 1.4
            }
        });

        timeline.to(media, {
            width: () => targetWidth(),
            height: () => computeHeight(),
            top: () => computeTopOffset(),
            bottom: "auto",
            yPercent: 0,
            paddingLeft: "",
            paddingRight: "",
            duration: 1,
            ease: "power3.out",
            onStart: () => {
                resetTrackPosition();
                setExpandedState(false);
            },
            onComplete: () => {
                setExpandedState(true);
                computeTrackMetrics();
            },
            onReverseComplete: () => {
                clearMediaStyles();
            }
        }).to(track, {
            x: () => -computeTrackMetrics(),
            duration: Math.max(1, cards.length - 1),
            ease: "none",
            onStart: () => {
                computeTrackMetrics();
            }
        }, ">-0.05");
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
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.addEventListener("logo:refresh", refreshScroll);
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

