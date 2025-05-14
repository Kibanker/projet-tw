(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_components_MapComponent_tsx_a5b7f2._.js", {

"[project]/app/components/MapComponent.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
//ça dit a Node que la carte doit être rendue côté client
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
// Configuration des icônes personnalisées pour Leaflet
const defaultIcon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [
        25,
        41
    ],
    iconAnchor: [
        12,
        41
    ],
    popupAnchor: [
        1,
        -34
    ],
    shadowSize: [
        41,
        41
    ]
});
const selectedIcon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [
        25,
        41
    ],
    iconAnchor: [
        12,
        41
    ],
    popupAnchor: [
        1,
        -34
    ],
    shadowSize: [
        41,
        41
    ]
});
const MapComponent = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ logements, center, selectedLogement, onMarkerClick }, ref)=>{
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // Exposer des méthodes via la ref
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, {
        "MapComponent.useImperativeHandle": ()=>({
                flyTo: ({
                    "MapComponent.useImperativeHandle": (latlng, zoom, options)=>{
                        if (mapRef.current) {
                            mapRef.current.flyTo(latlng, zoom, options);
                        }
                    }
                })["MapComponent.useImperativeHandle"]
            })
    }["MapComponent.useImperativeHandle"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            // Ne s'exécute que côté client
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            // Initialiser la carte
            if (!mapRef.current) {
                mapRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map('map').setView([
                    center.lat,
                    center.lng
                ], 6);
                // Ajouter la couche de tuiles OpenStreetMap
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 19
                }).addTo(mapRef.current);
            }
            // Nettoyer les marqueurs existants
            Object.values(markersRef.current).forEach({
                "MapComponent.useEffect": (marker)=>{
                    if (marker && mapRef.current) {
                        marker.removeFrom(mapRef.current);
                    }
                }
            }["MapComponent.useEffect"]);
            markersRef.current = {};
            // Ajouter les marqueurs pour chaque logement
            logements.forEach({
                "MapComponent.useEffect": (logement)=>{
                    if (!mapRef.current) return;
                    const marker = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker([
                        logement.coordinates.lat,
                        logement.coordinates.lng
                    ], {
                        icon: logement.id === selectedLogement ? selectedIcon : defaultIcon,
                        title: logement.title
                    });
                    // Ajouter un popup avec les informations du logement
                    const popupContent = `
        <div class="p-2">
          <img src="${logement.image}" alt="${logement.title}" class="w-full h-24 object-cover mb-2 rounded">
          <h3 class="font-bold">${logement.title}</h3>
          <p>${logement.location}</p>
          <p class="text-blue-600 font-semibold">${logement.price.toLocaleString()} €</p>
          <p>${logement.surface} m² • ${logement.rooms} pièce${logement.rooms > 1 ? 's' : ''}</p>
        </div>
      `;
                    // Utiliser le popupContent déjà défini plus haut
                    marker.bindPopup(popupContent);
                    marker.addTo(mapRef.current);
                    // Ajouter un événement de clic pour le marqueur
                    marker.on('click', {
                        "MapComponent.useEffect": ()=>{
                            onMarkerClick(logement.id);
                        }
                    }["MapComponent.useEffect"]);
                    // Stocker la référence du marqueur
                    markersRef.current[logement.id] = marker;
                }
            }["MapComponent.useEffect"]);
            // Ajuster la vue pour afficher tous les marqueurs si nécessaire
            if (logements.length > 0 && !selectedLogement && mapRef.current) {
                const markers = Object.values(markersRef.current).filter(Boolean);
                if (markers.length > 0) {
                    // Créer un tableau de coordonnées des marqueurs
                    const latLngs = markers.map({
                        "MapComponent.useEffect.latLngs": (marker)=>marker.getLatLng()
                    }["MapComponent.useEffect.latLngs"]);
                    if (latLngs.length > 0) {
                        // Créer un bounds à partir des coordonnées avec une syntaxe compatible TypeScript
                        const bounds = latLngs.reduce({
                            "MapComponent.useEffect.bounds": (bounds, latlng)=>bounds.extend(latlng)
                        }["MapComponent.useEffect.bounds"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].latLngBounds([
                            latLngs[0],
                            latLngs[0]
                        ]));
                        // Ajuster la vue pour afficher tous les marqueurs avec un peu de marge
                        mapRef.current.fitBounds(bounds.pad(0.1));
                    }
                }
            }
            // Nettoyage
            return ({
                "MapComponent.useEffect": ()=>{
                    if (mapRef.current) {
                        mapRef.current.remove();
                        mapRef.current = null;
                    }
                }
            })["MapComponent.useEffect"];
        }
    }["MapComponent.useEffect"], [
        logements,
        selectedLogement,
        center.lat,
        center.lng,
        onMarkerClick
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "map",
        style: {
            height: '100%',
            width: '100%'
        }
    }, void 0, false, {
        fileName: "[project]/app/components/MapComponent.tsx",
        lineNumber: 164,
        columnNumber: 10
    }, this);
}, "Uq5XDXYAgO04o4BdfY/I5MGTtnc=")), "Uq5XDXYAgO04o4BdfY/I5MGTtnc=");
_c1 = MapComponent;
MapComponent.displayName = 'MapComponent';
const __TURBOPACK__default__export__ = MapComponent;
var _c, _c1;
__turbopack_refresh__.register(_c, "MapComponent$forwardRef");
__turbopack_refresh__.register(_c1, "MapComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_components_MapComponent_tsx_a5b7f2._.js.map