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

    const setAppReady = () => {
        if (body.classList.contains("intro-active") || body.classList.contains("app-ready")) {
            return;
        }
        body.classList.add("app-ready");
    };

    window.addEventListener("load", setAppReady, {
        once: true
    });

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
        setAppReady();
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
        setAppReady();
    });
});

const cursor = document.querySelector("#Cursor");
const cursorTargetRegistry = new WeakSet();
let xTo = null;
let yTo = null;

const cursorEnterHandler = () => {
    if (!cursor) return;
    gsap.to(cursor, {
        scale: 1.5,
        duration: 0.2,
        overwrite: "auto"
    });
};

const cursorLeaveHandler = () => {
    if (!cursor) return;
    gsap.to(cursor, {
        scale: 0.2,
        duration: 0.2,
        overwrite: "auto"
    });
};

function registerCursorTargets(targets) {
    if (!cursor || !targets) {
        return;
    }

    const list = Array.isArray(targets) ? targets : Array.from(targets);

    list.forEach((target) => {
        if (!target || cursorTargetRegistry.has(target)) {
            return;
        }
        cursorTargetRegistry.add(target);
        target.addEventListener("mouseenter", cursorEnterHandler);
        target.addEventListener("mouseleave", cursorLeaveHandler);
    });
}

if (cursor) {
    xTo = gsap.quickTo(cursor, "x", {
        duration: 0.3,
        ease: "power3"
    });

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

    registerCursorTargets(gsap.utils.toArray("a"));
}

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

const PROJECT_SEQUENCE = Object.freeze([
    { path: "minority.html", label: "Minority" },
    { path: "cofi.html", label: "Cofi" },
    { path: "thompson.html", label: "Thompson" },
    { path: "madrid_fusion.html", label: "Madrid Fusion" },
    { path: "valencia_wines.html", label: "Valencia Wines" },
    { path: "keller.html", label: "Keller" },
    { path: "adn_forum.html", label: "ADN Forum" }
]);

