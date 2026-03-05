/**
 * Galaxy Animation for Page 7
 * Adapted from sboez/Galaxy (MIT License)
 * Source files: src/App.js, src/scripts/Scene.js, src/scripts/Galaxy.js
 *               src/shaders/vertex.glsl, src/shaders/fragment.glsl
 *
 * Merged into a single file for CDN (no webpack/bundler needed).
 * OrbitControls loaded separately via CDN.
 */

// ─────────────────────────────────────────────
// Vertex Shader  (src/shaders/vertex.glsl)
// ─────────────────────────────────────────────
const galaxyVertexShader = `
uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
}
`;

// ─────────────────────────────────────────────
// Fragment Shader  (src/shaders/fragment.glsl)
// ─────────────────────────────────────────────
const galaxyFragmentShader = `
varying vec3 vColor;

void main()
{
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(color, 1.0);
}
`;

// ─────────────────────────────────────────────
// Galaxy Class  (src/scripts/Galaxy.js)
// ─────────────────────────────────────────────
class Galaxy {
    constructor(scene, renderer) {
        this.scene    = scene;
        this.renderer = renderer;

        this.parameters = {
            count           : 100000,
            size            : 0.02,
            radius          : 5,
            branches        : 5,
            randomness      : 0.3,
            randomnessPower : 4,
            insideColor     : '#ed7b4d',   // original colour from Galaxy.js
            outsideColor    : '#4657de'    // original colour from Galaxy.js
        };

        this.geometry = null;
        this.material = null;
        this.points   = null;

        this.setGalaxy();
    }

    setGalaxy() {
        this.removeGalaxy();

        this.geometry = new THREE.BufferGeometry();

        const positions  = new Float32Array(this.parameters.count * 3);
        const colors     = new Float32Array(this.parameters.count * 3);
        const scales     = new Float32Array(this.parameters.count);
        const randomness = new Float32Array(this.parameters.count * 3);

        const colorInside  = new THREE.Color(this.parameters.insideColor);
        const colorOutside = new THREE.Color(this.parameters.outsideColor);

        for (let i = 0; i < this.parameters.count; ++i) {
            const i3 = i * 3;

            // Position
            const radius      = Math.random() * this.parameters.radius;
            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2;

            positions[i3]     = Math.cos(branchAngle) * radius;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = Math.sin(branchAngle) * radius;

            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;

            randomness[i3]     = randomX;
            randomness[i3 + 1] = randomY;
            randomness[i3 + 2] = randomZ;

            // Color
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / this.parameters.radius);

            colors[i3]     = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            // Scale
            scales[i] = Math.random();
        }

        this.geometry.setAttribute('position',    new THREE.BufferAttribute(positions,  3));
        this.geometry.setAttribute('color',       new THREE.BufferAttribute(colors,     3));
        this.geometry.setAttribute('aScale',      new THREE.BufferAttribute(scales,     1));
        this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

        this.setMaterial();
        this.setPoints();
    }

    removeGalaxy() {
        if (this.points !== null) {
            this.geometry.dispose();
            this.material.dispose();
            this.scene.remove(this.points);
        }
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            depthWrite     : false,
            blending       : THREE.AdditiveBlending,
            vertexColors   : true,
            vertexShader   : galaxyVertexShader,
            fragmentShader : galaxyFragmentShader,
            uniforms       : {
                uTime : { value: 0 },
                uSize : { value: 30 * this.renderer.getPixelRatio() }
            }
        });
    }

    setPoints() {
        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }
}

// ─────────────────────────────────────────────
// Scene Class  (src/scripts/Scene.js)
// OrbitControls loaded via CDN addons
// ─────────────────────────────────────────────
class GalaxySceneSetup extends THREE.Scene {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.setScene();
    }

    setScene() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(3, 3, 3);

        this.setRenderer();
        this.setControls();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias : true,
            canvas    : this.canvas,
            alpha     : true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    setControls() {
        // OrbitControls — available via the CDN addons bundle loaded in index.html
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.canvas);
            this.controls.enableDamping = true;
            this.controls.update();
        } else {
            // Fallback: no controls (camera stays at initial position)
            this.controls = null;
        }
    }
}

// ─────────────────────────────────────────────
// App  (src/App.js)
// ─────────────────────────────────────────────
class GalaxyApp {
    constructor() {
        this.scene   = null;
        this.galaxy  = null;
        this.clock   = new THREE.Clock();
        this.animId  = null;
        this.running = false;
    }

    init(canvas) {
        if (this.running) return;   // already initialised

        this.scene  = new GalaxySceneSetup(canvas);
        this.galaxy = new Galaxy(this.scene, this.scene.renderer);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.running = true;
        this.animate();
    }

    onWindowResize() {
        this.scene.camera.aspect = window.innerWidth / window.innerHeight;
        this.scene.camera.updateProjectionMatrix();
        this.scene.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    animate() {
        if (!this.running) return;

        this.animId = window.requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();

        // Update shader time uniform  (mirrors App.js line: this.galaxy.material.uniforms.uTime.value = elapsedTime)
        this.galaxy.material.uniforms.uTime.value = elapsedTime;

        // Update orbit controls damping
        if (this.scene.controls) {
            this.scene.controls.update();
        }

        this.scene.renderer.render(this.scene, this.scene.camera);
    }

    destroy() {
        this.running = false;
        if (this.animId) cancelAnimationFrame(this.animId);
        if (this.galaxy) this.galaxy.removeGalaxy();
        window.removeEventListener('resize', this.onWindowResize.bind(this), false);
    }
}

// ─────────────────────────────────────────────
// Bootstrap — called by app.js when entering page 7
// ─────────────────────────────────────────────
let galaxyApp = null;

function initGalaxy() {
    const canvas = document.querySelector('.webgl-galaxy');
    if (!canvas) { console.error('Galaxy canvas not found'); return; }
    if (!galaxyApp) galaxyApp = new GalaxyApp();
    galaxyApp.init(canvas);
}

function destroyGalaxy() {
    if (galaxyApp) galaxyApp.destroy();
}
