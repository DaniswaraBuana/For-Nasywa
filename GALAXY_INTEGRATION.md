# Galaxy Integration Documentation

## Files Structure

### Active Files (Used in Website)
```
/Users/danis/Downloads/bunga-flower-main/
├── index.html          # Main HTML with page 7 galaxy
├── style.css           # Styling for all pages including galaxy
├── app.js              # Main app logic and navigation
├── galaxy.js           # Three.js galaxy implementation (ACTIVE)
└── assets/             # Photos, music, videos
```

### Reference Files (From sboez/Galaxy - Not Used Directly)
```
src/
├── App.js              # Original webpack entry (reference only)
├── index.html          # Original HTML (reference only)
├── scripts/
│   ├── Galaxy.js       # Original galaxy class (reference for parameters)
│   ├── Scene.js        # Original scene setup (reference only)
│   └── Gui.js          # Original GUI controls (not implemented)
└── shaders/
    ├── vertex.glsl     # Vertex shader (copied to galaxy.js)
    └── fragment.glsl   # Fragment shader (copied to galaxy.js)
```

## How It Works

### 1. HTML Structure (index.html)
Page 7 contains:
- `<canvas class="webgl-galaxy">` - Three.js rendering canvas
- `.photo-orbits` container - 4 photo frames overlaid on galaxy
- Photo frames orbit while galaxy rotates in background

### 2. Galaxy Animation (galaxy.js)
- **Class**: `GalaxyScene`
- **Parameters**:
  - count: 30,000 particles
  - size: 0.015
  - radius: 5
  - branches: 5 (spiral arms)
  - colors: orange (#ff6030) to blue (#1b3984)
- **Shaders**: Inline vertex & fragment shaders (from src/shaders/)
- **Animation**: Galaxy rotates + camera orbits automatically

### 3. Integration (app.js)
- Page navigation triggers `initGalaxy()` when entering page 7
- Galaxy initializes once and continues animating
- No conflicts with other pages

### 4. Styling (style.css)
- `.webgl-galaxy` - Full screen canvas (z-index: 1)
- `.photo-orbits` - Overlay container (z-index: 10)
- `.galaxy-container` - Black background
- Photo frames have 3D perspective and orbit animations

## Key Differences from Original

| Feature | Original (sboez/Galaxy) | Our Implementation |
|---------|------------------------|-------------------|
| Build System | Webpack + npm | Pure CDN (no build) |
| Three.js | npm package | CDN (v0.132.2) |
| Shaders | External .glsl files | Inline in galaxy.js |
| Camera Control | OrbitControls | Auto-rotation |
| GUI | dat.gui controls | No GUI (fixed params) |
| Integration | Standalone app | Page 7 in multi-page site |

## How to Modify Galaxy

### Change Particle Count
```javascript
// In galaxy.js line 17
count: 30000,  // Increase for more stars
```

### Change Colors
```javascript
// In galaxy.js line 21-22
insideColor: '#ff6030',  // Center color (orange)
outsideColor: '#1b3984'  // Outer color (blue)
```

### Change Galaxy Size
```javascript
// In galaxy.js line 19
radius: 5,  // Increase for larger galaxy
```

### Adjust Animation Speed
```javascript
// In galaxy.js line 212 (animate function)
this.camera.position.x = Math.sin(elapsedTime * 0.1) * 4;
// Change 0.1 to higher = faster orbit
```

## Files NOT Used (Can be Ignored)
- `src/App.js` - Webpack entry point
- `src/index.html` - Original HTML
- `src/scripts/Scene.js` - Original scene setup
- `src/scripts/Gui.js` - GUI controls
- `bundler/` - Webpack configuration
- `package.json` - npm dependencies
- `firebase.json` - Firebase hosting config

These are reference files from the original repository.
All functionality is consolidated in `galaxy.js` for simplicity.

## Troubleshooting

### Galaxy doesn't appear
- Check browser console for errors
- Ensure Three.js CDN is loaded (check network tab)
- Verify page 7 is active (`currentPage === 7`)

### Performance issues
- Reduce particle count (e.g., 15000 instead of 30000)
- Lower size value (e.g., 0.01 instead of 0.015)

### Photos not visible
- Check z-index: `.photo-orbits` must be > `.webgl-galaxy`
- Verify CSS `pointer-events: none` on container
- Ensure individual photos have `pointer-events: all`

## Credits
Galaxy implementation based on:
- Repository: https://github.com/sboez/Galaxy
- Author: Sandra Boez (MIT License)
- Course: Three.js Journey by Bruno Simon