document.addEventListener("DOMContentLoaded", setupHomeHeaderScroll);
document.addEventListener("DOMContentLoaded", setupProjectNavLinks);
document.addEventListener("DOMContentLoaded", setupAlonsoNavigation);
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
    const cards = track ? gsap.utils.toArray(".home_header-media-card:not([data-clone])") : [];

    if (!headerWrapper || !media || !track || !cards.length) {
        return;
    }

    const ensureTrailingClone = () => {
        if (!track || track.querySelector(".home_header-media-card[data-clone='true']")) {
            return;
        }
        const firstCard = cards[0];
        if (!firstCard) return;

        const clone = firstCard.cloneNode(true);
        clone.setAttribute("data-clone", "true");
        clone.classList.add("home_header-media-card--clone");
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;
        clone.style.pointerEvents = "none";
        track.appendChild(clone);
    };

    ensureTrailingClone();

    const getClones = () => track ? Array.from(track.querySelectorAll(".home_header-media-card[data-clone='true']")) : [];

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = document.querySelector("nav");

    const pinnedTop = () => {
        const isMobile = (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) ||
            (window.ScrollTrigger && ScrollTrigger.isTouch);
        if (isMobile) {
            const bottomLimit = copyTop() - window.innerHeight * 0.02;
            return Math.max(window.innerHeight - bottomLimit, 0);
        }
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
            paddingLeft: "",
            paddingRight: "",
            clearProps: "transform" // â† elimina transform inline para que gobierne el CSS
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
        const clones = getClones();
        const previousX = gsap.getProperty(track, "x");
        const safePreviousX = (typeof previousX === "number" && !Number.isNaN(previousX)) ? previousX : 0;
        const cloneDisplayCache = [];

        if (clones.length) {
            clones.forEach((clone, idx) => {
                cloneDisplayCache[idx] = clone.style.display;
                clone.style.display = "none";
            });
        }

        gsap.set(track, {
            x: 0
        });

        const totalWidth = track.scrollWidth;
        let desiredOffset = Math.max(0, totalWidth - availableWidth);
        const lastCard = cards[cards.length - 1];

        if (lastCard) {
            // Ensure the last real card is nearly out of view.
            const mediaRect = media.getBoundingClientRect();
            const lastCardRect = lastCard.getBoundingClientRect();
            const distanceToLeft = Math.max(0, lastCardRect.left - mediaRect.left);
            const cardWidth = lastCardRect.width;
            const almostGoneMargin = Math.max(32, cardWidth * 0.5);
            const almostGoneOffset = Math.min(
                totalWidth,
                distanceToLeft + Math.max(0, cardWidth - almostGoneMargin)
            );

            desiredOffset = Math.max(desiredOffset, almostGoneOffset);
        }

        gsap.set(track, {
            x: safePreviousX
        });

        if (clones.length) {
            clones.forEach((clone, idx) => {
                clone.style.display = cloneDisplayCache[idx];
            });
        }

        maxTrackOffset = desiredOffset;
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

function setupProjectNavLinks() {
    if (!document.body.classList.contains("project-page") || !PROJECT_SEQUENCE.length) {
        return;
    }

    const menu = document.querySelector("nav .menu");
    if (!menu || menu.querySelector("[data-project-nav]")) {
        return;
    }

    const homeLink = menu.querySelector('a[href$="index.html"]');
    if (!homeLink) {
        return;
    }

    const homeHeading = homeLink.querySelector("h3");
    if (homeHeading && homeHeading.textContent.trim() !== "HOME") {
        homeHeading.textContent = "HOME";
        homeHeading.setAttribute("aria-label", "Home");
    }
    homeLink.setAttribute("aria-label", "Home");
    homeLink.title = "Home";

    const rawPath = window.location.pathname.toLowerCase();
    const fileNameWithQuery = rawPath.substring(rawPath.lastIndexOf("/") + 1) || rawPath;
    const fileName = fileNameWithQuery.split("?")[0].split("#")[0];

    const currentIndex = PROJECT_SEQUENCE.findIndex((project) => project.path.toLowerCase() === fileName);
    if (currentIndex === -1) {
        return;
    }

    const previousProject = PROJECT_SEQUENCE[(currentIndex - 1 + PROJECT_SEQUENCE.length) % PROJECT_SEQUENCE.length];
    const nextProject = PROJECT_SEQUENCE[(currentIndex + 1) % PROJECT_SEQUENCE.length];

    const buildLink = (project, role) => {
        const link = document.createElement("a");
        link.href = project.path;
        link.dataset.projectNav = role;

        if (role === "previous") {
            link.rel = "prev";
        } else if (role === "next") {
            link.rel = "next";
        }

        const labelText = role === "previous" ? "PREVIOUS" : "NEXT";
        const h3 = document.createElement("h3");
        h3.textContent = labelText;

        const descriptiveLabel = `${labelText.toLowerCase()} project: ${project.label}`;
        link.setAttribute("aria-label", descriptiveLabel);
        link.title = descriptiveLabel;
        link.appendChild(h3);

        return link;
    };

    const previousLink = buildLink(previousProject, "previous");
    const nextLink = buildLink(nextProject, "next");

    menu.insertBefore(previousLink, homeLink);
    homeLink.insertAdjacentElement("afterend", nextLink);

    registerCursorTargets([previousLink, homeLink, nextLink]);
}

function setupAlonsoNavigation() {
    const alonsoLogoEl = document.querySelector(".alonso");
    if (!alonsoLogoEl) {
        return;
    }

    const handleClick = (event) => {
        if (event.defaultPrevented || event.button !== 0) {
            return;
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        if (event.target.closest("nav") || event.target.closest("a, button, [role=\"button\"]")) {
            return;
        }

        const rect = alonsoLogoEl.getBoundingClientRect();
        const withinHorizontal = event.clientX >= rect.left && event.clientX <= rect.right;
        const withinVertical = event.clientY >= rect.top && event.clientY <= rect.bottom;

        if (!withinHorizontal || !withinVertical) {
            return;
        }

        if (window.getSelection && window.getSelection().toString().length) {
            return;
        }

        event.preventDefault();

        if (document.body.classList.contains("project-page")) {
            window.location.href = "index.html";
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    document.addEventListener("click", handleClick);
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
        const clones = getClones();
        const clonesWidth = clones.reduce((total, clone) => {
            if (!clone) {
                return total;
            }
            const width = clone.getBoundingClientRect().width || clone.offsetWidth || 0;
            return total + width;
        }, 0);

        const effectiveScrollWidth = Math.max(0, track.scrollWidth - clonesWidth);
        maxTrackOffset = Math.max(0, effectiveScrollWidth - media.clientWidth);
        return maxTrackOffset;
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

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // 1) Primer h3 del nav
  const firstH3 = nav.querySelector('h3');

  // 2) Ãšltimo div que contenga un h3 (buscando desde el final)
  const divs = Array.from(nav.querySelectorAll('div'));
  let lastH3 = null;
  for (let i = divs.length - 1; i >= 0; i--) {
    const h3 = divs[i].querySelector('h3');
    if (h3) { lastH3 = h3; break; }
  }

  // 3) Todos los <a> dentro del nav
  const anchors = Array.from(nav.querySelectorAll('a'));

  // Guardar textos/estilos originales para restaurar
  if (firstH3 && !firstH3.dataset.originalText) {
    firstH3.dataset.originalText = firstH3.textContent.trim();
  }
  if (lastH3 && !lastH3.dataset.originalText) {
    lastH3.dataset.originalText = lastH3.textContent.trim();
  }
  anchors.forEach(a => {
    if (!a.dataset.originalTextDecoration) {
      a.dataset.originalTextDecoration = a.style.textDecoration || '';
    }
  });

  const mql = window.matchMedia('(max-width: 900px)');
  const sameTarget = firstH3 && lastH3 && firstH3 === lastH3;

  const apply = () => {
    if (mql.matches) {
      // â‰¤ 900px
      if (firstH3 && firstH3.textContent.trim() !== 'Madrid -') {
        firstH3.textContent = 'Madrid';
        firstH3.setAttribute('aria-label', 'Madrid');
      }
      // Si por casualidad el primer y el Ãºltimo h3 son el mismo elemento, priorizamos "Madrid -"
      if (lastH3 && !sameTarget && lastH3.textContent.trim() !== 'art director') {
        lastH3.textContent = 'art director';
        lastH3.setAttribute('aria-label', 'art director');
      }
      anchors.forEach(a => { a.style.textDecoration = 'underline'; });
    } else {
      // > 900px: restaurar
      if (firstH3 && firstH3.dataset.originalText) {
        firstH3.textContent = firstH3.dataset.originalText;
        firstH3.setAttribute('aria-label', firstH3.dataset.originalText);
      }
      if (lastH3 && lastH3.dataset.originalText) {
        lastH3.textContent = lastH3.dataset.originalText;
        lastH3.setAttribute('aria-label', lastH3.dataset.originalText);
      }
      anchors.forEach(a => {
        a.style.textDecoration = a.dataset.originalTextDecoration || '';
      });
    }
  };

  // Inicial y en cambios de tamaÃ±o
  apply();
  if (mql.addEventListener) {
    mql.addEventListener('change', apply);
  } else {
    mql.addListener(apply); // Safari antiguo
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // --- Targets ---
  const firstH3 = nav.querySelector('h3');
  const divs = Array.from(nav.querySelectorAll('div'));
  let lastH3 = null;
  for (let i = divs.length - 1; i >= 0; i--) {
    const h3 = divs[i].querySelector('h3');
    if (h3) { lastH3 = h3; break; }
  }
  const anchors = Array.from(nav.querySelectorAll('a'));
  const alonsoEl = document.querySelector('.alonso');
  const pair = [firstH3, lastH3].filter(Boolean);

  // Estado original para restaurar ciertos estilos/textos
  if (lastH3 && !lastH3.dataset.originalText) {
    lastH3.dataset.originalText = lastH3.textContent.trim();
  }
  anchors.forEach(a => {
    if (!a.dataset.originalTextDecoration) {
      a.dataset.originalTextDecoration = a.style.textDecoration || '';
    }
  });
  pair.forEach(h => {
    if (!h) return;
    const cs = getComputedStyle(h);
    if (!h.dataset.originalFontSize) h.dataset.originalFontSize = cs.fontSize;
  });

  const mql = window.matchMedia('(max-width: 900px)');
  let alonsoVisible = true; // asumimos visible hasta medir
  let ro = null;
  let rafId = null;

  // --- Core ---
  function desiredFirstH3Text(isVisible){
    if (mql.matches) {
      // â‰¤ 900px
      return isVisible ? 'madrid' : 'alonso santamaría';
    }
    // > 900px
    return isVisible ? 'based in madrid' : 'alonso santamaría';
  }

  function apply(){
    // 1) Primer h3: segÃºn visibilidad de .alonso + breakpoint
    if (firstH3) {
      const next = desiredFirstH3Text(alonsoVisible);
      if (firstH3.textContent.trim() !== next) {
        firstH3.textContent = next;
        firstH3.setAttribute('aria-label', next);
      }
    }

    // 2) Ãšltimo h3 del Ãºltimo div: solo â‰¤ 900px -> "art director", >900px restaura
    if (lastH3 && (!firstH3 || firstH3 !== lastH3)) {
      if (mql.matches) {
        if (lastH3.textContent.trim() !== 'art director') {
          lastH3.textContent = 'art director';
          lastH3.setAttribute('aria-label', 'art director');
        }
      } else if (lastH3.dataset.originalText && lastH3.textContent.trim() !== lastH3.dataset.originalText) {
        lastH3.textContent = lastH3.dataset.originalText;
        lastH3.setAttribute('aria-label', lastH3.dataset.originalText);
      }
    }

    // 3) Subrayado de anchors en â‰¤ 900px
    anchors.forEach(a => {
      a.style.textDecoration = mql.matches ? 'underline' : (a.dataset.originalTextDecoration || '');
    });

    // 4) Igualar lÃ­neas de ambos h3 en â‰¤ 900px
    if (mql.matches) {
      equalizeLinesMin(pair);
      if (!ro) {
        ro = new ResizeObserver(() => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => equalizeLinesMin(pair));
        });
        ro.observe(document.documentElement);
      }
    } else {
      // Restablece font-size si se tocÃ³
      pair.forEach(h => { if (h) h.style.fontSize = h.dataset.originalFontSize || ''; });
      if (ro) { ro.disconnect(); ro = null; }
    }
  }

  // --- Observers & eventos ---
  // Visibilidad inicial de .alonso
  alonsoVisible = isInViewport(alonsoEl);
  apply();

  // IntersectionObserver para .alonso
  if (alonsoEl) {
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      alonsoVisible = !!(e && e.isIntersecting);
      // re-aplica en el siguiente frame para evitar parpadeos
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(apply);
    }, { threshold: 0.01 });
    io.observe(alonsoEl);
  }

  // Cambios de breakpoint
  if (mql.addEventListener) mql.addEventListener('change', apply);
  else mql.addListener(apply); // Safari antiguo

  // --- Utils ---
  function isInViewport(el){
    if (!el) return true; // si no existe, tratamos como visible
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight);
  }

  function equalizeLinesMin(nodes){
    const hs = nodes.filter(Boolean);
    if (hs.length < 2) return;

    // Solo modificamos el font-size en â‰¤ 900px
    hs.forEach(h => { h.style.fontSize = h.dataset.originalFontSize || ''; });

    const lines = hs.map(countLines);
    const target = Math.min(...lines);
    hs.forEach((h, i) => { if (lines[i] > target) fitToLines(h, target); });

    // Segundo pase suave si aÃºn difiere
    const lines2 = hs.map(countLines);
    const minAfter = Math.min(...lines2), maxAfter = Math.max(...lines2);
    if (minAfter !== maxAfter) {
      hs.forEach((h, i) => { if (lines2[i] > minAfter) fitToLines(h, minAfter); });
    }
  }

  function countLines(el){
    const cs = getComputedStyle(el);
    const h = el.getBoundingClientRect().height;
    let lh = parseFloat(cs.lineHeight);
    if (isNaN(lh) || lh <= 0) {
      const fs = parseFloat(cs.fontSize) || 16;
      lh = fs * 1.2; // fallback
    }
    return Math.max(1, Math.round(h / lh));
  }

  function fitToLines(el, targetLines){
    const cs = getComputedStyle(el);
    const original = parseFloat(el.dataset.originalFontSize || cs.fontSize) || 16;
    let lo = Math.max(10, original * 0.55);
    let hi = original, best = hi;

    el.style.fontSize = hi + 'px';
    if (countLines(el) <= targetLines) return;

    for (let i = 0; i < 14; i++){
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      const lines = countLines(el);
      if (lines <= targetLines){ best = mid; lo = mid; }
      else { hi = mid; }
    }
    el.style.fontSize = best + 'px';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // â€”â€”â€” Targets â€”â€”â€”
  const firstH3 = nav.querySelector('h3');
  const divs = Array.from(nav.querySelectorAll('div'));
  let lastH3 = null;
  for (let i = divs.length - 1; i >= 0; i--) {
    const h3 = divs[i].querySelector('h3');
    if (h3) { lastH3 = h3; break; }
  }
  const anchors = Array.from(nav.querySelectorAll('a'));
  const alonsoEl = document.querySelector('.alonso');
  const pair = [firstH3, lastH3].filter(Boolean);
  const mql = window.matchMedia('(max-width: 900px)');

  // â€”â€”â€” Estado original â€”â€”â€”
  if (lastH3 && !lastH3.dataset.originalText) {
    lastH3.dataset.originalText = lastH3.textContent.trim();
  }
  anchors.forEach(a => {
    if (!a.dataset.originalTextDecoration) {
      a.dataset.originalTextDecoration = a.style.textDecoration || '';
    }
  });
  pair.forEach(h => {
    if (!h) return;
    const cs = getComputedStyle(h);
    if (!h.dataset.originalFontSize) h.dataset.originalFontSize = cs.fontSize;
  });

  // â€”â€”â€” Preparar crossfade dentro del primer h3 â€”â€”â€”
  let front, back; // spans
  if (firstH3) {
    const holder = document.createElement('span');
    holder.className = 'h3-crossfade';
    // capas
    front = document.createElement('span'); front.className = 'layer front';
    back  = document.createElement('span'); back.className  = 'layer back';
    // mover contenido original al front
    const original = (firstH3.textContent || '').trim();
    front.textContent = original || '';
    back.textContent  = '';
    // limpiar y aÃ±adir capas
    firstH3.textContent = '';
    firstH3.appendChild(holder);
    holder.appendChild(front);
    holder.appendChild(back);
    // opacidades iniciales
    front.style.opacity = '1';
    back.style.opacity  = '0';
    // accesibilidad
    firstH3.setAttribute('aria-live', 'polite');
  }

  // â€”â€”â€” Helpers de texto â€”â€”â€”
  function labelWhenVisible(){ return mql.matches ? 'madrid' : 'based in madrid'; }
  function labelWhenHidden(){ return 'alonso santamarÃ­a'; }

  // Devuelve ratio visible (0â€“1); si no hay .alonso, tratamos como 1 (visible)
  let alonsoRatio = alonsoEl ? isInViewportRatio(alonsoEl) : 1;

  // Aplica el estado visual del crossfade en el primer h3 segÃºn ratio actual
  function renderFirstH3ByRatio(){
    if (!firstH3) return;

    const showWhenVisible = labelWhenVisible();
    const showWhenHidden  = labelWhenHidden();

    // Â¿QuÃ© texto debe estar delante (en flujo) y cuÃ¡l detrÃ¡s (overlay)?
    // Si alonso estÃ¡ mÃ¡s visible que no (ratio >= 0.5), el "delante" es el visible; si no, es el hidden.
    const frontShouldBe = (alonsoRatio >= 0.5) ? showWhenVisible : showWhenHidden;
    const backShouldBe  = (alonsoRatio >= 0.5) ? showWhenHidden  : showWhenVisible;

    // Aseguramos que cada capa tenga el texto correcto
    if (front && front.textContent.trim() !== frontShouldBe) front.textContent = frontShouldBe;
    if (back  && back.textContent.trim()  !== backShouldBe)  back.textContent  = backShouldBe;

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduce) {
      // Sin animaciÃ³n: cambio duro a mitad
      const frontOpacity = (alonsoRatio >= 0.5) ? 1 : 1;
      const backOpacity  = (alonsoRatio >= 0.5) ? 0 : 0;
      front.style.opacity = String(frontOpacity);
      back.style.opacity  = String(backOpacity);
      firstH3.setAttribute('aria-label', frontShouldBe);
    } else {
      // Crossfade continuo: mientras .alonso desaparece, back pasa de 0â†’1
      const progress = (alonsoRatio >= 0.5)
        ? (1 - normalize(alonsoRatio, 0.5, 1))   // de 0 cuando 1â†’0.5
        : (normalize(0.5 - alonsoRatio, 0, 0.5)); // de 0 cuando 0.5â†’0

      // La capa de delante siempre opaca inversa a la de atrÃ¡s
      back.style.opacity  = String(progress);
      front.style.opacity = String(1 - progress);

      // Accesibilidad: cuando el back domina (>0.5), actualizamos aria-label
      const ariaText = (progress >= 0.5) ? backShouldBe : frontShouldBe;
      firstH3.setAttribute('aria-label', ariaText);
    }
  }

  function normalize(x, a, b){
    return Math.min(1, Math.max(0, (x - a) / (b - a || 1)));
  }

  // â€”â€”â€” Ãšltimo h3 y subrayado â€”â€”â€”
  function applyAuxUI(){
    // "art director" en â‰¤ 900px
    if (lastH3 && (!firstH3 || firstH3 !== lastH3)) {
      if (mql.matches) {
        if (lastH3.textContent.trim() !== 'art director') {
          lastH3.textContent = 'art director';
          lastH3.setAttribute('aria-label', 'art director');
        }
      } else if (lastH3.dataset.originalText && lastH3.textContent.trim() !== lastH3.dataset.originalText) {
        lastH3.textContent = lastH3.dataset.originalText;
        lastH3.setAttribute('aria-label', lastH3.dataset.originalText);
      }
    }
    // Subrayado en â‰¤ 900px
    anchors.forEach(a => {
      a.style.textDecoration = mql.matches ? 'underline' : (a.dataset.originalTextDecoration || '');
    });
  }

  // â€”â€”â€” Igualar lÃ­neas en â‰¤ 900px â€”â€”â€”
  let ro = null, rafId = null;
  function equalizeIfNeeded(){
    if (!mql.matches) {
      pair.forEach(h => { if (h) h.style.fontSize = h.dataset.originalFontSize || ''; });
      if (ro) { ro.disconnect(); ro = null; }
      return;
    }
    equalizeLinesMin(pair);
    if (!ro) {
      ro = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => equalizeLinesMin(pair));
      });
      ro.observe(document.documentElement);
    }
  }

  // â€”â€”â€” Observers â€”â€”â€”
  if (alonsoEl) {
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      alonsoRatio = e ? e.intersectionRatio : 1;
      renderFirstH3ByRatio();   // â† actualiza durante la desapariciÃ³n
      // re-igualar lÃ­neas al final del frame (por si cambiÃ³ el layout)
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => equalizeIfNeeded());
    }, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    });
    io.observe(alonsoEl);
  }

  // Breakpoint
  if (mql.addEventListener) mql.addEventListener('change', () => {
    renderFirstH3ByRatio();
    applyAuxUI();
    equalizeIfNeeded();
  });
  else mql.addListener(() => { renderFirstH3ByRatio(); applyAuxUI(); equalizeIfNeeded(); });

  // Primera aplicaciÃ³n
  renderFirstH3ByRatio();
  applyAuxUI();
  equalizeIfNeeded();

  // â€”â€”â€” Utils de medida â€”â€”â€”
  function isInViewportRatio(el){
    if (!el) return 1;
    const r = el.getBoundingClientRect();
    const vh = (window.innerHeight || document.documentElement.clientHeight);
    const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    const height = Math.max(1, r.height || 1);
    return Math.max(0, Math.min(1, visible / height));
  }

  function equalizeLinesMin(nodes){
    const hs = nodes.filter(Boolean);
    if (hs.length < 2) return;

    // Reset
    hs.forEach(h => { h.style.fontSize = h.dataset.originalFontSize || ''; });

    const lines = hs.map(countLines);
    const target = Math.min(...lines);
    hs.forEach((h, i) => { if (lines[i] > target) fitToLines(h, target); });

    const lines2 = hs.map(countLines);
    const minAfter = Math.min(...lines2), maxAfter = Math.max(...lines2);
    if (minAfter !== maxAfter) {
      hs.forEach((h, i) => { if (lines2[i] > minAfter) fitToLines(h, minAfter); });
    }
  }

  function countLines(el){
    const cs = getComputedStyle(el);
    const h = el.getBoundingClientRect().height;
    let lh = parseFloat(cs.lineHeight);
    if (isNaN(lh) || lh <= 0) {
      const fs = parseFloat(cs.fontSize) || 16;
      lh = fs * 1.2;
    }
    return Math.max(1, Math.round(h / lh));
  }

  function fitToLines(el, targetLines){
    const cs = getComputedStyle(el);
    const original = parseFloat(el.dataset.originalFontSize || cs.fontSize) || 16;
    let lo = Math.max(10, original * 0.55);
    let hi = original, best = hi;

    el.style.fontSize = hi + 'px';
    if (countLines(el) <= targetLines) return;

    for (let i = 0; i < 14; i++){
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      const lines = countLines(el);
      if (lines <= targetLines){ best = mid; lo = mid; }
      else { hi = mid; }
    }
    el.style.fontSize = best + 'px';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const roots = Array.from(document.querySelectorAll('.home_header-copy'));
  if (!roots.length) return;

  roots.forEach((root) => {
    const blocks = collectTextBlocks(root);
    blocks.forEach((block) => {
      preventWidow(block, 2);
      ensureLastWordSpan(block);
    });
  });
});

