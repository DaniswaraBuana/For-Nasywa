/**
 * Galaxy Page — Three.js
 * - Particle galaxy (sboez/Galaxy)
 * - Auto-rotating camera (no user interaction)
 * - 4 photo sprites orbiting inside the 3D scene
 * - Bright central star built from canvas textures
 */

/* ─── Vertex Shader ──────────────────────────────────────────────────────── */
const VERT = `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute vec3  aRandomness;
  varying   vec3  vColor;

  void main() {
    vec4  mp    = modelMatrix * vec4(position, 1.0);
    float a     = atan(mp.x, mp.z);
    float dist  = length(mp.xz);
    a          += (1.0 / dist) * uTime * 0.2;
    mp.x        = cos(a) * dist;
    mp.z        = sin(a) * dist;
    mp.xyz     += aRandomness;

    vec4 vp     = viewMatrix * mp;
    gl_Position = projectionMatrix * vp;

    gl_PointSize  = uSize * aScale;
    gl_PointSize *= 1.0 / -vp.z;
    vColor        = color;
  }
`;

/* ─── Fragment Shader ────────────────────────────────────────────────────── */
const FRAG = `
  varying vec3 vColor;
  void main() {
    float s = distance(gl_PointCoord, vec2(0.5));
    s = pow(1.0 - s, 10.0);
    gl_FragColor = vec4(mix(vec3(0.0), vColor, s), 1.0);
  }
`;

/* ─── Helper: canvas radial-gradient texture ─────────────────────────────── */
function makeRadialTex(size, stops) {
  const c   = document.createElement('canvas');
  c.width   = c.height = size;
  const ctx = c.getContext('2d');
  const g   = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  stops.forEach(([pos, col]) => g.addColorStop(pos, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/* ─── Galaxy Particles ───────────────────────────────────────────────────── */
class GalaxyParticles {
  constructor(scene, renderer) {
    this.scene    = scene;
    this.renderer = renderer;
    this.points   = null;
    this.geo      = null;
    this.mat      = null;
    this._build();
  }

  _build() {
    const COUNT    = 100000;
    const RADIUS   = 5;
    const BRANCHES = 5;
    const RAND_POW = 4;
    const RAND     = 0.3;

    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const sc  = new Float32Array(COUNT);
    const rnd = new Float32Array(COUNT * 3);

    const cIn  = new THREE.Color('#ed7b4d');
    const cOut = new THREE.Color('#4657de');

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r  = Math.random() * RADIUS;
      const ba = (i % BRANCHES) / BRANCHES * Math.PI * 2;

      pos[i3]   = Math.cos(ba) * r;
      pos[i3+1] = 0;
      pos[i3+2] = Math.sin(ba) * r;

      const sign = () => Math.random() < 0.5 ? 1 : -1;
      const rv   = () => Math.pow(Math.random(), RAND_POW) * sign() * RAND * r;
      rnd[i3]   = rv(); rnd[i3+1] = rv(); rnd[i3+2] = rv();

      const mc = cIn.clone().lerp(cOut, r / RADIUS);
      col[i3] = mc.r; col[i3+1] = mc.g; col[i3+2] = mc.b;

      sc[i] = Math.random();
    }

    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position',    new THREE.BufferAttribute(pos, 3));
    this.geo.setAttribute('color',       new THREE.BufferAttribute(col, 3));
    this.geo.setAttribute('aScale',      new THREE.BufferAttribute(sc,  1));
    this.geo.setAttribute('aRandomness', new THREE.BufferAttribute(rnd, 3));

    this.mat = new THREE.ShaderMaterial({
      depthWrite     : false,
      blending       : THREE.AdditiveBlending,
      vertexColors   : true,
      vertexShader   : VERT,
      fragmentShader : FRAG,
      uniforms       : {
        uTime : { value: 0 },
        uSize : { value: 30 * this.renderer.getPixelRatio() }
      }
    });

    this.points = new THREE.Points(this.geo, this.mat);
    this.scene.add(this.points);
  }

  tick(t) { this.mat.uniforms.uTime.value = t; }

  dispose() {
    this.geo.dispose();
    this.mat.dispose();
    this.scene.remove(this.points);
  }
}

/* ─── Central Star ───────────────────────────────────────────────────────── */
class CentralStar {
  constructor(scene) {
    this.scene   = scene;
    this.objects = [];
    this._build();
  }

  _build() {
    // Solid core sphere
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfffce8 })
    );
    this.scene.add(core);
    this.objects.push(core);

    // Glow halos (billboard sprites)
    const tex = makeRadialTex(256, [
      [0.00, 'rgba(255,255,220,1)'],
      [0.20, 'rgba(255,240,140,0.8)'],
      [0.55, 'rgba(255,200,60,0.3)'],
      [1.00, 'rgba(255,140,0,0)'],
    ]);

    [[0.45, 1.0], [0.95, 0.55], [1.80, 0.25]].forEach(([size, alpha]) => {
      const mat = new THREE.SpriteMaterial({
        map        : tex,
        color      : new THREE.Color(1.0, 0.92, 0.55),
        transparent: true,
        opacity    : alpha,
        blending   : THREE.AdditiveBlending,
        depthWrite : false,
      });
      const s = new THREE.Sprite(mat);
      s.scale.setScalar(size);
      this.scene.add(s);
      this.objects.push(s);
    });

    this.outerHalo = this.objects[3];
    this.midHalo   = this.objects[2];
  }

  tick(t) {
    this.outerHalo.scale.setScalar(1.70 + 0.14 * Math.sin(t * 0.9));
    this.outerHalo.material.opacity = 0.20 + 0.10 * Math.sin(t * 1.1);
    this.midHalo.material.opacity   = 0.48 + 0.10 * Math.sin(t * 1.5 + 1.0);
  }

  dispose() {
    this.objects.forEach(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (o.material.map) o.material.map.dispose();
        o.material.dispose();
      }
      this.scene.remove(o);
    });
  }
}

