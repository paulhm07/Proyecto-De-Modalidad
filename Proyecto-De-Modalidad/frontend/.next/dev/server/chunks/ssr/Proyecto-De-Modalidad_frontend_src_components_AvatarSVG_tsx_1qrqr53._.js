module.exports = [
"[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AvatarSVG",
    ()=>AvatarSVG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
const CUERPO_GRADIENTS = {
    "cuerpo-claro": {
        light: "#ffe5c9",
        dark: "#f7c9a0",
        cheek: "#ff8fa3"
    },
    "cuerpo-medio": {
        light: "#f0c089",
        dark: "#d99a5e",
        cheek: "#c64a5e"
    },
    "cuerpo-oscuro": {
        light: "#b5763f",
        dark: "#8a5226",
        cheek: "#5e2a35"
    },
    "cuerpo-verde": {
        light: "#b7e892",
        dark: "#7fc85a",
        cheek: "#3a8a4a"
    }
};
const ROPA_COLORS = {
    "ropa-basica": {
        light: "#2dd4bf",
        dark: "#0d9488"
    },
    "ropa-uniforme": {
        light: "#3b4d7a",
        dark: "#1e293b"
    },
    "ropa-capucha": {
        light: "#9ca3af",
        dark: "#4b5563"
    },
    "ropa-capas": {
        light: "#ef4444",
        dark: "#991b1b"
    },
    "ropa-arcoiris": {
        light: "url(#rainbowGrad)",
        dark: "url(#rainbowGrad)"
    }
};
function AvatarSVG({ config, size = 200, className = "" }) {
    const c = config ?? {};
    const cuerpoKey = c.cuerpo ?? "cuerpo-claro";
    const grad = CUERPO_GRADIENTS[cuerpoKey] ?? CUERPO_GRADIENTS["cuerpo-claro"];
    const gradId = `skin-${cuerpoKey}`;
    const ropaKey = c.ropa ?? "ropa-basica";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 200 200",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        "aria-label": "Avatar del estudiante",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: gradId,
                        x1: "0%",
                        y1: "0%",
                        x2: "0%",
                        y2: "100%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: grad.light
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 34,
                                columnNumber: 71
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: grad.dark
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 34,
                                columnNumber: 114
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "grad-ropa-basica",
                        x1: "0%",
                        y1: "0%",
                        x2: "0%",
                        y2: "100%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: ROPA_COLORS["ropa-basica"].light
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 35,
                                columnNumber: 81
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: ROPA_COLORS["ropa-basica"].dark
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 35,
                                columnNumber: 146
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "grad-ropa-uniforme",
                        x1: "0%",
                        y1: "0%",
                        x2: "0%",
                        y2: "100%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: ROPA_COLORS["ropa-uniforme"].light
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 36,
                                columnNumber: 83
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: ROPA_COLORS["ropa-uniforme"].dark
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 36,
                                columnNumber: 150
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "grad-ropa-capucha",
                        x1: "0%",
                        y1: "0%",
                        x2: "0%",
                        y2: "100%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: ROPA_COLORS["ropa-capucha"].light
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 37,
                                columnNumber: 82
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: ROPA_COLORS["ropa-capucha"].dark
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 37,
                                columnNumber: 148
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "grad-ropa-capas",
                        x1: "0%",
                        y1: "0%",
                        x2: "0%",
                        y2: "100%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: ROPA_COLORS["ropa-capas"].light
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 38,
                                columnNumber: 80
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: ROPA_COLORS["ropa-capas"].dark
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 38,
                                columnNumber: 144
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "rainbowGrad",
                        x1: "0%",
                        y1: "0%",
                        x2: "100%",
                        y2: "100%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: "#ef4444"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "20%",
                                stopColor: "#f97316"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 40,
                                columnNumber: 51
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "40%",
                                stopColor: "#facc15"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 40,
                                columnNumber: 92
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "60%",
                                stopColor: "#22c55e"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "80%",
                                stopColor: "#3b82f6"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 41,
                                columnNumber: 52
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: "#a855f7"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 41,
                                columnNumber: 93
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "shadowGrad",
                        cx: "50%",
                        cy: "50%",
                        r: "50%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: "rgba(45,20,55,0.18)"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 43,
                                columnNumber: 67
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: "rgba(45,20,55,0)"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 43,
                                columnNumber: 119
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "headHighlight",
                        cx: "30%",
                        cy: "25%",
                        r: "40%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: "rgba(255,255,255,0.55)"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 44,
                                columnNumber: 70
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: "rgba(255,255,255,0)"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 44,
                                columnNumber: 125
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "irisGrad",
                        cx: "50%",
                        cy: "40%",
                        r: "60%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: "#5a2d6e"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 45,
                                columnNumber: 65
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: "#2d1437"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                lineNumber: 45,
                                columnNumber: 105
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "100",
                cy: "190",
                rx: "55",
                ry: "8",
                fill: "url(#shadowGrad)"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RopaLayer, {
                clave: ropaKey
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "100",
                cy: "88",
                r: "58",
                fill: `url(#${gradId})`,
                stroke: "#2d1437",
                strokeWidth: "2.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "100",
                cy: "88",
                r: "58",
                fill: "url(#headHighlight)"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "64",
                cy: "100",
                rx: "9",
                ry: "6",
                fill: grad.cheek,
                opacity: "0.55"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "136",
                cy: "100",
                rx: "9",
                ry: "6",
                fill: grad.cheek,
                opacity: "0.55"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CabelloFrontLayer, {
                clave: c.cabello ?? "cabello-nada"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OjosLayer, {
                clave: c.ojos ?? "ojos-normales"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BocaLayer, {
                clave: c.boca ?? "boca-sonrisa"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AccesorioLayer, {
                clave: c.accesorio ?? "accesorio-nada"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CabelloBackLayer, {
                clave: c.cabello ?? "cabello-nada"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
function CabelloBackLayer({ clave }) {
    switch(clave){
        case "cabello-largo":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M44 95 Q42 140 50 165 L62 165 Q56 140 58 100 Z",
                        fill: "#3a2515",
                        stroke: "#2d1437",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 64,
                        columnNumber: 38
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M156 95 Q158 140 150 165 L138 165 Q144 140 142 100 Z",
                        fill: "#3a2515",
                        stroke: "#2d1437",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 64,
                        columnNumber: 147
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 64,
                columnNumber: 35
            }, this);
        default:
            return null;
    }
}
function CabelloFrontLayer({ clave }) {
    switch(clave){
        case "cabello-corto":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M44 88 Q44 42 100 38 Q156 42 156 88 Q152 70 138 64 Q130 78 110 76 Q100 80 90 76 Q70 78 62 64 Q48 70 44 88 Z",
                        fill: "#5a3a25",
                        stroke: "#2d1437",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 71,
                        columnNumber: 38
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M70 52 Q90 44 110 50",
                        fill: "none",
                        stroke: "rgba(255,255,255,0.35)",
                        strokeWidth: "3",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 71,
                        columnNumber: 206
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 71,
                columnNumber: 35
            }, this);
        case "cabello-largo":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M42 92 Q42 38 100 34 Q158 38 158 92 Q154 66 138 58 Q128 74 110 72 Q100 76 90 72 Q72 74 62 58 Q46 66 42 92 Z",
                        fill: "#4a2c1a",
                        stroke: "#2d1437",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 72,
                        columnNumber: 38
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M68 50 Q90 42 112 48",
                        fill: "none",
                        stroke: "rgba(255,255,255,0.3)",
                        strokeWidth: "3",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 72,
                        columnNumber: 206
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 72,
                columnNumber: 35
            }, this);
        case "cabello-mohawk":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: "mohawkGrad",
                            x1: "0%",
                            y1: "0%",
                            x2: "0%",
                            y2: "100%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "#fbbf24"
                                }, void 0, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                    lineNumber: 73,
                                    columnNumber: 111
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "50%",
                                    stopColor: "#f97316"
                                }, void 0, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                    lineNumber: 73,
                                    columnNumber: 151
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "#dc2626"
                                }, void 0, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                    lineNumber: 73,
                                    columnNumber: 192
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                            lineNumber: 73,
                            columnNumber: 45
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 73,
                        columnNumber: 39
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M88 60 Q90 22 100 14 Q110 22 112 60 L108 62 L104 58 L100 62 L96 58 L92 62 Z",
                        fill: "url(#mohawkGrad)",
                        stroke: "#2d1437",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 73,
                        columnNumber: 258
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M52 86 Q50 70 58 64 L62 80 Z",
                        fill: "#3a2515",
                        stroke: "#2d1437",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 73,
                        columnNumber: 403
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M148 86 Q150 70 142 64 L138 80 Z",
                        fill: "#3a2515",
                        stroke: "#2d1437",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 73,
                        columnNumber: 494
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 73,
                columnNumber: 36
            }, this);
        case "cabello-corona":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: "crownGrad",
                            x1: "0%",
                            y1: "0%",
                            x2: "0%",
                            y2: "100%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "#fde047"
                                }, void 0, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                    lineNumber: 74,
                                    columnNumber: 110
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "#ca8a04"
                                }, void 0, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                    lineNumber: 74,
                                    columnNumber: 150
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                            lineNumber: 74,
                            columnNumber: 45
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 39
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M58 54 L72 24 L88 46 L100 18 L112 46 L128 24 L142 54 Q120 60 100 60 Q80 60 58 54 Z",
                        fill: "url(#crownGrad)",
                        stroke: "#854d0e",
                        strokeWidth: "2",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 216
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "58",
                        y: "50",
                        width: "84",
                        height: "8",
                        rx: "2",
                        fill: "#eab308",
                        stroke: "#854d0e",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 390
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "34",
                        r: "4.5",
                        fill: "#dc2626",
                        stroke: "#7f1d1d",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 491
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "78",
                        cy: "40",
                        r: "3.5",
                        fill: "#3b82f6",
                        stroke: "#1e3a8a",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 574
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "122",
                        cy: "40",
                        r: "3.5",
                        fill: "#22c55e",
                        stroke: "#14532d",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 656
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "33",
                        r: "1.4",
                        fill: "white",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 739
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "78",
                        cy: "39",
                        r: "1.1",
                        fill: "white",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 801
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "122",
                        cy: "39",
                        r: "1.1",
                        fill: "white",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 74,
                        columnNumber: 862
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 74,
                columnNumber: 36
            }, this);
        case "cabello-gorro-graduacion":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "56",
                        y: "46",
                        width: "88",
                        height: "16",
                        rx: "3",
                        fill: "#1f1147",
                        stroke: "#0d0826",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 75,
                        columnNumber: 49
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                        points: "100,18 158,46 100,74 42,46",
                        fill: "#1f1147",
                        stroke: "#0d0826",
                        strokeWidth: "1.5",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 75,
                        columnNumber: 151
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "46",
                        r: "3",
                        fill: "#fbbf24",
                        stroke: "#854d0e",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 75,
                        columnNumber: 271
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M156 46 Q168 50 170 60 Q172 64 168 66",
                        fill: "none",
                        stroke: "#fbbf24",
                        strokeWidth: "2.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 75,
                        columnNumber: 352
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "170",
                        cy: "64",
                        r: "5",
                        fill: "#fbbf24",
                        stroke: "#854d0e",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 75,
                        columnNumber: 471
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "167",
                        y1: "66",
                        x2: "165",
                        y2: "72",
                        stroke: "#ca8a04",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 75,
                        columnNumber: 554
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "170",
                        y1: "67",
                        x2: "170",
                        y2: "74",
                        stroke: "#ca8a04",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 75,
                        columnNumber: 629
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "173",
                        y1: "66",
                        x2: "175",
                        y2: "72",
                        stroke: "#ca8a04",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 75,
                        columnNumber: 704
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 75,
                columnNumber: 46
            }, this);
        default:
            return null;
    }
}
function OjosLayer({ clave }) {
    switch(clave){
        case "ojos-felices":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                stroke: "#2d1437",
                strokeWidth: "3.5",
                fill: "none",
                strokeLinecap: "round",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M70 88 Q78 78 86 88"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 82,
                        columnNumber: 106
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M114 88 Q122 78 130 88"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 82,
                        columnNumber: 138
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 82,
                columnNumber: 34
            }, this);
        case "ojos-grandes":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "78",
                        cy: "88",
                        rx: "12",
                        ry: "14",
                        fill: "white",
                        stroke: "#2d1437",
                        strokeWidth: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 83,
                        columnNumber: 37
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "122",
                        cy: "88",
                        rx: "12",
                        ry: "14",
                        fill: "white",
                        stroke: "#2d1437",
                        strokeWidth: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 83,
                        columnNumber: 128
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "80",
                        cy: "90",
                        rx: "7",
                        ry: "9",
                        fill: "url(#irisGrad)"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 83,
                        columnNumber: 220
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "124",
                        cy: "90",
                        rx: "7",
                        ry: "9",
                        fill: "url(#irisGrad)"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 83,
                        columnNumber: 283
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "76",
                        cy: "85",
                        r: "3",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 83,
                        columnNumber: 347
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "120",
                        cy: "85",
                        r: "3",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 83,
                        columnNumber: 392
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "83",
                        cy: "94",
                        r: "1.5",
                        fill: "white",
                        opacity: "0.8"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 83,
                        columnNumber: 438
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "127",
                        cy: "94",
                        r: "1.5",
                        fill: "white",
                        opacity: "0.8"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 83,
                        columnNumber: 499
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 83,
                columnNumber: 34
            }, this);
        case "ojos-corazon":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M78 80 C73 74 66 76 66 82 C66 88 78 96 78 96 C78 96 90 88 90 82 C90 76 83 74 78 80 Z",
                        fill: "#ef4444",
                        stroke: "#7f1d1d",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 84,
                        columnNumber: 37
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M122 80 C117 74 110 76 110 82 C110 88 122 96 122 96 C122 96 134 88 134 82 C134 76 127 74 122 80 Z",
                        fill: "#ef4444",
                        stroke: "#7f1d1d",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 84,
                        columnNumber: 184
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "73",
                        cy: "80",
                        r: "1.6",
                        fill: "white",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 84,
                        columnNumber: 344
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "117",
                        cy: "80",
                        r: "1.6",
                        fill: "white",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 84,
                        columnNumber: 405
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 84,
                columnNumber: 34
            }, this);
        case "ojos-estrella":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                        points: "78,74 81,82 89,83 83,89 85,97 78,93 71,97 73,89 67,83 75,82",
                        fill: "#fbbf24",
                        stroke: "#854d0e",
                        strokeWidth: "1.5",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 85,
                        columnNumber: 38
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                        points: "122,74 125,82 133,83 127,89 129,97 122,93 115,97 117,89 111,83 119,82",
                        fill: "#fbbf24",
                        stroke: "#854d0e",
                        strokeWidth: "1.5",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 85,
                        columnNumber: 191
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "76",
                        cy: "79",
                        r: "1.4",
                        fill: "white",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 85,
                        columnNumber: 354
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "120",
                        cy: "79",
                        r: "1.4",
                        fill: "white",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 85,
                        columnNumber: 415
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 85,
                columnNumber: 35
            }, this);
        case "ojos-cerrados":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                stroke: "#2d1437",
                strokeWidth: "3",
                fill: "none",
                strokeLinecap: "round",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M70 90 Q78 94 86 90"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 86,
                        columnNumber: 105
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M114 90 Q122 94 130 90"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 86,
                        columnNumber: 137
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 86,
                columnNumber: 35
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "78",
                        cy: "88",
                        rx: "7",
                        ry: "9",
                        fill: "white",
                        stroke: "#2d1437",
                        strokeWidth: "2.2"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 87,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "122",
                        cy: "88",
                        rx: "7",
                        ry: "9",
                        fill: "white",
                        stroke: "#2d1437",
                        strokeWidth: "2.2"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 87,
                        columnNumber: 114
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "80",
                        cy: "90",
                        rx: "4",
                        ry: "5.5",
                        fill: "url(#irisGrad)"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 87,
                        columnNumber: 204
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "124",
                        cy: "90",
                        rx: "4",
                        ry: "5.5",
                        fill: "url(#irisGrad)"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 87,
                        columnNumber: 269
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "77",
                        cy: "86",
                        r: "2",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 87,
                        columnNumber: 335
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "121",
                        cy: "86",
                        r: "2",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 87,
                        columnNumber: 380
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "82",
                        cy: "92",
                        r: "1",
                        fill: "white",
                        opacity: "0.7"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 87,
                        columnNumber: 426
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "126",
                        cy: "92",
                        r: "1",
                        fill: "white",
                        opacity: "0.7"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 87,
                        columnNumber: 485
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 87,
                columnNumber: 22
            }, this);
    }
}
function BocaLayer({ clave }) {
    switch(clave){
        case "boca-gran-sonrisa":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M76 106 Q100 132 124 106 Q100 118 76 106 Z",
                        fill: "#7f1d1d",
                        stroke: "#2d1437",
                        strokeWidth: "2",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 93,
                        columnNumber: 42
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M82 108 Q100 120 118 108 L118 110 Q100 122 82 110 Z",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 93,
                        columnNumber: 168
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M92 118 Q100 126 108 118 Q108 124 100 124 Q92 124 92 118 Z",
                        fill: "#fb7185"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 93,
                        columnNumber: 245
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 93,
                columnNumber: 39
            }, this);
        case "boca-lengua":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M84 106 Q100 116 116 106",
                        fill: "none",
                        stroke: "#2d1437",
                        strokeWidth: "2.8",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 94,
                        columnNumber: 36
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "100",
                        cy: "118",
                        rx: "7",
                        ry: "6",
                        fill: "#fb7185",
                        stroke: "#2d1437",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 94,
                        columnNumber: 142
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "100",
                        y1: "114",
                        x2: "100",
                        y2: "121",
                        stroke: "#be123c",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 94,
                        columnNumber: 235
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 94,
                columnNumber: 33
            }, this);
        case "boca-serio":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "90",
                y1: "112",
                x2: "110",
                y2: "112",
                stroke: "#2d1437",
                strokeWidth: "3",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 95,
                columnNumber: 31
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M82 106 Q100 122 118 106",
                fill: "none",
                stroke: "#2d1437",
                strokeWidth: "3",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 96,
                columnNumber: 21
            }, this);
    }
}
function AccesorioLayer({ clave }) {
    switch(clave){
        case "accesorio-gafas":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "78",
                        cy: "88",
                        r: "14",
                        fill: "rgba(255,255,255,0.2)",
                        stroke: "#2d1437",
                        strokeWidth: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 102,
                        columnNumber: 40
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "122",
                        cy: "88",
                        r: "14",
                        fill: "rgba(255,255,255,0.2)",
                        stroke: "#2d1437",
                        strokeWidth: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 102,
                        columnNumber: 137
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M92 88 Q100 84 108 88",
                        fill: "none",
                        stroke: "#2d1437",
                        strokeWidth: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 102,
                        columnNumber: 235
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "64",
                        y1: "86",
                        x2: "56",
                        y2: "84",
                        stroke: "#2d1437",
                        strokeWidth: "2.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 102,
                        columnNumber: 316
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "136",
                        y1: "86",
                        x2: "144",
                        y2: "84",
                        stroke: "#2d1437",
                        strokeWidth: "2.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 102,
                        columnNumber: 413
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M72 82 Q74 80 76 80",
                        fill: "none",
                        stroke: "white",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        opacity: "0.7"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 102,
                        columnNumber: 512
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M116 82 Q118 80 120 80",
                        fill: "none",
                        stroke: "white",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        opacity: "0.7"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 102,
                        columnNumber: 623
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 102,
                columnNumber: 37
            }, this);
        case "accesorio-gafas-sol":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: "sunGrad",
                            x1: "0%",
                            y1: "0%",
                            x2: "0%",
                            y2: "100%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "#312e81"
                                }, void 0, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                    lineNumber: 103,
                                    columnNumber: 113
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "#0d0826"
                                }, void 0, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                                    lineNumber: 103,
                                    columnNumber: 153
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                            lineNumber: 103,
                            columnNumber: 50
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 103,
                        columnNumber: 44
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "64",
                        y: "76",
                        width: "28",
                        height: "22",
                        rx: "6",
                        fill: "url(#sunGrad)",
                        stroke: "#2d1437",
                        strokeWidth: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 103,
                        columnNumber: 219
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "108",
                        y: "76",
                        width: "28",
                        height: "22",
                        rx: "6",
                        fill: "url(#sunGrad)",
                        stroke: "#2d1437",
                        strokeWidth: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 103,
                        columnNumber: 327
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M92 84 Q100 80 108 84",
                        fill: "none",
                        stroke: "#2d1437",
                        strokeWidth: "2.5"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 103,
                        columnNumber: 436
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M68 80 L74 80",
                        stroke: "white",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        opacity: "0.6"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 103,
                        columnNumber: 517
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M112 80 L118 80",
                        stroke: "white",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        opacity: "0.6"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 103,
                        columnNumber: 610
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 103,
                columnNumber: 41
            }, this);
        case "accesorio-varita":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "148",
                        y1: "160",
                        x2: "172",
                        y2: "108",
                        stroke: "#92400e",
                        strokeWidth: "3.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 104,
                        columnNumber: 41
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                        points: "172,98 175,108 185,109 177,116 180,126 172,120 164,126 167,116 159,109 169,108",
                        fill: "#fbbf24",
                        stroke: "#854d0e",
                        strokeWidth: "1.5",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 104,
                        columnNumber: 142
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "178",
                        cy: "100",
                        r: "1.5",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 104,
                        columnNumber: 314
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "166",
                        cy: "118",
                        r: "1",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 104,
                        columnNumber: 363
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "184",
                        cy: "118",
                        r: "1",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 104,
                        columnNumber: 410
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "158",
                        cy: "140",
                        r: "1.5",
                        fill: "#fde047",
                        opacity: "0.8"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 104,
                        columnNumber: 457
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "166",
                        cy: "150",
                        r: "1",
                        fill: "#fde047",
                        opacity: "0.7"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 104,
                        columnNumber: 522
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 104,
                columnNumber: 38
            }, this);
        case "accesorio-estrella":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                        points: "38,140 42,150 52,151 44,158 47,168 38,162 29,168 32,158 24,151 34,150",
                        fill: "#fbbf24",
                        stroke: "#854d0e",
                        strokeWidth: "1.5",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 105,
                        columnNumber: 43
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "35",
                        cy: "151",
                        r: "1.2",
                        fill: "#2d1437"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 105,
                        columnNumber: 206
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "41",
                        cy: "151",
                        r: "1.2",
                        fill: "#2d1437"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 105,
                        columnNumber: 256
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M35 154 Q38 157 41 154",
                        fill: "none",
                        stroke: "#2d1437",
                        strokeWidth: "1",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 105,
                        columnNumber: 306
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "36",
                        cy: "146",
                        r: "0.8",
                        fill: "white",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 105,
                        columnNumber: 408
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "20",
                        cy: "135",
                        r: "1.2",
                        fill: "#fde047",
                        opacity: "0.7"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 105,
                        columnNumber: 470
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "54",
                        cy: "135",
                        r: "1",
                        fill: "#fde047",
                        opacity: "0.7"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 105,
                        columnNumber: 534
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 105,
                columnNumber: 40
            }, this);
        case "accesorio-mascara":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "#1f1147",
                stroke: "#2d1437",
                strokeWidth: "2",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M58 80 Q58 70 70 70 L92 74 Q100 78 100 84 Q100 90 92 90 L70 86 Q58 86 58 80 Z"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 106,
                        columnNumber: 113
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M142 80 Q142 70 130 70 L108 74 Q100 78 100 84 Q100 90 108 90 L130 86 Q142 86 142 80 Z"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                        lineNumber: 106,
                        columnNumber: 203
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 106,
                columnNumber: 39
            }, this);
        default:
            return null;
    }
}
function RopaLayer({ clave }) {
    if (clave === "ropa-capas") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M48 150 Q32 168 38 192 L162 192 Q168 168 152 150 Q130 162 100 162 Q70 162 48 150 Z",
                fill: "url(#grad-ropa-capas)",
                stroke: "#2d1437",
                strokeWidth: "2.5",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 112,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M62 138 Q54 158 56 178 L144 178 Q146 158 138 138 Q120 148 100 148 Q80 148 62 138 Z",
                fill: "url(#grad-ropa-uniforme)",
                stroke: "#2d1437",
                strokeWidth: "2.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 112,
                columnNumber: 224
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "100,154 108,162 100,170 92,162",
                fill: "#fbbf24",
                stroke: "#854d0e",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 112,
                columnNumber: 386
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "100,158 103,162 100,166 97,162",
                fill: "#dc2626"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 112,
                columnNumber: 487
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
        lineNumber: 112,
        columnNumber: 39
    }, this);
    if (clave === "ropa-capucha") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M50 145 Q40 165 44 188 L156 188 Q160 165 150 145 Q130 156 100 156 Q70 156 50 145 Z",
                fill: "url(#grad-ropa-capucha)",
                stroke: "#2d1437",
                strokeWidth: "2.5",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 113,
                columnNumber: 44
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M60 138 Q52 158 54 178 L146 178 Q148 158 140 138 Q120 148 100 148 Q80 148 60 138 Z",
                fill: "url(#grad-ropa-capucha)",
                stroke: "#2d1437",
                strokeWidth: "2.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 113,
                columnNumber: 228
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "92",
                y1: "152",
                x2: "90",
                y2: "172",
                stroke: "#2d1437",
                strokeWidth: "2.2",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 113,
                columnNumber: 389
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "108",
                y1: "152",
                x2: "110",
                y2: "172",
                stroke: "#2d1437",
                strokeWidth: "2.2",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 113,
                columnNumber: 488
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "90",
                cy: "173",
                r: "2.2",
                fill: "#2d1437"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 113,
                columnNumber: 589
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "110",
                cy: "173",
                r: "2.2",
                fill: "#2d1437"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 113,
                columnNumber: 639
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M75 168 Q100 174 125 168 L122 178 L78 178 Z",
                fill: "none",
                stroke: "#2d1437",
                strokeWidth: "1.8",
                opacity: "0.6"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 113,
                columnNumber: 690
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
        lineNumber: 113,
        columnNumber: 41
    }, this);
    if (clave === "ropa-arcoiris") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M62 138 Q54 158 56 178 L144 178 Q146 158 138 138 Q120 148 100 148 Q80 148 62 138 Z",
                fill: "url(#rainbowGrad)",
                stroke: "#2d1437",
                strokeWidth: "2.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 114,
                columnNumber: 45
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M90 138 L100 152 L110 138",
                fill: "none",
                stroke: "#2d1437",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 114,
                columnNumber: 200
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M100 162 C96 158 92 160 92 164 C92 168 100 174 100 174 C100 174 108 168 108 164 C108 160 104 158 100 162 Z",
                fill: "white",
                stroke: "#2d1437",
                strokeWidth: "1.5",
                opacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 114,
                columnNumber: 283
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
        lineNumber: 114,
        columnNumber: 42
    }, this);
    if (clave === "ropa-uniforme") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M62 138 Q54 158 56 178 L144 178 Q146 158 138 138 Q120 148 100 148 Q80 148 62 138 Z",
                fill: "url(#grad-ropa-uniforme)",
                stroke: "#2d1437",
                strokeWidth: "2.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 115,
                columnNumber: 45
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M88 138 L100 154 L112 138 L108 136 L100 148 L92 136 Z",
                fill: "white",
                stroke: "#2d1437",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 115,
                columnNumber: 207
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M96 148 L104 148 L106 158 L104 174 L100 178 L96 174 L94 158 Z",
                fill: "#dc2626",
                stroke: "#2d1437",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 115,
                columnNumber: 321
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
        lineNumber: 115,
        columnNumber: 42
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M62 138 Q54 158 56 178 L144 178 Q146 158 138 138 Q120 148 100 148 Q80 148 62 138 Z",
                fill: "url(#grad-ropa-basica)",
                stroke: "#2d1437",
                strokeWidth: "2.5"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 116,
                columnNumber: 14
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M90 138 L100 152 L110 138",
                fill: "none",
                stroke: "#2d1437",
                strokeWidth: "2",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 116,
                columnNumber: 174
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M68 165 Q100 172 132 165",
                fill: "none",
                stroke: "rgba(255,255,255,0.35)",
                strokeWidth: "2.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
                lineNumber: 116,
                columnNumber: 279
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarSVG.tsx",
        lineNumber: 116,
        columnNumber: 11
    }, this);
}
}),
];

//# sourceMappingURL=Proyecto-De-Modalidad_frontend_src_components_AvatarSVG_tsx_1qrqr53._.js.map