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
            clearProps: "transform" // ← elimina transform inline para que gobierne el CSS
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

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // 1) Primer h3 del nav
  const firstH3 = nav.querySelector('h3');

  // 2) Último div que contenga un h3 (buscando desde el final)
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
      // ≤ 900px
      if (firstH3 && firstH3.textContent.trim() !== 'Madrid -') {
        firstH3.textContent = 'Madrid';
        firstH3.setAttribute('aria-label', 'Madrid');
      }
      // Si por casualidad el primer y el último h3 son el mismo elemento, priorizamos "Madrid -"
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

  // Inicial y en cambios de tamaño
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
      // ≤ 900px
      return isVisible ? 'madrid' : 'alonso santamaría';
    }
    // > 900px
    return isVisible ? 'based in madrid' : 'alonso santamaría';
  }

  function apply(){
    // 1) Primer h3: según visibilidad de .alonso + breakpoint
    if (firstH3) {
      const next = desiredFirstH3Text(alonsoVisible);
      if (firstH3.textContent.trim() !== next) {
        firstH3.textContent = next;
        firstH3.setAttribute('aria-label', next);
      }
    }

    // 2) Último h3 del último div: solo ≤ 900px -> "art director", >900px restaura
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

    // 3) Subrayado de anchors en ≤ 900px
    anchors.forEach(a => {
      a.style.textDecoration = mql.matches ? 'underline' : (a.dataset.originalTextDecoration || '');
    });

    // 4) Igualar líneas de ambos h3 en ≤ 900px
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
      // Restablece font-size si se tocó
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

    // Solo modificamos el font-size en ≤ 900px
    hs.forEach(h => { h.style.fontSize = h.dataset.originalFontSize || ''; });

    const lines = hs.map(countLines);
    const target = Math.min(...lines);
    hs.forEach((h, i) => { if (lines[i] > target) fitToLines(h, target); });

    // Segundo pase suave si aún difiere
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

  // ——— Targets ———
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

  // ——— Estado original ———
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

  // ——— Preparar crossfade dentro del primer h3 ———
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
    // limpiar y añadir capas
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

  // ——— Helpers de texto ———
  function labelWhenVisible(){ return mql.matches ? 'madrid' : 'based in madrid'; }
  function labelWhenHidden(){ return 'alonso santamaría'; }

  // Devuelve ratio visible (0–1); si no hay .alonso, tratamos como 1 (visible)
  let alonsoRatio = alonsoEl ? isInViewportRatio(alonsoEl) : 1;

  // Aplica el estado visual del crossfade en el primer h3 según ratio actual
  function renderFirstH3ByRatio(){
    if (!firstH3) return;

    const showWhenVisible = labelWhenVisible();
    const showWhenHidden  = labelWhenHidden();

    // ¿Qué texto debe estar delante (en flujo) y cuál detrás (overlay)?
    // Si alonso está más visible que no (ratio >= 0.5), el "delante" es el visible; si no, es el hidden.
    const frontShouldBe = (alonsoRatio >= 0.5) ? showWhenVisible : showWhenHidden;
    const backShouldBe  = (alonsoRatio >= 0.5) ? showWhenHidden  : showWhenVisible;

    // Aseguramos que cada capa tenga el texto correcto
    if (front && front.textContent.trim() !== frontShouldBe) front.textContent = frontShouldBe;
    if (back  && back.textContent.trim()  !== backShouldBe)  back.textContent  = backShouldBe;

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduce) {
      // Sin animación: cambio duro a mitad
      const frontOpacity = (alonsoRatio >= 0.5) ? 1 : 1;
      const backOpacity  = (alonsoRatio >= 0.5) ? 0 : 0;
      front.style.opacity = String(frontOpacity);
      back.style.opacity  = String(backOpacity);
      firstH3.setAttribute('aria-label', frontShouldBe);
    } else {
      // Crossfade continuo: mientras .alonso desaparece, back pasa de 0→1
      const progress = (alonsoRatio >= 0.5)
        ? (1 - normalize(alonsoRatio, 0.5, 1))   // de 0 cuando 1→0.5
        : (normalize(0.5 - alonsoRatio, 0, 0.5)); // de 0 cuando 0.5→0

      // La capa de delante siempre opaca inversa a la de atrás
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

  // ——— Último h3 y subrayado ———
  function applyAuxUI(){
    // "art director" en ≤ 900px
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
    // Subrayado en ≤ 900px
    anchors.forEach(a => {
      a.style.textDecoration = mql.matches ? 'underline' : (a.dataset.originalTextDecoration || '');
    });
  }

  // ——— Igualar líneas en ≤ 900px ———
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

  // ——— Observers ———
  if (alonsoEl) {
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      alonsoRatio = e ? e.intersectionRatio : 1;
      renderFirstH3ByRatio();   // ← actualiza durante la desaparición
      // re-igualar líneas al final del frame (por si cambió el layout)
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

  // Primera aplicación
  renderFirstH3ByRatio();
  applyAuxUI();
  equalizeIfNeeded();

  // ——— Utils de medida ———
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
  const root = document.querySelector('.home_header-copy');
  if (!root) return;

  const blocks = collectTextBlocks(root);
  blocks.forEach(b => preventWidow(b, 2));
});

/* ——— Helpers ——— */
function collectTextBlocks(root){
  const selectors = 'p,h1,h2,h3,h4,h5,h6,li,blockquote';
  const inner = Array.from(root.querySelectorAll(selectors));
  const includeRoot = root.matches(selectors) ? [root] : [];
  const candidates = includeRoot.concat(inner);
  return candidates.length ? candidates : [root];
}

function preventWidow(el, keepWords = 2){
  if (el.querySelector('.no-widow')) return;
  const text = el.textContent || '';
  if (text.trim().split(/\s+/).length <= keepWords) return;

  try {
    wrapLastWords(el, keepWords);
  } catch {
    const lastText = getLastTextNode(el);
    if (lastText){
      lastText.nodeValue = lastText.nodeValue.replace(/\s+(\S+)\s*$/, '\u00A0$1');
    }
  }
}

function wrapLastWords(el, keepWords){
  const nodes = getTextNodes(el);
  if (!nodes.length) return;

  // Fin (último carácter no blanco)
  let endNode=null, endOffset=0;
  for (let i = nodes.length - 1; i >= 0; i--){
    const t = nodes[i].nodeValue, m = t.match(/\S(?=[\s]*$)/);
    if (m){ endNode = nodes[i]; endOffset = t.lastIndexOf(m[0]) + 1; break; }
  }
  if (!endNode) return;

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
  if (!startNode) return;

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);

  const span = document.createElement('span');
  span.className = 'no-widow';
  span.style.whiteSpace = 'nowrap';
  copyTypography(el, span);          // 👈 Copia tipografía exacta del contenedor
  range.surroundContents(span);
}

function copyTypography(fromEl, toEl){
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