/* â€”â€”â€” Helpers â€”â€”â€” */
function collectTextBlocks(root){
  const selectors = 'p,h1,h2,h3,h4,h5,h6,li,blockquote';
  const inner = Array.from(root.querySelectorAll(selectors));
  const includeRoot = root.matches(selectors) ? [root] : [];
  const candidates = includeRoot.concat(inner);
  return candidates.length ? candidates : [root];
}

function preventWidow(el, keepWords = 2){
  const existing = el.querySelector('.no-widow');
  if (existing) return existing;
  const text = el.textContent || '';
  if (text.trim().split(/\s+/).length <= keepWords) return null;

  try {
    return wrapLastWords(el, keepWords);
  } catch {
    const lastText = getLastTextNode(el);
    if (lastText){
      lastText.nodeValue = lastText.nodeValue.replace(/\s+(\S+)\s*$/, '\u00A0$1');
    }
    return null;
  }
}

function ensureLastWordSpan(el){
  if (!el) return null;
  const host = el.querySelector('.no-widow') || el;
  if (!host) return null;
  const existing = host.querySelector('.home_header-copy-last');
  if (existing) return existing;

  return wrapLastWords(host, 1, {
    className: 'home_header-copy-last',
    whiteSpace: 'inherit',
    copyFrom: el,
    skipIfExistsSelector: '.home_header-copy-last'
  });
}