/* ─── Photo Orbiters ─────────────────────────────────────────────────────── */
class PhotoOrbiters {
  constructor(scene) {
    this.scene    = scene;
    this.items    = [];
    this._glowTex = makeRadialTex(128, [
      [0.00, 'rgba(160,190,255,1)'],
      [0.45, 'rgba(100,140,255,0.4)'],
      [1.00, 'rgba(60,80,200,0)'],
    ]);

    const paths = [
      'assets/photos/photo1.jpg',
      'assets/photos/photo2.jpg',
      'assets/photos/photo3.jpg',
      'assets/photos/photo4.jpg',
    ];

    // r = orbit radius, spd = angular speed (rad/s), a0 = start angle, y = height
    const orbits = [
      { r: 1.7, spd:  0.30, a0: 0,             y:  0.25 },
      { r: 2.4, spd: -0.22, a0: Math.PI * 0.5, y: -0.20 },
      { r: 2.0, spd:  0.26, a0: Math.PI,        y:  0.15 },
      { r: 2.9, spd: -0.17, a0: Math.PI * 1.5,  y: -0.10 },
    ];

    const loader = new THREE.TextureLoader();
    paths.forEach((p, i) =>
      loader.load(p,
        tex => this._add(tex, orbits[i], i),
        null,
        ()  => this._addFallback(orbits[i], i)
      )
    );
  }

