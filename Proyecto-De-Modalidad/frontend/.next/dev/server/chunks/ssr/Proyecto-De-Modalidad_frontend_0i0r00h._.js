module.exports = [
"[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata,
    "viewport",
    ()=>viewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
;
const metadata = {
    title: "EducaPlay — Aprende jugando",
    description: "EducaPlay: plataforma educativa gamificada para estudiantes de 3er grado. Aprende jugando con desafíos, medallas y avatares."
};
const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#07061f"
};
// Floating runes — math & literary symbols drifting in the blurred background
const RUNAS = [
    {
        s: "π",
        top: "8%",
        left: "6%",
        size: "3.2rem",
        color: "rgba(34,211,238,0.18)",
        delay: "0s"
    },
    {
        s: "∑",
        top: "18%",
        left: "82%",
        size: "3rem",
        color: "rgba(251,191,36,0.16)",
        delay: "1.5s"
    },
    {
        s: "√",
        top: "62%",
        left: "4%",
        size: "2.6rem",
        color: "rgba(34,211,238,0.15)",
        delay: "0.8s"
    },
    {
        s: "∞",
        top: "78%",
        left: "88%",
        size: "2.8rem",
        color: "rgba(251,113,133,0.16)",
        delay: "2.2s"
    },
    {
        s: "×",
        top: "40%",
        left: "92%",
        size: "2.2rem",
        color: "rgba(139,92,246,0.18)",
        delay: "1.1s"
    },
    {
        s: "÷",
        top: "88%",
        left: "30%",
        size: "2.4rem",
        color: "rgba(34,211,238,0.14)",
        delay: "0.4s"
    },
    {
        s: "+",
        top: "12%",
        left: "48%",
        size: "2.6rem",
        color: "rgba(251,191,36,0.16)",
        delay: "1.8s"
    },
    {
        s: "=",
        top: "50%",
        left: "14%",
        size: "2.2rem",
        color: "rgba(139,92,246,0.16)",
        delay: "2.6s"
    },
    {
        s: "A",
        top: "28%",
        left: "26%",
        size: "2.6rem",
        color: "rgba(251,113,133,0.16)",
        delay: "0.6s"
    },
    {
        s: "¿?",
        top: "70%",
        left: "70%",
        size: "2.4rem",
        color: "rgba(251,191,36,0.15)",
        delay: "1.3s"
    },
    {
        s: "¡!",
        top: "34%",
        left: "64%",
        size: "2.2rem",
        color: "rgba(34,211,238,0.15)",
        delay: "2.0s"
    },
    {
        s: "Ñ",
        top: "84%",
        left: "54%",
        size: "2.6rem",
        color: "rgba(251,113,133,0.15)",
        delay: "0.9s"
    }
];
// Golden stardust clusters (twinkling dots)
const ESTRELLAS = [
    {
        top: "12%",
        left: "22%",
        delay: "0s",
        size: "2px"
    },
    {
        top: "24%",
        left: "68%",
        delay: "0.8s",
        size: "3px"
    },
    {
        top: "36%",
        left: "40%",
        delay: "1.4s",
        size: "2px"
    },
    {
        top: "48%",
        left: "10%",
        delay: "0.4s",
        size: "3px"
    },
    {
        top: "16%",
        left: "88%",
        delay: "2.0s",
        size: "2px"
    },
    {
        top: "58%",
        left: "82%",
        delay: "1.1s",
        size: "2px"
    },
    {
        top: "68%",
        left: "34%",
        delay: "0.2s",
        size: "3px"
    },
    {
        top: "80%",
        left: "62%",
        delay: "1.7s",
        size: "2px"
    },
    {
        top: "88%",
        left: "16%",
        delay: "0.6s",
        size: "2px"
    },
    {
        top: "44%",
        left: "94%",
        delay: "2.3s",
        size: "3px"
    },
    {
        top: "6%",
        left: "54%",
        delay: "1.2s",
        size: "2px"
    },
    {
        top: "92%",
        left: "78%",
        delay: "0.5s",
        size: "2px"
    },
    {
        top: "30%",
        left: "8%",
        delay: "1.9s",
        size: "2px"
    },
    {
        top: "64%",
        left: "50%",
        delay: "0.3s",
        size: "3px"
    },
    {
        top: "22%",
        left: "44%",
        delay: "2.5s",
        size: "2px"
    },
    {
        top: "76%",
        left: "90%",
        delay: "1.0s",
        size: "2px"
    }
];
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "es",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.googleapis.com"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.gstatic.com",
                        crossOrigin: "anonymous"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                className: "min-h-screen flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": true,
                        className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-violet-600/30 blur-[110px] animate-float"
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-1/3 -right-24 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-[120px] animate-float",
                                style: {
                                    animationDelay: "0.7s"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full bg-rose-500/20 blur-[110px] animate-float",
                                style: {
                                    animationDelay: "1.4s"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute -bottom-24 right-1/4 h-[24rem] w-[24rem] rounded-full bg-indigo-600/25 blur-[110px] animate-float",
                                style: {
                                    animationDelay: "0.3s"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 opacity-70",
                                style: {
                                    backgroundImage: "radial-gradient(circle, rgba(251,191,36,0.7) 1px, transparent 1.6px)",
                                    backgroundSize: "70px 70px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 opacity-40",
                                style: {
                                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1.4px)",
                                    backgroundSize: "120px 120px",
                                    backgroundPosition: "30px 60px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            ESTRELLAS.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute rounded-full bg-amber-300 animate-twinkle",
                                    style: {
                                        top: e.top,
                                        left: e.left,
                                        width: e.size,
                                        height: e.size,
                                        animationDelay: e.delay,
                                        boxShadow: "0 0 6px rgba(251,191,36,0.9)"
                                    }
                                }, `star-${i}`, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)),
                            RUNAS.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute font-bold animate-drift select-none",
                                    style: {
                                        top: r.top,
                                        left: r.left,
                                        fontSize: r.size,
                                        color: r.color,
                                        animationDelay: r.delay,
                                        filter: "blur(0.5px)",
                                        textShadow: "0 0 18px currentColor"
                                    },
                                    children: r.s
                                }, `runa-${i}`, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0",
                                style: {
                                    background: "radial-gradient(ellipse at center, transparent 50%, rgba(2,1,12,0.65) 100%)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 relative z-0",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "mt-auto border-t border-cyan-400/25 bg-violet-950/40 py-4 backdrop-blur-md",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-6xl px-4 text-center text-xs font-semibold text-cyan-200/80",
                            children: [
                                "EducaPlay · Cristal del Saber · Hecho con cariño para estudiantes de 3er grado ·",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-1 text-amber-300/90",
                                    children: "Aprende jugando"
                                }, void 0, false, {
                                    fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
"[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=Proyecto-De-Modalidad_frontend_0i0r00h._.js.map