function wrapLastWords(el, keepWords, options = {}){
  const {
    className = 'no-widow',
    whiteSpace = 'nowrap',
    copyFrom = el,
    skipIfExistsSelector
  } = options;

  if (skipIfExistsSelector){
    const existing = el.querySelector(skipIfExistsSelector);
    if (existing) return existing;
  }

  const nodes = getTextNodes(el);
  if (!nodes.length) return null;

  // Fin (Ãºltimo carÃ¡cter no blanco)
  let endNode=null, endOffset=0;
  for (let i = nodes.length - 1; i >= 0; i--){
    const t = nodes[i].nodeValue, m = t.match(/\S(?=[\s]*$)/);
    if (m){ endNode = nodes[i]; endOffset = t.lastIndexOf(m[0]) + 1; break; }
  }
  if (!endNode) return null;

  // Inicio (comienzo de la palabra N desde el final)
  let wordsSeen=0, inWord=false, startNode=null, startOffset=0;
  outer: for (let i = nodes.length - 1; i >= 0; i--){
    const t = nodes[i].nodeValue;
    for (let j = (nodes[i] === endNode ? endOffset - 1 : t.length - 1); j >= 0; j--){
      const ch = t[j];
      if (/\S/.test(ch)){
        if (!inWord){
          inWord = true; wordsSeen++;
          if (wordsSeen === keepWords){
            let k = j; while (k >= 0 && /\S/.test(t[k])) k--;
            startNode = nodes[i]; startOffset = k + 1;
            break outer;
          }
        }
      } else { inWord = false; }
    }
  }
  if (!startNode) return null;

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);

  const span = document.createElement('span');
  if (className) span.className = className;
  if (typeof whiteSpace === 'string' && whiteSpace.length){
    span.style.whiteSpace = whiteSpace;
  } else if (whiteSpace === null){
    span.style.removeProperty('white-space');
  }
  copyTypography(copyFrom, span);          // ðŸ‘ˆ Copia tipografÃ­a exacta del contenedor
  range.surroundContents(span);
  return span;
}

function copyTypography(fromEl, toEl){
  if (!fromEl || !toEl) return;
  const cs = getComputedStyle(fromEl);
  toEl.style.font                 = cs.font;
  toEl.style.letterSpacing        = cs.letterSpacing;
  toEl.style.textTransform        = cs.textTransform;
  toEl.style.wordSpacing          = cs.wordSpacing;
  toEl.style.fontFeatureSettings  = cs.fontFeatureSettings;
  toEl.style.fontVariationSettings= cs.fontVariationSettings;
  toEl.style.lineHeight           = cs.lineHeight;
  toEl.style.fontKerning          = cs.fontKerning;
  toEl.style.fontStretch          = cs.fontStretch;
  toEl.style.fontVariantCaps      = cs.fontVariantCaps;
  toEl.style.fontVariantLigatures = cs.fontVariantLigatures;
}

function getTextNodes(el){
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: n => /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  });
  const nodes = [];
  while (tw.nextNode()) nodes.push(tw.currentNode);
  return nodes;
}

function getLastTextNode(el){
  const nodes = getTextNodes(el);
  return nodes[nodes.length - 1] || null;
}

