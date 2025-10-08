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

document.addEventListener("DOMContentLoaded", () => {
    initSpiral().catch((error) => {
        console.error("Error al inicializar la escena de la espiral:", error);
    });
});

async function initSpiral() {
    if (typeof THREE === "undefined") {
        console.warn("Three.js no está disponible, se omite la escena de la espiral.");
        return;
    }

    const container = document.querySelector(".spiral");
    const canvas = container ? container.querySelector(".spiral__canvas") : null;

    if (!container || !canvas) {
        return;
    }

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if ("outputEncoding" in renderer && THREE.sRGBEncoding) {
        renderer.outputEncoding = THREE.sRGBEncoding;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    if (THREE.ACESFilmicToneMapping) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.28;
    }

    if ("physicallyCorrectLights" in renderer) {
        renderer.physicallyCorrectLights = true;
    }

    const scene = new THREE.Scene();

    const RoomEnvironment = window.THREE_RoomEnvironment;
    if (RoomEnvironment) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const environmentTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = environmentTexture;
        scene.background = null;
        pmremGenerator.dispose();
    }

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
    camera.position.set(0, 18, 95);
    camera.lookAt(0, 0, 0);

    setupStudioLighting(scene);

    const textures = await loadMaterialTextures(renderer);
    const baseMaterial = buildMaterial(textures, scene.environment ? 0.95 : 0.85);

    const TRAVEL_SPEED = 0.04;
    const ORBIT_SPEED = 0.85;

    const geometries = [
        () => new THREE.SphereGeometry(2.4, 96, 96),
        () => new THREE.SphereGeometry(2.1, 64, 64),
        () => new THREE.TorusGeometry(2, 0.7, 72, 144),
        () => new THREE.TorusGeometry(1.6, 0.55, 64, 128)
    ];

    const chooseGeometry = () => {
        const factory = geometries[Math.floor(Math.random() * geometries.length)];
        return factory();
    };

    const objects = [];
    const objectCount = 24;

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointerIntersection = new THREE.Vector3();
    const pointerDelta = new THREE.Vector3();
    const springForce = new THREE.Vector3();
    const upVector = new THREE.Vector3(0, 1, 0);

    let pointerActive = false;

    const pointerInfluenceRadius = 26;
    const pointerPushStrength = 110;
    const springStrength = 22;
    const dampingCoeff = 5.5;
    const maxDeviation = 14;
    const maxDeviationSq = maxDeviation * maxDeviation;
    const collisionIterations = 4;
    const highlightPalette = [
        0x22282f,
        0x27221f,
        0x2a231c,
        0x1f2a1f,
        0x2d1f2d,
        0x333333
    ];

    let curve;
    let frames;
    const frameSegments = 600;

    const tempPoint = new THREE.Vector3();
    const tempTangent = new THREE.Vector3();
    const tempNormal = new THREE.Vector3();
    const tempBinormal = new THREE.Vector3();
    const tempOffset = new THREE.Vector3();
    const collisionDelta = new THREE.Vector3();
    const collisionPush = new THREE.Vector3();

    const buildCurve = () => {
        const points = [];
        const segmentSteps = 800;
        const loops = 5.5;
        const baseRadius = 3.5;
        const radiusGrowth = 11;
        const viewportRatio = Math.max(window.innerWidth / Math.max(window.innerHeight, 1), 1);
        const length = 110 * viewportRatio;

        for (let i = 0; i <= segmentSteps; i++) {
            const t = i / segmentSteps;
            const angle = t * loops * Math.PI * 2;
            const radius = baseRadius + radiusGrowth * t;
            const x = (t - 0.5) * length;
            const y = Math.cos(angle) * radius * 0.35;
            const z = Math.sin(angle) * radius;
            points.push(new THREE.Vector3(x, y, z));
        }

        return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.05);
    };

    const rebuildCurve = () => {
        curve = buildCurve();
        frames = curve.computeFrenetFrames(frameSegments, false);
        if (curve) {
            curve.getPointAt(0.5, tempPoint);
            pointerPlane.constant = -tempPoint.y;
        }
    };

    const getInterpolatedFrame = (u, normalTarget, binormalTarget) => {
        const cappedU = THREE.MathUtils.euclideanModulo(u, 1);
        const maxIndex = frames.normals.length - 1;
        const scaled = cappedU * maxIndex;
        const index = Math.floor(scaled);
        const lerpAlpha = scaled - index;
        const nextIndex = Math.min(index + 1, maxIndex);

        normalTarget
            .copy(frames.normals[index])
            .lerp(frames.normals[nextIndex], lerpAlpha)
            .normalize();
        binormalTarget
            .copy(frames.binormals[index])
            .lerp(frames.binormals[nextIndex], lerpAlpha)
            .normalize();
    };

    const clampInteraction = (data) => {
        const offsetLengthSq = data.interactionOffset.lengthSq();
        if (offsetLengthSq > maxDeviationSq) {
            data.interactionOffset.multiplyScalar(Math.sqrt(maxDeviationSq / offsetLengthSq));
        }
    };

    const createObject = (index) => {
        const geometry = chooseGeometry();
        geometry.center();
        geometry.computeBoundingSphere();

        const material = baseMaterial.clone();
        const baseColor = material.color.clone();

        const mesh = new THREE.Mesh(geometry, material);
        const baseScale = THREE.MathUtils.randFloat(1.6, 2.6);
        mesh.scale.setScalar(baseScale);

        const baseRadius = geometry.boundingSphere
            ? geometry.boundingSphere.radius * baseScale
            : baseScale * 1.2;

        scene.add(mesh);

        return {
            mesh,
            material,
            travelSpeed: TRAVEL_SPEED,
            orbitSpeed: ORBIT_SPEED,
            orbitRadius: THREE.MathUtils.randFloat(3.3, 4.9),
            orbitPhase: ((index / objectCount) * Math.PI * 2) + THREE.MathUtils.randFloatSpread(Math.PI * 0.06),
            travelOffset: (index / objectCount) % 1,
            spinVelocity: (Math.random() < 0.5 ? -1 : 1) * THREE.MathUtils.randFloat(0.45, 0.75),
            basePosition: new THREE.Vector3(),
            interactionOffset: new THREE.Vector3(),
            interactionVelocity: new THREE.Vector3(),
            collisionRadius: baseRadius * 0.9,
            baseColor,
            highlightColor: new THREE.Color(highlightPalette[Math.floor(Math.random() * highlightPalette.length)]),
            highlightStrength: 0,
            colorBuffer: new THREE.Color(),
            isPointerNear: false
        };
    };

    for (let i = 0; i < objectCount; i++) {
        objects.push(createObject(i));
    }

    const updatePointer = (event) => {
        const rect = container.getBoundingClientRect();
        pointerNDC.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        pointerNDC.y = -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
        pointerActive = true;
    };

    const deactivatePointer = () => {
        pointerActive = false;
    };

    container.addEventListener("pointerenter", updatePointer);
    container.addEventListener("pointermove", updatePointer);
    container.addEventListener("pointerleave", deactivatePointer);
    window.addEventListener("blur", deactivatePointer);

    const resizeRenderer = () => {
        const rect = container.getBoundingClientRect();
        const width = rect.width || window.innerWidth;
        const height = rect.height || window.innerHeight;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    rebuildCurve();
    resizeRenderer();

    const clock = new THREE.Clock();
    let elapsed = 0;

    const updateObjects = (time, delta) => {
        const dampingFactor = Math.exp(-dampingCoeff * delta);
        const pointerStrengthStep = pointerPushStrength * delta;
        let pointerHasWorld = false;

        if (pointerActive) {
            raycaster.setFromCamera(pointerNDC, camera);
            pointerHasWorld = Boolean(raycaster.ray.intersectPlane(pointerPlane, pointerIntersection));
        }

        const highlightRadius = pointerInfluenceRadius * 0.42;

        objects.forEach((data) => {
            data.isPointerNear = false;
            const travelProgress = (time * data.travelSpeed + data.travelOffset) % 1;
            const orbitAngle = time * data.orbitSpeed + data.orbitPhase;

            curve.getPointAt(travelProgress, tempPoint);
            curve.getTangentAt(travelProgress, tempTangent).normalize();

            getInterpolatedFrame(travelProgress, tempNormal, tempBinormal);

            tempOffset
                .copy(tempNormal)
                .multiplyScalar(Math.cos(orbitAngle) * data.orbitRadius)
                .addScaledVector(tempBinormal, Math.sin(orbitAngle) * data.orbitRadius);

            data.basePosition.copy(tempPoint).add(tempOffset);

            if (pointerHasWorld) {
                pointerDelta.copy(data.basePosition).sub(pointerIntersection);
                const distanceSq = pointerDelta.lengthSq();
                if (distanceSq > 1e-6) {
                    const distance = Math.sqrt(distanceSq);
                    if (distance < pointerInfluenceRadius) {
                        const influence = 1 - distance / pointerInfluenceRadius;
                        pointerDelta.multiplyScalar(1 / distance);
                        data.interactionVelocity.addScaledVector(pointerDelta, influence * pointerStrengthStep);
                    }
                    if (distance < highlightRadius) {
                        data.isPointerNear = true;
                        if (data.highlightStrength < 0.05) {
                            const colorHex = highlightPalette[Math.floor(Math.random() * highlightPalette.length)];
                            data.highlightColor.setHex(colorHex);
                        }
                    }
                }
            }

            springForce.copy(data.interactionOffset).multiplyScalar(-springStrength);
            data.interactionVelocity.addScaledVector(springForce, delta);

            data.interactionVelocity.multiplyScalar(dampingFactor);
            data.interactionOffset.addScaledVector(data.interactionVelocity, delta);

            clampInteraction(data);

            data.mesh.position.copy(data.basePosition).add(data.interactionOffset);
            data.mesh.quaternion.setFromUnitVectors(upVector, tempTangent);
            data.mesh.rotateOnAxis(upVector, data.spinVelocity * delta);

            if (data.isPointerNear) {
                data.highlightStrength = Math.min(1, data.highlightStrength + delta * 5);
            } else {
                data.highlightStrength = Math.max(0, data.highlightStrength - delta * 2.4);
            }

            data.colorBuffer.copy(data.baseColor).lerp(data.highlightColor, data.highlightStrength);
            data.material.color.copy(data.colorBuffer);
        });

        resolveCollisions();
    };

    const resolveCollisions = () => {
        for (let iteration = 0; iteration < collisionIterations; iteration++) {
            for (let i = 0; i < objects.length; i++) {
                for (let j = i + 1; j < objects.length; j++) {
                    const a = objects[i];
                    const b = objects[j];

                    collisionDelta.copy(a.mesh.position).sub(b.mesh.position);
                    const distSq = collisionDelta.lengthSq();
                    const minDist = a.collisionRadius + b.collisionRadius;

                    if (distSq < minDist * minDist && distSq > 1e-8) {
                        const distance = Math.sqrt(distSq);
                        const overlap = minDist - distance;
                        collisionDelta.multiplyScalar(1 / distance);

                        const correction = overlap * 0.5;
                        collisionPush.copy(collisionDelta).multiplyScalar(correction);

                        a.interactionOffset.add(collisionPush);
                        b.interactionOffset.addScaledVector(collisionDelta, -correction);

                        clampInteraction(a);
                        clampInteraction(b);

                        a.mesh.position.copy(a.basePosition).add(a.interactionOffset);
                        b.mesh.position.copy(b.basePosition).add(b.interactionOffset);

                        a.interactionVelocity.addScaledVector(collisionDelta, correction * 0.3);
                        b.interactionVelocity.addScaledVector(collisionDelta, -correction * 0.3);
                    }
                }
            }
        }
    };

    const render = () => {
        const delta = Math.min(clock.getDelta(), 0.05);
        elapsed += delta;
        updateObjects(elapsed, delta);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
        rebuildCurve();
        resizeRenderer();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    function setupStudioLighting(targetScene) {
        targetScene.add(new THREE.AmbientLight(0xffffff, 0.18));

        const RectAreaLightUniformsLib = window.THREE_RectAreaLightUniformsLib;
        if (RectAreaLightUniformsLib && THREE.RectAreaLight) {
            RectAreaLightUniformsLib.init();

            const key = new THREE.RectAreaLight(0xffffff, 28, 160, 90);
            key.position.set(70, 60, 25);
            key.lookAt(0, 0, 0);

            const fill = new THREE.RectAreaLight(0xffffff, 18, 140, 80);
            fill.position.set(-70, 40, 35);
            fill.lookAt(0, 0, 0);

            const rim = new THREE.RectAreaLight(0xffffff, 22, 120, 100);
            rim.position.set(0, 55, -90);
            rim.lookAt(0, 0, 0);

            targetScene.add(key, fill, rim);
        } else {
            const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
            keyLight.position.set(65, 60, 35);
            const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
            fillLight.position.set(-55, 50, 40);
            const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
            rimLight.position.set(0, 45, -90);

            targetScene.add(keyLight, fillLight, rimLight);
        }
    }

    async function loadMaterialTextures(rendererInstance) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setPath("textures/");

        const exrCtor = window.THREE_EXRLoader;
        const exrLoader = exrCtor ? new exrCtor() : null;

        if (exrLoader) {
            exrLoader.setPath("textures/");
            if (exrLoader.setDataType && THREE.FloatType) {
                exrLoader.setDataType(THREE.FloatType);
            }
        } else {
            console.warn("EXRLoader no disponible. Se aplicará la textura base sin mapas de normales ni roughness.");
        }

        const [
            colorMap,
            displacementMap,
            normalMap,
            roughnessMap
        ] = await Promise.all([
            textureLoader.loadAsync("rusted_shutter_diff_1k.jpg"),
            textureLoader.loadAsync("rusted_shutter_disp_1k.png").catch(() => null),
            exrLoader ? exrLoader.loadAsync("rusted_shutter_nor_gl_1k.exr") : Promise.resolve(null),
            exrLoader ? exrLoader.loadAsync("rusted_shutter_rough_1k.exr") : Promise.resolve(null)
        ]);

        const maxAnisotropy = rendererInstance.capabilities.getMaxAnisotropy();
        const repeatScale = 1.6;

        const configureTexture = (texture, options = {}) => {
            if (!texture) {
                return;
            }

            if ("colorSpace" in texture && options.colorSpace) {
                texture.colorSpace = options.colorSpace;
            }

            if (typeof options.minFilter !== "undefined") {
                texture.minFilter = options.minFilter;
            }

            if (typeof options.magFilter !== "undefined") {
                texture.magFilter = options.magFilter;
            }

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(repeatScale, repeatScale);
            texture.anisotropy = Math.min(maxAnisotropy, 8);
            texture.needsUpdate = true;
        };

        if (colorMap) {
            configureTexture(colorMap, { colorSpace: THREE.SRGBColorSpace });
        }

        if (displacementMap) {
            configureTexture(displacementMap);
        }

        if (normalMap) {
            configureTexture(normalMap, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter
            });
            normalMap.flipY = false;
        }

        if (roughnessMap) {
            configureTexture(roughnessMap, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter
            });
            roughnessMap.flipY = false;
        }

        return {
            colorMap,
            displacementMap,
            normalMap,
            roughnessMap
        };
    }

    function buildMaterial(_textures, envIntensity) {
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.18,
            roughness: 0.46,
            envMapIntensity: envIntensity * 1.25,
            clearcoat: 0.52,
            clearcoatRoughness: 0.18,
            sheen: 0.12,
            sheenRoughness: 0.6,
            specularIntensity: 0.9,
            specularColor: new THREE.Color(0x1c1c1c),
            emissive: new THREE.Color(0x040404)
        });

        material.needsUpdate = true;

        return material;
    }
}
