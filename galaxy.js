// Three.js Galaxy Animation
// Based on https://github.com/sboez/Galaxy (MIT License)
// Adapted for CDN usage without webpack/bundler

class GalaxyScene {
    constructor() {
        this.canvas = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.points = null;
        this.geometry = null;
        this.material = null;
        this.clock = new THREE.Clock();
        this.isInitialized = false;
        
        // Galaxy parameters (from src/scripts/Galaxy.js)
        this.parameters = {
            count: 100000,
            size: 0.01,
            radius: 5,
            branches: 3,
            spin: 1,
            randomness: 0.2,
            randomnessPower: 3,
            insideColor: '#ff6030',
            outsideColor: '#1b3984'
        };
    }

    init() {
        if (this.isInitialized) return;
        
        this.canvas = document.querySelector('.webgl-galaxy');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.generateGalaxy();
        this.animate();
        
        this.isInitialized = true;
        
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.x = 3;
        this.camera.position.y = 3;
        this.camera.position.z = 3;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    generateGalaxy() {
        // Remove old galaxy if exists
        if (this.points !== null) {
            this.geometry.dispose();
            this.material.dispose();
            this.scene.remove(this.points);
        }

        // Geometry
        this.geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(this.parameters.count * 3);
        const colors = new Float32Array(this.parameters.count * 3);
        const scales = new Float32Array(this.parameters.count);
        const randomness = new Float32Array(this.parameters.count * 3);

        const colorInside = new THREE.Color(this.parameters.insideColor);
        const colorOutside = new THREE.Color(this.parameters.outsideColor);

        for (let i = 0; i < this.parameters.count; i++) {
            const i3 = i * 3;

            // Position
            const radius = Math.random() * this.parameters.radius;
            const spinAngle = radius * this.parameters.spin;
            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2;

            // Randomness
            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

            randomness[i3] = randomX;
            randomness[i3 + 1] = randomY;
            randomness[i3 + 2] = randomZ;

            // Color
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / this.parameters.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            // Scale
            scales[i] = Math.random();
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
        this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

        // Material with shaders (from src/shaders/vertex.glsl and fragment.glsl)
        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: `
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
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() 
                {
                    float strength = distance(gl_PointCoord, vec2(0.5));
                    strength = 1.0 - strength;
                    strength = pow(strength, 10.0);

                    vec3 color = mix(vec3(0.0), vColor, strength);

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 30 * this.renderer.getPixelRatio() }
            }
        });

        // Points
        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }

    animate() {
        if (!this.isInitialized) return;
        
        const elapsedTime = this.clock.getElapsedTime();

        // Update material time uniform
        if (this.material && this.material.uniforms) {
            this.material.uniforms.uTime.value = elapsedTime;
        }

        // Rotate camera around galaxy
        this.camera.position.x = Math.sin(elapsedTime * 0.05) * 5;
        this.camera.position.z = Math.cos(elapsedTime * 0.05) * 5;
        this.camera.lookAt(0, 0, 0);

        // Render
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(() => this.animate());
    }

    onWindowResize() {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    destroy() {
        if (this.points) {
            this.geometry.dispose();
            this.material.dispose();
            this.scene.remove(this.points);
        }
        this.isInitialized = false;
    }
}

// Global instance
let galaxyScene = null;

function initGalaxy() {
    if (!galaxyScene) {
        galaxyScene = new GalaxyScene();
    }
    galaxyScene.init();
}

function destroyGalaxy() {
    if (galaxyScene) {
        galaxyScene.destroy();
    }
}