  _add(tex, orb, i) {
    tex.minFilter = tex.magFilter = THREE.LinearFilter;

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map        : tex,
      transparent: true,
      depthWrite : false,
    }));
    sprite.scale.set(0.52, 0.52, 1);
    this.scene.add(sprite);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map        : this._glowTex,
      color      : new THREE.Color(0.5, 0.65, 1.0),
      transparent: true,
      opacity    : 0.5,
      blending   : THREE.AdditiveBlending,
      depthWrite : false,
    }));
    glow.scale.setScalar(1.05);
    this.scene.add(glow);

    this.items[i] = { sprite, glow, orb };
  }

  _addFallback(orb, i) {
    const c   = document.createElement('canvas');
    c.width   = c.height = 128;
    const ctx = c.getContext('2d');
    ['#ed7b4d','#4657de','#de4670','#46dec8'].forEach((col, idx) => {
      if (idx === i) ctx.fillStyle = col;
    });
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 5;
    ctx.strokeRect(3, 3, 122, 122);
    this._add(new THREE.CanvasTexture(c), orb, i);
  }

  tick(t) {
    this.items.forEach((item, i) => {
      if (!item) return;
      const { sprite, glow, orb } = item;
      const a = orb.a0 + orb.spd * t;
      const x = Math.cos(a) * orb.r;
      const z = Math.sin(a) * orb.r;
      const y = orb.y + 0.05 * Math.sin(t * 0.7 + i * 1.4);
      sprite.position.set(x, y, z);
      glow.position.set(x, y, z);
      glow.material.opacity = 0.30 + 0.22 * Math.sin(t * 1.0 + i * 1.3);
    });
  }

  dispose() {
    this.items.forEach(item => {
      if (!item) return;
      [item.sprite, item.glow].forEach(o => {
        if (o.material.map) o.material.map.dispose();
        o.material.dispose();
        this.scene.remove(o);
      });
    });
    if (this._glowTex) this._glowTex.dispose();
  }
}

/* ─── Main App ───────────────────────────────────────────────────────────── */
class GalaxyApp {
  constructor() {
    this.scene     = null;
    this.camera    = null;
    this.renderer  = null;
    this.particles = null;
    this.star      = null;
    this.photos    = null;
    this.clock     = new THREE.Clock();
    this.animId    = null;
    this.running   = false;
    this._resize   = this._onResize.bind(this);
  }

  init(canvas) {
    if (this.running) return;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 100
    );
    this.camera.position.set(0, 2.6, 4.8);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.particles = new GalaxyParticles(this.scene, this.renderer);
    this.star      = new CentralStar(this.scene);
    this.photos    = new PhotoOrbiters(this.scene);

    window.addEventListener('resize', this._resize);
    this.running = true;
    this._tick();
  }

  _onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _tick() {
    if (!this.running) return;
    this.animId = requestAnimationFrame(this._tick.bind(this));

    const t = this.clock.getElapsedTime();

    this.particles.tick(t);

    // Gentle auto-rotate camera around galaxy — no user input needed
    const R = 4.8, spd = 0.055;
    this.camera.position.x = Math.sin(t * spd) * R;
    this.camera.position.z = Math.cos(t * spd) * R;
    this.camera.position.y = 2.6 + 0.25 * Math.sin(t * 0.035);
    this.camera.lookAt(0, 0, 0);

    this.star.tick(t);
    this.photos.tick(t);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.running = false;
    if (this.animId)    cancelAnimationFrame(this.animId);
    if (this.particles) this.particles.dispose();
    if (this.star)      this.star.dispose();
    if (this.photos)    this.photos.dispose();
    window.removeEventListener('resize', this._resize);
    this.scene = this.camera = this.renderer = null;
    this.particles = this.star = this.photos = null;
  }
}

/* ─── Bootstrap ─────────────────────────────────────────────────────────── */
let galaxyApp = null;

function initGalaxy() {
  const canvas = document.querySelector('.webgl-galaxy');
  if (!canvas) { console.error('[galaxy] canvas not found'); return; }
  if (!galaxyApp) galaxyApp = new GalaxyApp();
  galaxyApp.init(canvas);
}

function destroyGalaxy() {
  if (galaxyApp) { galaxyApp.destroy(); galaxyApp = null; }
}
