(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Proyecto-De-Modalidad/frontend/src/context/AppContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const STORAGE_KEY = "educaplay_usuario";
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AppProvider({ children }) {
    _s();
    const [usuario, setUsuarioState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [vista, setVista] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("login");
    const [moduloId, setModuloId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [asignaturaId, setAsignaturaId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rolSeleccionado, setRolSeleccionado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ESTUDIANTE");
    const [estudianteSeleccionadoId, setEstudianteSeleccionadoId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hidratado, setHidratado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Cargar usuario desde localStorage al montar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const u = JSON.parse(raw);
                    setUsuarioState(u);
                    setVista("dashboard");
                    setRolSeleccionado(u.rol);
                }
            } catch  {
            /* ignore */ } finally{
                setHidratado(true);
            }
        }
    }["AppProvider.useEffect"], []);
    const setUsuario = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[setUsuario]": (u)=>{
            setUsuarioState(u);
            if (u) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
                } catch  {
                /* ignore */ }
            } else {
                try {
                    localStorage.removeItem(STORAGE_KEY);
                } catch  {
                /* ignore */ }
            }
        }
    }["AppProvider.useCallback[setUsuario]"], []);
    const mostrarToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[mostrarToast]": (mensaje, tipo = "info")=>{
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            setToasts({
                "AppProvider.useCallback[mostrarToast]": (prev)=>[
                        ...prev,
                        {
                            id,
                            mensaje,
                            tipo
                        }
                    ]
            }["AppProvider.useCallback[mostrarToast]"]);
            setTimeout({
                "AppProvider.useCallback[mostrarToast]": ()=>{
                    setToasts({
                        "AppProvider.useCallback[mostrarToast]": (prev)=>prev.filter({
                                "AppProvider.useCallback[mostrarToast]": (t)=>t.id !== id
                            }["AppProvider.useCallback[mostrarToast]"])
                    }["AppProvider.useCallback[mostrarToast]"]);
                }
            }["AppProvider.useCallback[mostrarToast]"], 3500);
        }
    }["AppProvider.useCallback[mostrarToast]"], []);
    const cerrarSesion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[cerrarSesion]": ()=>{
            setUsuarioState(null);
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch  {
            /* ignore */ }
            setVista("login");
            setModuloId(null);
            setAsignaturaId(null);
            setEstudianteSeleccionadoId(null);
            setRolSeleccionado("ESTUDIANTE");
        }
    }["AppProvider.useCallback[cerrarSesion]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AppProvider.useMemo[value]": ()=>({
                usuario,
                vista,
                moduloId,
                asignaturaId,
                rolSeleccionado,
                estudianteSeleccionadoId,
                toasts,
                setUsuario,
                setVista,
                setModuloId,
                setAsignaturaId,
                setRolSeleccionado,
                setEstudianteSeleccionadoId,
                mostrarToast,
                cerrarSesion
            })
    }["AppProvider.useMemo[value]"], [
        usuario,
        vista,
        moduloId,
        asignaturaId,
        rolSeleccionado,
        estudianteSeleccionadoId,
        toasts,
        setUsuario,
        mostrarToast,
        cerrarSesion
    ]);
    // Evitar parpadeo de login antes de hidratar localStorage
    if (!hidratado) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/context/AppContext.tsx",
        lineNumber: 161,
        columnNumber: 10
    }, this);
}
_s(AppProvider, "FdnU2l1y2mtBqtUrR6GYuzWhg90=");
_c = AppProvider;
function useApp() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!ctx) {
        throw new Error("useApp debe usarse dentro de <AppProvider>");
    }
    return ctx;
}
_s1(useApp, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Proyecto-De-Modalidad/frontend/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
const PORT = "XTransformPort=3001";
async function http(path, options) {
    const sep = path.includes("?") ? "&" : "?";
    const url = `${path}${sep}${PORT}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers ?? {}
        }
    });
    if (!res.ok) {
        let mensaje = `Error ${res.status}`;
        try {
            const data = await res.json();
            mensaje = data.message || data.error || data.mensaje || mensaje;
        } catch  {
            try {
                const text = await res.text();
                if (text) mensaje = text;
            } catch  {
            /* ignore */ }
        }
        throw new Error(mensaje);
    }
    // Some DELETE / void endpoints may return empty body
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        return undefined;
    }
    const text = await res.text();
    if (!text) return undefined;
    return JSON.parse(text);
}
function post(path, body) {
    return http(path, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined
    });
}
function del(path) {
    return http(path, {
        method: "DELETE"
    });
}
function get(path) {
    return http(path, {
        method: "GET"
    });
}
const api = {
    // Usuarios
    login (nombre, pin, rol) {
        return post("/api/usuarios/login", {
            nombre,
            pin,
            rol
        });
    },
    loginDemo (rol) {
        return post("/api/usuarios/demo", {
            rol
        });
    },
    crearUsuario (nombre, pin, rol) {
        return post("/api/usuarios", {
            nombre,
            pin,
            rol
        });
    },
    obtenerPerfil (id) {
        return get(`/api/usuarios/perfil/${id}`);
    },
    obtenerProgreso (id) {
        return get(`/api/usuarios/progreso/${id}`);
    },
    obtenerRanking () {
        return get(`/api/usuarios/ranking`);
    },
    obtenerHijos (padreId) {
        return get(`/api/usuarios/padres/${padreId}/hijos`);
    },
    vincularHijo (padreId, data) {
        return post(`/api/usuarios/padres/${padreId}/hijo`, data);
    },
    desvincularHijo (padreId, hijoId) {
        return del(`/api/usuarios/padres/${padreId}/hijo/${hijoId}`);
    },
    obtenerEstudiantesMaestro (maestroId) {
        return get(`/api/usuarios/maestros/${maestroId}/estudiantes`);
    },
    obtenerAsignaturasMaestro (maestroId) {
        return get(`/api/usuarios/maestros/${maestroId}/asignaturas`);
    },
    // Desafios / Asignaturas / Modulos
    obtenerAsignaturas () {
        return get(`/api/desafios/asignaturas`);
    },
    obtenerModulos (asignaturaId) {
        return get(`/api/desafios/modulos/${asignaturaId}`);
    },
    obtenerDesafios (moduloId) {
        return get(`/api/desafios/modulo/${moduloId}`);
    },
    seedDesafios () {
        return post(`/api/desafios/seed`);
    },
    crearAsignatura (nombre, descripcion, maestroId) {
        return post(`/api/desafios/asignaturas`, {
            nombre,
            descripcion,
            maestroId
        });
    },
    crearModulo (asignaturaId, titulo, nivelMinimo = 1) {
        return post(`/api/desafios/modulos`, {
            asignaturaId,
            titulo,
            nivelMinimo
        });
    },
    crearDesafio (data) {
        return post(`/api/desafios/desafios`, data);
    },
    eliminarAsignatura (id) {
        return del(`/api/desafios/asignaturas/${id}`);
    },
    eliminarModulo (id) {
        return del(`/api/desafios/modulos/${id}`);
    },
    eliminarDesafio (id) {
        return del(`/api/desafios/desafios/${id}`);
    },
    // Progreso
    responder (usuarioId, desafioId, opcionId) {
        return post(`/api/progreso/responder`, {
            usuarioId,
            desafioId,
            opcionId
        });
    },
    obtenerMedallas (usuarioId) {
        return get(`/api/progreso/medallas/${usuarioId}`);
    },
    // Avatares
    obtenerTienda () {
        return get(`/api/avatars/tienda`);
    },
    obtenerMiAvatar (usuarioId) {
        return get(`/api/avatars/mi-avatar/${usuarioId}`);
    },
    comprar (usuarioId, itemId) {
        return post(`/api/avatars/comprar/${usuarioId}`, {
            itemId
        });
    },
    equipar (usuarioId, itemId) {
        return post(`/api/avatars/equipar/${usuarioId}`, {
            itemId
        });
    },
    seedTienda () {
        return post(`/api/avatars/seed`);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Proyecto-De-Modalidad/frontend/src/data/bancoDesafios.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// 📚 BANCO DE DESAFÍOS — EducaPlay
// -----------------------------------------------------------------------------
// 30 desafíos curriculares para 3.er grado de primaria (8-9 años)
//   • 15 de Matemáticas (5 Fácil · 5 Medio · 5 Difícil)
//   • 15 de Lengua y Literatura (5 Fácil · 5 Medio · 5 Difícil)
//
// Formato de salida solicitado por el usuario (Android Studio / Kotlin data class):
//
//   data class Desafio(
//       val id: String,                       // Ej. "MAT_FACIL_01"
//       val materia: String,                  // "Matemáticas" | "Lengua"
//       val dificultad: String,               // "Fácil" | "Medio" | "Difícil"
//       val tipo_mecanica: String,            // "Opción Múltiple" | "Arrastrar y Soltar" | "Completar Espacio"
//       val enunciado: String,                // Pregunta clara y corta
//       val opciones: List<String>,           // 3 opciones cortas
//       val respuesta_correcta: String,       // Debe coincidir exactamente con una de `opciones`
//       val pista_retroalimentacion: String   // Frase amigable de ayuda si el niño falla
//   )
//
// Paletas curriculares:
//   MAT_FACIL   → Sumas/restas 3 dígitos sin llevar + figuras (vértices/lados)
//   MAT_MEDIO   → Multiplicaciones 1 cifra (tablas 2-9) problemas cotidianos + fracciones simples visuales
//   MAT_DIFICIL → Divisiones exactas simples + sucesiones lógicas + lógica 2 pasos
//   LEN_FACIL   → Sinónimos/antónimos sencillos + separación en sílabas
//   LEN_MEDIO   → Sustantivos propios/comunes + verbos (presente/pasado/futuro) + uso b/v, c/s/z
//   LEN_DIFICIL → Comprensión lectora micro-historias (idea principal) + sujeto/predicado
// =============================================================================
__turbopack_context__.s([
    "BANCO_DESAFIOS",
    ()=>BANCO_DESAFIOS,
    "DIFICULTADES",
    ()=>DIFICULTADES,
    "MATERIAS",
    ()=>MATERIAS,
    "RESUMEN_BANCO",
    ()=>RESUMEN_BANCO,
    "desafiosPorBloque",
    ()=>desafiosPorBloque,
    "desafiosPorDificultad",
    ()=>desafiosPorDificultad,
    "desafiosPorMateria",
    ()=>desafiosPorMateria
]);
const BANCO_DESAFIOS = [
    // ===========================================================================
    // 🧮 MATEMÁTICAS — NIVEL FÁCIL (5)
    //   Suma/resta 3 dígitos sin llevar + figuras geométricas (vértices/lados)
    // ===========================================================================
    {
        id: "MAT_FACIL_01",
        materia: "Matemáticas",
        dificultad: "Fácil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "¿Cuánto es 124 + 213?",
        opciones: [
            "337",
            "327",
            "347"
        ],
        respuesta_correcta: "337",
        pista_retroalimentacion: "Suma primero las unidades: 4 + 3 = 7. ¡Luego decenas y centenas!"
    },
    {
        id: "MAT_FACIL_02",
        materia: "Matemáticas",
        dificultad: "Fácil",
        tipo_mecanica: "Completar Espacio",
        enunciado: "Completa la operación: 458 − ___ = 221",
        opciones: [
            "237",
            "227",
            "247"
        ],
        respuesta_correcta: "237",
        pista_retroalimentacion: "Resta unidades: 8 − 7 = 1, decenas: 5 − 3 = 2, centenas: 4 − 2 = 2."
    },
    {
        id: "MAT_FACIL_03",
        materia: "Matemáticas",
        dificultad: "Fácil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "¿Qué figura geométrica tiene 3 vértices?",
        opciones: [
            "Triángulo",
            "Cuadrado",
            "Círculo"
        ],
        respuesta_correcta: "Triángulo",
        pista_retroalimentacion: "Tri- significa tres. ¡Un triángulo tiene 3 esquinas (vértices)!"
    },
    {
        id: "MAT_FACIL_04",
        materia: "Matemáticas",
        dificultad: "Fácil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "¿Cuántos lados tiene un cuadrado?",
        opciones: [
            "4 lados",
            "3 lados",
            "5 lados"
        ],
        respuesta_correcta: "4 lados",
        pista_retroalimentacion: "Cuenta los bordes rectos del cuadrado: 1, 2, 3, 4 lados."
    },
    {
        id: "MAT_FACIL_05",
        materia: "Matemáticas",
        dificultad: "Fácil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "Juan tiene 312 canicas y gana 124 más. ¿Cuántas tiene ahora?",
        opciones: [
            "436",
            "426",
            "446"
        ],
        respuesta_correcta: "436",
        pista_retroalimentacion: "Suma 312 + 124 sin llevar. ¡Empieza por las unidades!"
    },
    // ===========================================================================
    // 🧮 MATEMÁTICAS — NIVEL MEDIO (5)
    //   Multiplicaciones 1 cifra (tablas 2-9) problemas cotidianos + fracciones
    // ===========================================================================
    {
        id: "MAT_MEDIO_01",
        materia: "Matemáticas",
        dificultad: "Medio",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "Hay 6 cajas con 4 lápices cada una. ¿Cuántos lápices hay en total?",
        opciones: [
            "24",
            "10",
            "28"
        ],
        respuesta_correcta: "24",
        pista_retroalimentacion: "Multiplica 6 × 4. ¡Cuenta de 4 en 4, seis veces: 4, 8, 12...!"
    },
    {
        id: "MAT_MEDIO_02",
        materia: "Matemáticas",
        dificultad: "Medio",
        tipo_mecanica: "Completar Espacio",
        enunciado: "Completa: 7 × 8 = ___",
        opciones: [
            "56",
            "54",
            "63"
        ],
        respuesta_correcta: "56",
        pista_retroalimentacion: "Truco: 5, 6, 7, 8 → 56 = 7 × 8. ¡Recuerda este pareo!"
    },
    {
        id: "MAT_MEDIO_03",
        materia: "Matemáticas",
        dificultad: "Medio",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "Cada paquete trae 5 galletas. Compro 9 paquetes. ¿Cuántas galletas tengo?",
        opciones: [
            "45",
            "40",
            "50"
        ],
        respuesta_correcta: "45",
        pista_retroalimentacion: "Multiplica 5 × 9. ¡La tabla del 5 termina siempre en 0 o en 5!"
    },
    {
        id: "MAT_MEDIO_04",
        materia: "Matemáticas",
        dificultad: "Medio",
        tipo_mecanica: "Arrastrar y Soltar",
        enunciado: "Parto una pizza en 2 partes iguales y tomo 1. Arrastra la fracción que tomé.",
        opciones: [
            "1/2 (un medio)",
            "1/4 (un cuarto)",
            "1/3 (un tercio)"
        ],
        respuesta_correcta: "1/2 (un medio)",
        pista_retroalimentacion: "2 partes iguales = medios. Tomé 1 de 2 partes, ¡es un medio!"
    },
    {
        id: "MAT_MEDIO_05",
        materia: "Matemáticas",
        dificultad: "Medio",
        tipo_mecanica: "Arrastrar y Soltar",
        enunciado: "Un chocolate se parte en 4 pedazos iguales y como 1. Arrastra la fracción correcta.",
        opciones: [
            "1/4 (un cuarto)",
            "1/2 (un medio)",
            "3/4 (tres cuartos)"
        ],
        respuesta_correcta: "1/4 (un cuarto)",
        pista_retroalimentacion: "4 partes iguales = cuartos. Comí 1 de 4 pedazos, ¡es un cuarto!"
    },
    // ===========================================================================
    // 🧮 MATEMÁTICAS — NIVEL DIFÍCIL (5)
    //   Divisiones exactas simples + sucesiones + lógica 2 pasos
    // ===========================================================================
    {
        id: "MAT_DIFICIL_01",
        materia: "Matemáticas",
        dificultad: "Difícil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "¿Cuánto es 24 ÷ 6?",
        opciones: [
            "4",
            "6",
            "5"
        ],
        respuesta_correcta: "4",
        pista_retroalimentacion: "Piensa: ¿6 × ? = 24? La tabla del 6 te ayuda: 6 × 4 = 24."
    },
    {
        id: "MAT_DIFICIL_02",
        materia: "Matemáticas",
        dificultad: "Difícil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "Reparto 18 caramelos entre 3 amigos en partes iguales. ¿Cuántos toca a cada uno?",
        opciones: [
            "6",
            "5",
            "9"
        ],
        respuesta_correcta: "6",
        pista_retroalimentacion: "Divide 18 ÷ 3. ¡Busca qué número multiplicado por 3 da 18!"
    },
    {
        id: "MAT_DIFICIL_03",
        materia: "Matemáticas",
        dificultad: "Difícil",
        tipo_mecanica: "Completar Espacio",
        enunciado: "Descubre el patrón y completa: 3, 6, 9, 12, ___",
        opciones: [
            "15",
            "14",
            "18"
        ],
        respuesta_correcta: "15",
        pista_retroalimentacion: "Suma 3 cada vez: 3, 6, 9, 12... ¡el siguiente es 12 + 3 = 15!"
    },
    {
        id: "MAT_DIFICIL_04",
        materia: "Matemáticas",
        dificultad: "Difícil",
        tipo_mecanica: "Completar Espacio",
        enunciado: "Continúa la serie: 2, 4, 8, 16, ___",
        opciones: [
            "32",
            "24",
            "20"
        ],
        respuesta_correcta: "32",
        pista_retroalimentacion: "Cada número se multiplica por 2: 2×2=4, 4×2=8... ¡sigue duplicando!"
    },
    {
        id: "MAT_DIFICIL_05",
        materia: "Matemáticas",
        dificultad: "Difícil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "Tengo 3 bolsas con 5 manzanas cada una y regalo 4. ¿Cuántas me quedan?",
        opciones: [
            "11",
            "15",
            "9"
        ],
        respuesta_correcta: "11",
        pista_retroalimentacion: "Dos pasos: primero 3 × 5 = 15, luego 15 − 4 = 11. ¡Tú puedes!"
    },
    // ===========================================================================
    // 📖 LENGUA Y LITERATURA — NIVEL FÁCIL (5)
    //   Sinónimos/antónimos sencillos + separación en sílabas
    // ===========================================================================
    {
        id: "LEN_FACIL_01",
        materia: "Lengua",
        dificultad: "Fácil",
        tipo_mecanica: "Arrastrar y Soltar",
        enunciado: "Arrastra el sinónimo de la palabra «grande».",
        opciones: [
            "enorme",
            "chico",
            "feo"
        ],
        respuesta_correcta: "enorme",
        pista_retroalimentacion: "Busca la palabra que describe algo de gran tamaño. ¡Chico es lo opuesto!"
    },
    {
        id: "LEN_FACIL_02",
        materia: "Lengua",
        dificultad: "Fácil",
        tipo_mecanica: "Arrastrar y Soltar",
        enunciado: "Arrastra el antónimo de la palabra «frío».",
        opciones: [
            "caliente",
            "tibio",
            "helado"
        ],
        respuesta_correcta: "caliente",
        pista_retroalimentacion: "El antónimo es lo opuesto. ¡Lo opuesto de frío es caliente!"
    },
    {
        id: "LEN_FACIL_03",
        materia: "Lengua",
        dificultad: "Fácil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "¿Cuántas sílabas tiene la palabra «ca-ma»?",
        opciones: [
            "2 sílabas",
            "3 sílabas",
            "1 sílaba"
        ],
        respuesta_correcta: "2 sílabas",
        pista_retroalimentacion: "Separa la palabra con palmadas: ca-ma. ¡Dos palmadas, dos sílabas!"
    },
    {
        id: "LEN_FACIL_04",
        materia: "Lengua",
        dificultad: "Fácil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "¿Cuántas sílabas tiene la palabra «ma-ri-po-sa»?",
        opciones: [
            "4 sílabas",
            "3 sílabas",
            "5 sílabas"
        ],
        respuesta_correcta: "4 sílabas",
        pista_retroalimentacion: "Cuenta cada pedacito: ma-ri-po-sa. ¡Cuatro sílabas!"
    },
    {
        id: "LEN_FACIL_05",
        materia: "Lengua",
        dificultad: "Fácil",
        tipo_mecanica: "Arrastrar y Soltar",
        enunciado: "Arrastra el sinónimo de la palabra «feliz».",
        opciones: [
            "contento",
            "triste",
            "cansado"
        ],
        respuesta_correcta: "contento",
        pista_retroalimentacion: "Piensa cómo te sientes cuando estás feliz: ¡contento!"
    },
    // ===========================================================================
    // 📖 LENGUA Y LITERATURA — NIVEL MEDIO (5)
    //   Sustantivos propios/comunes + verbos (tiempo) + uso b/v, c/s/z
    // ===========================================================================
    {
        id: "LEN_MEDIO_01",
        materia: "Lengua",
        dificultad: "Medio",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "¿Cuál de estas palabras es un sustantivo común?",
        opciones: [
            "perro",
            "México",
            "Ana"
        ],
        respuesta_correcta: "perro",
        pista_retroalimentacion: "Los sustantivos comunes no llevan mayúscula. ¡«perro» es común!"
    },
    {
        id: "LEN_MEDIO_02",
        materia: "Lengua",
        dificultad: "Medio",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "¿Cuál de estas palabras es un sustantivo propio?",
        opciones: [
            "Colombia",
            "ciudad",
            "río"
        ],
        respuesta_correcta: "Colombia",
        pista_retroalimentacion: "Los nombres propios se escriben con mayúscula inicial. ¡Como los países!"
    },
    {
        id: "LEN_MEDIO_03",
        materia: "Lengua",
        dificultad: "Medio",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "En «Yo juego en el parque», ¿en qué tiempo está el verbo «juego»?",
        opciones: [
            "Presente",
            "Pasado",
            "Futuro"
        ],
        respuesta_correcta: "Presente",
        pista_retroalimentacion: "Si ocurre ahora mismo, es presente. ¡Yo juego = ocurre hoy!"
    },
    {
        id: "LEN_MEDIO_04",
        materia: "Lengua",
        dificultad: "Medio",
        tipo_mecanica: "Completar Espacio",
        enunciado: "Completa con b o v: «En ___ierno hace frío»",
        opciones: [
            "invierno (con v)",
            "imbierno (con b)",
            "inbierno (con b)"
        ],
        respuesta_correcta: "invierno (con v)",
        pista_retroalimentacion: "Después de la letra «n» se escribe «v». ¡In-vierno!"
    },
    {
        id: "LEN_MEDIO_05",
        materia: "Lengua",
        dificultad: "Medio",
        tipo_mecanica: "Completar Espacio",
        enunciado: "Completa con c, s o z: «El pájaro ___anta en el árbol»",
        opciones: [
            "canta (con c)",
            "santa (con s)",
            "zanta (con z)"
        ],
        respuesta_correcta: "canta (con c)",
        pista_retroalimentacion: "Antes de «a» se usa «c» para el sonido /k/. ¡Ca, co, cu se escriben con c!"
    },
    // ===========================================================================
    // 📖 LENGUA Y LITERATURA — NIVEL DIFÍCIL (5)
    //   Comprensión lectora micro-historias + sujeto/predicado
    // ===========================================================================
    {
        id: "LEN_DIFICIL_01",
        materia: "Lengua",
        dificultad: "Difícil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "Lee: «Lucía fue al zoológico y vio leones, monos y elefantes. Su animal favorito fue el león.» ¿De qué trata principalmente el texto?",
        opciones: [
            "De la visita de Lucía al zoológico",
            "De los leones del zoológico",
            "De los animales del bosque"
        ],
        respuesta_correcta: "De la visita de Lucía al zoológico",
        pista_retroalimentacion: "La idea principal resume TODO el texto. ¡No te fijes solo en una parte!"
    },
    {
        id: "LEN_DIFICIL_02",
        materia: "Lengua",
        dificultad: "Difícil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "Lee: «Pedro sembró una semilla. La regó cada día. Después de dos semanas, brotó una plantita.» ¿Qué hizo Pedro?",
        opciones: [
            "Cuidó una semilla hasta que brotó",
            "Compró una plantita ya hecha",
            "Pintó un árbol grande"
        ],
        respuesta_correcta: "Cuidó una semilla hasta que brotó",
        pista_retroalimentacion: "Sigue las acciones de Pedro en orden: sembró, regó, brotó. ¡Eso es cuidar!"
    },
    {
        id: "LEN_DIFICIL_03",
        materia: "Lengua",
        dificultad: "Difícil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "En la oración «El gato duerme en el sofá», ¿cuál es el sujeto?",
        opciones: [
            "El gato",
            "duerme en el sofá",
            "el sofá"
        ],
        respuesta_correcta: "El gato",
        pista_retroalimentacion: "El sujeto es de quién o qué hablamos. Pregunta: ¿quién duerme? ¡El gato!"
    },
    {
        id: "LEN_DIFICIL_04",
        materia: "Lengua",
        dificultad: "Difícil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "En la oración «María dibuja una casa», ¿cuál es el predicado?",
        opciones: [
            "dibuja una casa",
            "María",
            "una casa"
        ],
        respuesta_correcta: "dibuja una casa",
        pista_retroalimentacion: "El predicado es lo que se dice del sujeto. Pregunta: ¿qué hace María? ¡Dibuja una casa!"
    },
    {
        id: "LEN_DIFICIL_05",
        materia: "Lengua",
        dificultad: "Difícil",
        tipo_mecanica: "Opción Múltiple",
        enunciado: "Lee: «Tomás lavó los platos. Luego ordenó su cuarto. Después hizo la tarea.» ¿Cuál es la idea principal?",
        opciones: [
            "Tomás ayudó en casa y estudió",
            "Tomás solo lavó los platos",
            "Tomás jugó en el parque"
        ],
        respuesta_correcta: "Tomás ayudó en casa y estudió",
        pista_retroalimentacion: "La idea principal resume todo: ayudó en casa (platos + cuarto) y estudió (tarea)."
    }
];
const DIFICULTADES = [
    "Fácil",
    "Medio",
    "Difícil"
];
const MATERIAS = [
    "Matemáticas",
    "Lengua"
];
function desafiosPorMateria(materia) {
    return BANCO_DESAFIOS.filter((d)=>d.materia === materia);
}
function desafiosPorDificultad(dificultad) {
    return BANCO_DESAFIOS.filter((d)=>d.dificultad === dificultad);
}
function desafiosPorBloque(materia, dificultad) {
    return BANCO_DESAFIOS.filter((d)=>d.materia === materia && d.dificultad === dificultad);
}
const RESUMEN_BANCO = {
    total: BANCO_DESAFIOS.length,
    matematicas: BANCO_DESAFIOS.filter((d)=>d.materia === "Matemáticas").length,
    lengua: BANCO_DESAFIOS.filter((d)=>d.materia === "Lengua").length,
    facil: BANCO_DESAFIOS.filter((d)=>d.dificultad === "Fácil").length,
    medio: BANCO_DESAFIOS.filter((d)=>d.dificultad === "Medio").length,
    dificil: BANCO_DESAFIOS.filter((d)=>d.dificultad === "Difícil").length
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$LoginScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/LoginScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/Dashboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$SubjectView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/SubjectView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ModuleView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ModuleView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$AvatarCustomizer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarCustomizer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$RankingView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/RankingView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ProfileView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ProfileView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ParentDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ParentDashboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$TeacherDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/TeacherDashboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$StudentProgressView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/StudentProgressView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ContentManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ContentManager.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$BancoDesafiosViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/BancoDesafiosViewer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ContenidoMINEDViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ContenidoMINEDViewer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Toasts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/Toasts.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function Router() {
    _s();
    const { usuario, vista } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    if (!usuario) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$LoginScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginScreen"], {}, void 0, false, {
            fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
            lineNumber: 25,
            columnNumber: 12
        }, this);
    }
    let contenido = null;
    switch(vista){
        case "dashboard":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 31,
                columnNumber: 19
            }, this);
            break;
        case "asignatura":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$SubjectView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubjectView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 34,
                columnNumber: 19
            }, this);
            break;
        case "modulo":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ModuleView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModuleView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 37,
                columnNumber: 19
            }, this);
            break;
        case "avatar":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$AvatarCustomizer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarCustomizer"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 40,
                columnNumber: 19
            }, this);
            break;
        case "ranking":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$RankingView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RankingView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 43,
                columnNumber: 19
            }, this);
            break;
        case "perfil":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ProfileView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProfileView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 46,
                columnNumber: 19
            }, this);
            break;
        case "padre":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ParentDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ParentDashboard"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 49,
                columnNumber: 19
            }, this);
            break;
        case "maestro":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$TeacherDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TeacherDashboard"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 52,
                columnNumber: 19
            }, this);
            break;
        case "progreso-estudiante":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$StudentProgressView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudentProgressView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 55,
                columnNumber: 19
            }, this);
            break;
        case "contenido":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ContentManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContentManager"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 58,
                columnNumber: 19
            }, this);
            break;
        case "banco-desafios":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$BancoDesafiosViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BancoDesafiosViewer"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 61,
                columnNumber: 19
            }, this);
            break;
        case "contenido-mined":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ContenidoMINEDViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContenidoMINEDViewer"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 64,
                columnNumber: 19
            }, this);
            break;
        default:
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 67,
                columnNumber: 19
            }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pop",
                children: contenido
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Router, "XwxkuyfM8fUtqYiJldzkmdLK5/0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = Router;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppProvider"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Router, {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Toasts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastContainer"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_c1 = Page;
var _c, _c1;
__turbopack_context__.k.register(_c, "Router");
__turbopack_context__.k.register(_c1, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Proyecto-De-Modalidad_frontend_src_0gzckse._.js.map