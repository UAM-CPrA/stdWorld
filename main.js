// Minimal animated nodes for the community canvas
window.addEventListener('DOMContentLoaded', () => {
    // --- Globe code (from index.html) ---
    const globeCanvas = document.getElementById('globe-canvas');
    if (globeCanvas) {
        const ctx = globeCanvas.getContext('2d');
        const w = globeCanvas.width, h = globeCanvas.height * 1.2;
        const r = Math.min(w, h) * 0.35;
        const cx = w/2, cy = h/(2.4);

// Load cities from cities.json
let cities = loadCitiesFromJson();
let citiesLoaded = false;

function loadCitiesFromJson(callback) {
    fetch('cities.json')
        .then(resp => resp.json())
        .then(data => {
            if (Array.isArray(data.cities)) {
                cities = data.cities;
            } else if (Array.isArray(data.features)) {
                // If using GeoJSON, look for features with properties.type === 'City' or properties.city
                cities = data.features
                    .filter(f => f.properties && (f.properties.type === 'City' || f.properties.city))
                    .map(f => ({
                        name: f.properties.name || f.properties.city || 'City',
                        lat: f.geometry.coordinates[1],
                        lon: f.geometry.coordinates[0]
                    }));
            }
            citiesLoaded = true;
            if (typeof callback === 'function') callback();
        });
}

        // Helper: Calculate distance between two points on the globe (projected 2D distance)
        function globeDist(a, b, rotY, inclination, ztilt) {
            const pa = latLonToXY(a.lat, a.lon, rotY, inclination, ztilt);
            const pb = latLonToXY(b.lat, b.lon, rotY, inclination, ztilt);
            return Math.hypot(pa.x - pb.x, pa.y - pb.y);
        }

        // Kruskal's algorithm for MST
        function computeMST(visibleCities, rotY, inclination, ztilt) {
            // Build all possible edges between visible cities
            const edges = [];
            for (let i = 0; i < visibleCities.length; i++) {
                for (let j = i + 1; j < visibleCities.length; j++) {
                    const dist = globeDist(visibleCities[i], visibleCities[j], rotY, inclination, ztilt);
                    edges.push({i, j, dist});
                }
            }
            // Sort edges by distance
            edges.sort((a, b) => a.dist - b.dist);
            // Disjoint set for Kruskal
            const parent = Array(visibleCities.length).fill(0).map((_, i) => i);
            function find(u) {
                if (parent[u] !== u) parent[u] = find(parent[u]);
                return parent[u];
            }
            function union(u, v) {
                parent[find(u)] = find(v);
            }
            // Kruskal's MST
            const mst = [];
            for (const {i, j} of edges) {
                if (find(i) !== find(j)) {
                    mst.push([i, j]);
                    union(i, j);
                }
                if (mst.length === visibleCities.length - 1) break;
            }
            return mst;
        }

        
        // Inclined globe: tilt around X axis, then rotate around Z axis (so tilt is to the right)
        const INCLINATION = 21 * Math.PI / 180; // 21deg in radians
        const Z_TILT = -21 * Math.PI / 180; // -21deg in radians, so axis tilts 21deg to the right
        function latLonToXY(lat, lon, rotY=0, tilt=INCLINATION, ztilt=Z_TILT) {
            lat = lat * Math.PI/180;
            lon = lon * Math.PI/180;
            lon += rotY;
            // 3D sphere
            let x = Math.cos(lat) * Math.sin(lon);
            let y = Math.sin(lat);
            let z = Math.cos(lat) * Math.cos(lon);
            // Tilt around X axis
            let y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
            let z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
            // Rotate around Z axis (so tilt is to the right)
            let x3 = x * Math.cos(ztilt) - y2 * Math.sin(ztilt);
            let y3 = x * Math.sin(ztilt) + y2 * Math.cos(ztilt);
            return {
                x: cx + r * x3,
                y: cy - r * y3,
                z: z2
            };
        }
        let rotY = 0, dragging = false, lastX = 0;
        // Globe always large, inclined, and auto-rotating
        const GLOBE_SCALE = 1.3;
        let autoRotY = 0; // for continuous rotation
        function drawGlobe(scale = GLOBE_SCALE, rotY = 0, showBands = false) {
            ctx.clearRect(0,0,w,h);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(scale, scale);
            ctx.translate(-cx, -cy);
            // Sphere
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2*Math.PI);
            ctx.fillStyle = "#2224";
            ctx.shadowColor = "#111";
            ctx.shadowBlur = 10;
            ctx.fill();

            // Draw 21 inclined bands (gradiants)
            if (showBands) {
                for (let i = 0; i < 21; i++) {
                    const bandLat = -60 + (i * 120/20); // from -60 to +60
                    ctx.save();
                    ctx.globalAlpha = 0.13 + 0.07 * Math.sin(i/21 * Math.PI*2);
                    ctx.beginPath();
                    for (let lon = -180; lon <= 180; lon += 2) {
                        const p = latLonToXY(bandLat, lon, rotY, INCLINATION);
                        if (lon === -180) ctx.moveTo(p.x, p.y);
                        else ctx.lineTo(p.x, p.y);
                    }
                    ctx.lineWidth = 13;
                    ctx.strokeStyle = i % 2 === 0 ? '#fff' : '#ccff00';
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // --- Draw all continents outlines (approximate, not filled, just lines) ---
            // Load and extract continent outlines from cities.json (GeoJSON)
            if (!window._bordersGeoJSON) {
                fetch('earth.json')
                    .then(resp => resp.json())
                    .then(data => { window._bordersGeoJSON = data; drawGlobe(scale, rotY, showBands); });
                ctx.restore();
                ctx.restore();
                return;
            }
            // Extract only Polygon and MultiPolygon coordinates
function extractAllCoordinateArrays(geojson) {
    const outlines = [];
    for (const feature of geojson.features) {
        const geom = feature.geometry;
        if (!geom) continue;
        if (geom.type === 'Polygon') {
            for (const ring of geom.coordinates) {
                if (Array.isArray(ring) && ring.length > 1) {
                    outlines.push(ring);
                }
            }
        } else if (geom.type === 'MultiPolygon') {
            for (const poly of geom.coordinates) {
                for (const ring of poly) {
                    if (Array.isArray(ring) && ring.length > 1) {
                        outlines.push(ring);
                    }
                }
            }
        } else if (geom.type === 'LineString') {
            if (Array.isArray(geom.coordinates) && geom.coordinates.length > 1) {
                outlines.push(geom.coordinates);
            }
        }
        // Ignore Point, MultiPoint, etc.
    }
    return outlines;
}
const geojson = window._bordersGeoJSON;
const continents = extractAllCoordinateArrays(geojson);
            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.strokeStyle = '#1affd1';
            ctx.lineWidth = 2.2;
            for (const outline of continents) {
                // Always draw visible segments, break path at invisible points
                const projected = outline.map(pt => latLonToXY(pt[1], pt[0], rotY, INCLINATION, Z_TILT));
                ctx.beginPath();
                let drawing = false;
                for (let i = 0; i < outline.length; i++) {
                    const p = projected[i];
                    if (p.z > 0) {
                        if (!drawing) {
                            ctx.moveTo(p.x, p.y);
                            drawing = true;
                        } else {
                            ctx.lineTo(p.x, p.y);
                        }
                    } else {
                        drawing = false;
                    }
                }
                ctx.stroke();
            }
            ctx.restore();
            ctx.restore();
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(scale, scale);
            ctx.translate(-cx, -cy);
            ctx.strokeStyle = "#444";
            ctx.lineWidth = 1;
            for(let lat=-60; lat<=60; lat+=30) {
                ctx.beginPath();
                for(let lon=-180; lon<=180; lon+=5) {
                    const p = latLonToXY(lat, lon, rotY, INCLINATION);
                    if(lon===-180) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }
            for(let lon=-150; lon<=150; lon+=30) {
                ctx.beginPath();
                for(let lat=-90; lat<=90; lat+=5) {
                    const p = latLonToXY(lat, lon, rotY, INCLINATION);
                    if(lat===-90) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }
            ctx.save();
            ctx.strokeStyle = "#ccff00";
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = 2;
            // Only use visible cities (z > 0)
            const visibleCities = cities
                .map((city, idx) => {
                    const p = latLonToXY(city.lat, city.lon, rotY, INCLINATION);
                    return p.z > 0 ? { ...city, _idx: idx } : null;
                })
                .filter(Boolean);
            // Map from visible index to original index
            const idxMap = visibleCities.map(vc => vc._idx);
            // Compute MST for visible cities
            if (visibleCities.length > 1) {
                const mst = computeMST(visibleCities, rotY, INCLINATION, Z_TILT);
                mst.forEach(([i, j]) => {
                    const a = latLonToXY(visibleCities[i].lat, visibleCities[i].lon, rotY, INCLINATION);
                    const b = latLonToXY(visibleCities[j].lat, visibleCities[j].lon, rotY, INCLINATION);
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                });
            }
            ctx.restore();
            cities.forEach(city=>{
                const p = latLonToXY(city.lat, city.lon, rotY, INCLINATION);
                if(p.z > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 6, 0, 2*Math.PI);
                    ctx.fillStyle = "#ccff00";
                    ctx.shadowColor = "#ccff00";
                    ctx.shadowBlur = 8;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.font = "bold 10px 'Orbitron', 'Consolas', monospace";
                    ctx.fillStyle = "#fff";
                    ctx.textAlign = "center";
                    ctx.fillText(city.name, p.x, p.y-12);
                }
            });
            ctx.restore();
        }
        // Continuous auto-rotation
        function animateGlobeContinuous() {
            autoRotY += 0.008;
            drawGlobe(GLOBE_SCALE, Math.PI/7 + autoRotY, false);
            requestAnimationFrame(animateGlobeContinuous);
        }
        animateGlobeContinuous();
        // Only allow interaction after animation
        // Disable manual interaction during animation, and after, keep auto-rotating
        // (If you want to allow drag after, you can add logic here)
    }

    // --- Animated nodes for the community canvas ---
    const canvas = document.getElementById('nodes-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const NODES = 12;
    const nodes = [];
    for (let i = 0; i < NODES; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 18 + Math.random() * 10,
            dx: (Math.random() - 0.5) * 1.2,
            dy: (Math.random() - 0.5) * 1.2,
            color: `hsl(${Math.random() * 360}, 60%, 60%)`
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < 180) {
                    ctx.strokeStyle = '#bbb';
                    ctx.globalAlpha = 0.25;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }
    }
    function update() {
        for (const node of nodes) {
            node.x += node.dx;
            node.y += node.dy;
            if (node.x < node.r || node.x > canvas.width - node.r) node.dx *= -1;
            if (node.y < node.r || node.y > canvas.height - node.r) node.dy *= -1;
        }
    }
    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }
    animate();
});
