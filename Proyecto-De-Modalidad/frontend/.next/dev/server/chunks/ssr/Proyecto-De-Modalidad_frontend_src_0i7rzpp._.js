module.exports = [
"[project]/Proyecto-De-Modalidad/frontend/src/context/AppContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const STORAGE_KEY = "educaplay_usuario";
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AppProvider({ children }) {
    const [usuario, setUsuarioState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [vista, setVista] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("login");
    const [moduloId, setModuloId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [asignaturaId, setAsignaturaId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rolSeleccionado, setRolSeleccionado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("ESTUDIANTE");
    const [estudianteSeleccionadoId, setEstudianteSeleccionadoId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hidratado, setHidratado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Cargar usuario desde localStorage al montar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, []);
    const setUsuario = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((u)=>{
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
    }, []);
    const mostrarToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((mensaje, tipo = "info")=>{
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setToasts((prev)=>[
                ...prev,
                {
                    id,
                    mensaje,
                    tipo
                }
            ]);
        setTimeout(()=>{
            setToasts((prev)=>prev.filter((t)=>t.id !== id));
        }, 3500);
    }, []);
    const cerrarSesion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
    }, []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
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
        }), [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/context/AppContext.tsx",
        lineNumber: 165,
        columnNumber: 10
    }, this);
}
function useApp() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!ctx) {
        throw new Error("useApp debe usarse dentro de <AppProvider>");
    }
    return ctx;
}
}),
"[project]/Proyecto-De-Modalidad/frontend/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Proyecto-De-Modalidad/frontend/src/data/bancoDesafios.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Proyecto-De-Modalidad/frontend/src/data/pulperiaFracciones.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * La Pulpería de Fracciones — Diseño de Niveles (Game Design)
 * -----------------------------------------------------------
 * Minijuego educativo para 3er grado (MINED Nicaragua).
 *
 * Mecánica: Un niño atiende una pulpería. Llega un cliente y pide una
 * fracción de un producto típico local. El niño debe:
 *   1. Dividir el objeto visual en `denominador_cortes` partes iguales.
 *   2. Arrastrar `numerador_pedido` partes hacia el cliente.
 *
 * Progresión pedagógica:
 *   N1  1/2  → mitades (concepto base)
 *   N2  1/4  → cuartos
 *   N3  2/4  → equivalencia con 1/2 (mismo objeto, distinta representación)
 *   N4  1/3  → tercios (denominador impar, nueva idea)
 *   N5  2/3  → numerador > 1 con tercios
 *   N6  3/4  → casi el entero (concepto "casi todo")
 *   N7  1/6  → sextos (partes más pequeñas)
 *   N8  5/8  → octavos con numerador alto (desafío)
 *   N9  3/8  → octavos con numerador bajo (menos de la mitad)
 *   N10 5/6  → cierre: casi el entero con denominador 6
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nivelesPulperia",
    ()=>nivelesPulperia
]);
const nivelesPulperia = [
    {
        nivel: 1,
        objeto_visual: "sandía",
        denominador_cortes: 2,
        numerador_pedido: 1,
        frase_del_cliente: "¡Buenas! Quiero $\\frac{1}{2}$ de esa sandía para mi familia, porfa.",
        feedback_error: "Te pasaste un poquito. La sandía se parte en 2 pedazos iguales y le damos solo 1 al cliente. ¡Tú puedes!",
        fraccion_latex: "\\frac{1}{2}",
        fraccion_plana: "1/2"
    },
    {
        nivel: 2,
        objeto_visual: "pastel de tres leches",
        denominador_cortes: 4,
        numerador_pedido: 1,
        frase_del_cliente: "Buenas, deme $\\frac{1}{4}$ de ese pastel de tres leches, por favor.",
        feedback_error: "Cuidado, el pastel se corta en 4 partes iguales. El cliente pidió solo 1 pedacito.",
        fraccion_latex: "\\frac{1}{4}",
        fraccion_plana: "1/4"
    },
    {
        nivel: 3,
        objeto_visual: "sandía",
        denominador_cortes: 4,
        numerador_pedido: 2,
        frase_del_cliente: "Hola, yo quiero $\\frac{2}{4}$ de esa sandía rosada, por favor.",
        feedback_error: "Recuerda: 4 partes iguales en total y el cliente lleva 2. ¡Cuenta bien los pedazos!",
        fraccion_latex: "\\frac{2}{4}",
        fraccion_plana: "2/4",
        es_equivalente_de: "1/2"
    },
    {
        nivel: 4,
        objeto_visual: "piña",
        denominador_cortes: 3,
        numerador_pedido: 1,
        frase_del_cliente: "Buenas, deme $\\frac{1}{3}$ de esa piña madura, porfa.",
        feedback_error: "La piña se reparte en 3 partes iguales. El cliente solo quiere 1 de las 3.",
        fraccion_latex: "\\frac{1}{3}",
        fraccion_plana: "1/3"
    },
    {
        nivel: 5,
        objeto_visual: "cuajada",
        denominador_cortes: 3,
        numerador_pedido: 2,
        frase_del_cliente: "¡Buenas! Quiero $\\frac{2}{3}$ de esa cuajada para llevar, por favor.",
        feedback_error: "Ojo: la cuajada se parte en 3 iguales y el cliente lleva 2. ¡No le des de más!",
        fraccion_latex: "\\frac{2}{3}",
        fraccion_plana: "2/3"
    },
    {
        nivel: 6,
        objeto_visual: "pastel de tres leches",
        denominador_cortes: 4,
        numerador_pedido: 3,
        frase_del_cliente: "Buenas, deme $\\frac{3}{4}$ de ese pastel para cumpleaños, porfa.",
        feedback_error: "Casi. El pastel tiene 4 partes y el cliente pidió 3. Si das 4, le das el pastel entero.",
        fraccion_latex: "\\frac{3}{4}",
        fraccion_plana: "3/4"
    },
    {
        nivel: 7,
        objeto_visual: "barra de jabón de lavar",
        denominador_cortes: 6,
        numerador_pedido: 1,
        frase_del_cliente: "Buenas, deme $\\frac{1}{6}$ de esa barra de jabón de lavar, porfa.",
        feedback_error: "La barra se corta en 6 pedacitos iguales. El cliente pidió nomás 1 pedacito.",
        fraccion_latex: "\\frac{1}{6}",
        fraccion_plana: "1/6"
    },
    {
        nivel: 8,
        objeto_visual: "sandía",
        denominador_cortes: 8,
        numerador_pedido: 5,
        frase_del_cliente: "Hola, deme $\\frac{5}{8}$ de esa sandía grandota, por favor.",
        feedback_error: "Cuidado: 8 partes iguales y el cliente lleva 5. Cuenta los pedazos antes de entregar.",
        fraccion_latex: "\\frac{5}{8}",
        fraccion_plana: "5/8"
    },
    {
        nivel: 9,
        objeto_visual: "cuajada",
        denominador_cortes: 8,
        numerador_pedido: 3,
        frase_del_cliente: "Buenas, deme $\\frac{3}{8}$ de esa cuajada de leche, porfa.",
        feedback_error: "La cuajada se parte en 8 pedacitos iguales. El cliente quiere solo 3 de esos.",
        fraccion_latex: "\\frac{3}{8}",
        fraccion_plana: "3/8"
    },
    {
        nivel: 10,
        objeto_visual: "piña",
        denominador_cortes: 6,
        numerador_pedido: 5,
        frase_del_cliente: "¡Buenas! Quiero $\\frac{5}{6}$ de esa piña dulce para llevar, por favor.",
        feedback_error: "Último nivel: la piña se reparte en 6 partes iguales y el cliente lleva 5. ¡Tú puedes, contador experto!",
        fraccion_latex: "\\frac{5}{6}",
        fraccion_plana: "5/6"
    }
];
const __TURBOPACK__default__export__ = nivelesPulperia;
}),
"[project]/Proyecto-De-Modalidad/frontend/src/data/camionMultiplicaciones.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * El Camión de las Multiplicaciones — Diseño de Niveles
 * -----------------------------------------------------
 * Minijuego educativo para 3er grado (MINED Nicaragua) — Módulo 2 Matemática.
 *
 * Mecánica: Un camión de carga nicaragüense llega al mercado. El niño debe
 * cargar cajas con productos. El cliente pide "N cajitas con M adentro cada una".
 * El niño arrastra cajitas al camión (cada cajita contiene M ítems visibles).
 * Refuerza el concepto de multiplicación como " grupos iguales".
 *
 * Progresión pedagógica (DU×U → CDU×U):
 *   N1   2×3   (2 grupos de 3)         → tabla del 2, base conceptual
 *   N2   3×4   (3 grupos de 4)         → tabla del 3
 *   N3   4×5   (4 grupos de 5)         → tabla del 4, productos del Mercado
 *   N4   5×6   (5 grupos de 6)         → tabla del 5
 *   N5   6×7   (6 grupos de 7)         → tabla del 6, sube complejidad
 *   N6   8×4   (8 grupos de 4)         → tabla del 8
 *   N7   12×3  (12 grupos de 3)        → DU×U (producto > 30)
 *   N8   14×5  (14 grupos de 5)        → DU×U (producto > 60)
 *   N9   23×4  (23 grupos de 4)        → DU×U (producto > 80)
 *   N10  34×6  (34 grupos de 6)        → CDU×U (producto > 200, cierre)
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nivelesCamion",
    ()=>nivelesCamion
]);
const nivelesCamion = [
    {
        nivel: 1,
        grupos: 2,
        elementos_por_grupo: 3,
        producto_visual: "cajas de nancites",
        frase_del_cliente: "¡Buenas! Llevo 2 cajitas con 3 nancites cada una al mercado de Masaya, porfa.",
        respuesta_correcta: 6,
        feedback_error: "Contá bien: 2 cajitas y en cada una van 3 nancites. ¡Sumá los grupos!",
        operacion_formal: "2 × 3 = 6",
        contexto_nicaraguense: "Mercado de Masaya, puesto de frutas"
    },
    {
        nivel: 2,
        grupos: 3,
        elementos_por_grupo: 4,
        producto_visual: "cajas de pitahayas",
        frase_del_cliente: "Buenas, deme 3 cajitas con 4 pitahayas en cada una para llevar a Granada.",
        respuesta_correcta: 12,
        feedback_error: "Ojo: 3 cajitas × 4 pitahayas cada una. ¡Multiplicá los grupos!",
        operacion_formal: "3 × 4 = 12",
        contexto_nicaraguense: "Puesto de frutas exóticas, calle La Calzada"
    },
    {
        nivel: 3,
        grupos: 4,
        elementos_por_grupo: 5,
        producto_visual: "sacos de café",
        frase_del_cliente: "¡Buenas! Necesito 4 sacos con 5 libras de café cada uno para la cooperativa.",
        respuesta_correcta: 20,
        feedback_error: "Cuidado: 4 sacos × 5 libras de café. ¡Cada saco lleva 5!",
        operacion_formal: "4 × 5 = 20",
        contexto_nicaraguense: "Cooperativa de café de Jinotega"
    },
    {
        nivel: 4,
        grupos: 5,
        elementos_por_grupo: 6,
        producto_visual: "cajas de cuajadas",
        frase_del_cliente: "Buenas, llevo 5 cajas con 6 cuajadas cada una pa' la pulpería de Doña Rosa.",
        respuesta_correcta: 30,
        feedback_error: "Te faltó: 5 cajas × 6 cuajadas cada una. ¡Sumá los grupos otra vez!",
        operacion_formal: "5 × 6 = 30",
        contexto_nicaraguense: "Pulpería de Doña Rosa, Barrio Monseñor Lezcano"
    },
    {
        nivel: 5,
        grupos: 6,
        elementos_por_grupo: 7,
        producto_visual: "pacas de rosquillas",
        frase_del_cliente: "¡Buenas! Quiero 6 pacas con 7 rosquillas cada una pa' vender en la Laguna.",
        respuesta_correcta: 42,
        feedback_error: "Casi: 6 pacas × 7 rosquillas cada una. ¡Multiplicá nomás!",
        operacion_formal: "6 × 7 = 42",
        contexto_nicaraguense: "Laguna de Masaya, domingo de venta"
    },
    {
        nivel: 6,
        grupos: 8,
        elementos_por_grupo: 4,
        producto_visual: "cajas de pan de leche",
        frase_del_cliente: "Buenas, deme 8 cajas con 4 panes de leche cada una para la merienda.",
        respuesta_correcta: 32,
        feedback_error: "Ojo: 8 cajas × 4 panes cada una. ¡No confundas el orden!",
        operacion_formal: "8 × 4 = 32",
        contexto_nicaraguense: "Panadería de León, venta del domingo"
    },
    {
        nivel: 7,
        grupos: 12,
        elementos_por_grupo: 3,
        producto_visual: "sacos de frijoles",
        frase_del_cliente: "¡Buenas! Llevo 12 sacos con 3 libras de frijoles cada uno al Mercado Oriental.",
        respuesta_correcta: 36,
        feedback_error: "Números más grandes ya: 12 sacos × 3 libras cada uno. ¡A contar grupos!",
        operacion_formal: "12 × 3 = 36",
        contexto_nicaraguense: "Mercado Oriental de Managua"
    },
    {
        nivel: 8,
        grupos: 14,
        elementos_por_grupo: 5,
        producto_visual: "cajas de nancites",
        frase_del_cliente: "Buenas, deme 14 cajas con 5 nancites cada una pa' la feria de Tipitapa.",
        respuesta_correcta: 70,
        feedback_error: "Te pasaste o te faltó: 14 cajas × 5 nancites. ¡Hacé la cuenta paso a paso!",
        operacion_formal: "14 × 5 = 70",
        contexto_nicaraguense: "Feria de Tipitapa, puesto rural"
    },
    {
        nivel: 9,
        grupos: 23,
        elementos_por_grupo: 4,
        producto_visual: "sacos de cacao",
        frase_del_cliente: "¡Buenas! Llevo 23 sacos con 4 libras de cacao cada uno a la fábrica.",
        respuesta_correcta: 92,
        feedback_error: "Cuidado: 23 sacos × 4 libras cada uno. ¡Es una multiplicación de dos cifras!",
        operacion_formal: "23 × 4 = 92",
        contexto_nicaraguense: "Fábrica de chocolate de Matagalpa"
    },
    {
        nivel: 10,
        grupos: 34,
        elementos_por_grupo: 6,
        producto_visual: "cajas de cuajadas",
        frase_del_cliente: "¡Buenas, último encargo! 34 cajas con 6 cuajadas cada una para exportar.",
        respuesta_correcta: 204,
        feedback_error: "Nivel final: 34 cajas × 6 cuajadas. ¡Multiplicación de tres cifras, vos podés!",
        operacion_formal: "34 × 6 = 204",
        contexto_nicaraguense: "Exportación desde Managua"
    }
];
const __TURBOPACK__default__export__ = nivelesCamion;
}),
"[project]/Proyecto-De-Modalidad/frontend/src/data/busLetras.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * El Bus de las Letras — Diseño de Niveles
 * -----------------------------------------
 * Minijuego educativo para 3er grado (MINED Nicaragua) — Módulo 3 Lengua y Literatura.
 *
 * Mecánica: Un bus escolar nicaragüense recorre una ruta. En cada parada sube
 * un pasajero con una tarjeta de palabras. El niño debe identificar la palabra
 * correcta según la consigna (sujeto, predicado, pronombre, etc.) y "subirla" al bus.
 *
 * Progresión pedagógica (estructura del texto → gramática → pronombres):
 *   N1   Sujeto simple (una palabra)
 *   N2   Sujeto compuesto (nombre + apellido)
 *   N3   Predicado simple
 *   N4   Predicado con adjetivo
 *   N5   Sujeto vs Predicado (identificar cuál es cuál)
 *   N6   Pronombre personal (él / ella)
 *   N7   Pronombre personal (ellos / ellas)
 *   N8   Estructura del texto: inicio
 *   N9   Estructura del texto: desarrollo
 *   N10  Estructura del texto: final / moraleja
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nivelesBus",
    ()=>nivelesBus
]);
const nivelesBus = [
    {
        nivel: 1,
        tipo_ejercicio: "sujeto_simple",
        parada: "Mercado de Masaya",
        consigna_para_nino: "Tocá la palabra que es el SUJETO de la oración",
        enunciado: "María vende cuajadas en el mercado.",
        palabra_correcta: "María",
        distractores: [
            "vende",
            "cuajadas",
            "mercado"
        ],
        feedback_error: "El sujeto es de quién se habla en la oración. Acá se habla de María. ¡Subila al bus!",
        avatar_pasajero: "🧒"
    },
    {
        nivel: 2,
        tipo_ejercicio: "sujeto_compuesto",
        parada: "Parque Central de León",
        consigna_para_nino: "Tocá el SUJETO completo (nombre + apellido)",
        enunciado: "Doña Rosa cocina nacatamales los domingos.",
        palabra_correcta: "Doña Rosa",
        distractores: [
            "Doña",
            "cocina",
            "nacatamales"
        ],
        feedback_error: "El sujeto completo incluye nombre y quién es. Acá es 'Doña Rosa'. ¡Subila al bus!",
        avatar_pasajero: "👵"
    },
    {
        nivel: 3,
        tipo_ejercicio: "predicado_simple",
        parada: "Laguna de Masaya",
        consigna_para_nino: "Tocá la palabra que es el PREDICADO (acción)",
        enunciado: "El cacao crece en Matagalpa.",
        palabra_correcta: "crece",
        distractores: [
            "cacao",
            "en",
            "Matagalpa"
        ],
        feedback_error: "El predicado dice qué hace el sujeto. Acá el cacao 'crece'. ¡Subí 'crece' al bus!",
        avatar_pasajero: "🧑"
    },
    {
        nivel: 4,
        tipo_ejercicio: "predicado_adjetivo",
        parada: "Calle La Calzada, Granada",
        consigna_para_nino: "Tocá el PREDICADO completo (acción + cómo)",
        enunciado: "El pinol blanco sabe delicioso.",
        palabra_correcta: "sabe delicioso",
        distractores: [
            "sabe",
            "delicioso",
            "El pinol"
        ],
        feedback_error: "El predicado completo es toda la acción: 'sabe delicioso'. ¡No te lleves solo una parte!",
        avatar_pasajero: "👨"
    },
    {
        nivel: 5,
        tipo_ejercicio: "sujeto_vs_predicado",
        parada: "Mercado Oriental, Managua",
        consigna_para_nino: "Tocá solo el SUJETO de la oración",
        enunciado: "Los nancites maduran rápido en verano.",
        palabra_correcta: "Los nancites",
        distractores: [
            "maduran",
            "maduran rápido",
            "en verano"
        ],
        feedback_error: "El sujeto es de quién hablamos. Acá son 'Los nancites'. ¡El resto es predicado!",
        avatar_pasajero: "👩"
    },
    {
        nivel: 6,
        tipo_ejercicio: "pronombre_el_ella",
        parada: "Frente a la Catedral de Granada",
        consigna_para_nino: "Tocá el pronombre que reemplaza a 'María'",
        enunciado: "María teje hamacas en Masaya.",
        palabra_correcta: "ella",
        distractores: [
            "él",
            "ellos",
            "ellas"
        ],
        feedback_error: "María es una sola persona, mujer. Su pronombre es 'ella'. ¡Subila al bus!",
        avatar_pasajero: "👧"
    },
    {
        nivel: 7,
        tipo_ejercicio: "pronombre_ellos_ellas",
        parada: "Cooperativa de café, Jinotega",
        consigna_para_nino: "Tocá el pronombre que reemplaza a 'Jerson y Nahomi'",
        enunciado: "Jerson y Nahomi siembran cacao en la finca.",
        palabra_correcta: "ellos",
        distractores: [
            "ellas",
            "él",
            "ella"
        ],
        feedback_error: "Jerson y Nahomi son dos personas, al menos un hombre. Su pronombre es 'ellos'. ¡A subir!",
        avatar_pasajero: "👫"
    },
    {
        nivel: 8,
        tipo_ejercicio: "estructura_inicio",
        parada: "Biblioteca pública de León",
        consigna_para_nino: "Tocá la palabra que abre el INICIO del cuento",
        enunciado: "Había una vez un coyote travieso en las sabanas de Carazo.",
        palabra_correcta: "Había",
        distractores: [
            "travieso",
            "coyote",
            "sabanas"
        ],
        feedback_error: "El inicio de un cuento empieza presentando. 'Había' abre la historia. ¡Subila al bus!",
        avatar_pasajero: "🧓"
    },
    {
        nivel: 9,
        tipo_ejercicio: "estructura_desarrollo",
        parada: "Frente al Lago Cocibolca",
        consigna_para_nino: "Tocá la palabra del DESARROLLO (qué pasó después)",
        enunciado: "El coyote corrió tras el conejo por toda la sabana seca.",
        palabra_correcta: "corrió",
        distractores: [
            "coyote",
            "sabana",
            "seca"
        ],
        feedback_error: "El desarrollo cuenta la acción principal. Acá es 'corrió'. ¡Subila al bus!",
        avatar_pasajero: "🦊"
    },
    {
        nivel: 10,
        tipo_ejercicio: "estructura_final",
        parada: "Última parada: Puerto Salvador Allende",
        consigna_para_nino: "Tocá la MORALEJA (enseñanza) del cuento",
        enunciado: "El conejo escapó. Moraleja: la astucia vence a la fuerza bruta.",
        palabra_correcta: "la astucia vence a la fuerza bruta",
        distractores: [
            "El conejo escapó",
            "fuerza bruta",
            "Moraleja"
        ],
        feedback_error: "La moraleja es la enseñanza final. Acá: 'la astucia vence a la fuerza bruta'. ¡Subila!",
        avatar_pasajero: "🐰"
    }
];
const __TURBOPACK__default__export__ = nivelesBus;
}),
"[project]/Proyecto-De-Modalidad/frontend/src/data/cartaOrtografia.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * La Carta Mal Enviada — Diseño de Niveles
 * ------------------------------------------
 * Minijuego educativo para 3er grado (MINED Nicaragua) — Módulo 4 Ortografía y Signos.
 *
 * Mecánica: Un cartero nicaragüense lleva cartas con errores. El niño debe
 * "sellar" la corrección correcta antes de que la carta salga al buzón.
 * Tipos de error a corregir: uso de b/v, clasificación por acento
 * (agudas/graves/esdrújulas) y signos de apertura (¡ ¿) en exclamativas e
 * interrogativas.
 *
 * Progresión pedagógica:
 *   N1   b/v (sustitución clásica)           → 4 cartas
 *   N2   b/v (omisión de b inicial)           → 4 cartas
 *   N3   b/v (confusión en prefijos)          → 4 cartas
 *   N4   Agudas (con tilde)                   → 4 cartas
 *   N5   Graves (con/sin tilde)               → 4 cartas
 *   N6   Esdrújulas (siempre con tilde)       → 4 cartas
 *   N7   Signo ¡ (exclamativa, falta apertura)→ 4 cartas
 *   N8   Signo ¿ (interrogativa, falta apertura) → 4 cartas
 *   N9   Mezcla ¡/¿ (frases que combinan)     → 4 cartas
 *   N10  Revisión final: clasificar tipo de error → 4 cartas
 *
 * Total: 40 cartas distribuidas en 10 niveles.
 * El niño arranca el nivel con 4 cartas; cada una vale 1 sello correcto.
 */ __turbopack_context__.s([
    "cartasNiveles",
    ()=>cartasNiveles,
    "cartasPorNivel",
    ()=>cartasPorNivel,
    "cartasPorNivelCount",
    ()=>cartasPorNivelCount,
    "default",
    ()=>__TURBOPACK__default__export__,
    "totalNivelesCarta",
    ()=>totalNivelesCarta
]);
const cartasNiveles = [
    // Nivel 1 — sustitución clásica b/v
    {
        id: "CARTA-001",
        nivel: 1,
        tipo_error: "uso_b_v",
        subtipo: "sustitucion_b_v",
        texto_mostrado: "El ciervo corre por el bosque.",
        correccion_correcta: "El ciervo corre por el bosque.",
        regla_ortografica: "'Ciervo' se escribe con 'c' antes de 'e', pero el animal lleva 'v'.",
        feedback_error: "Acá no hay error, era trampa. ¡Leé bien antes de sellar!"
    },
    {
        id: "CARTA-002",
        nivel: 1,
        tipo_error: "uso_b_v",
        subtipo: "sustitucion_b_v",
        texto_mostrado: "Compré un kilo de cavas en el mercado.",
        correccion_correcta: "Compré un kilo de cebollas en el mercado.",
        regla_ortografica: "Si querías decir 'cabas' (cajas), es con 'b'. Pero 'cebollas' lleva 'b'.",
        feedback_error: "Acá lo correcto era 'cebollas' con 'b'. ¡Cuidado con la trampa!"
    },
    {
        id: "CARTA-003",
        nivel: 1,
        tipo_error: "uso_b_v",
        subtipo: "sustitucion_b_v",
        texto_mostrado: "La hamaca se mueve con el viento.",
        correccion_correcta: "La hamaca se mueve con el viento.",
        regla_ortografica: "'Hamaca' lleva 'h' muda, 'viento' lleva 'v'. Todo está bien.",
        feedback_error: "Esta carta no tiene error. ¡Cuidado con sellar sin revisar!"
    },
    {
        id: "CARTA-004",
        nivel: 1,
        tipo_error: "uso_b_v",
        subtipo: "sustitucion_b_v",
        texto_mostrado: "Mi hermano tiene un nueve caballo.",
        correccion_correcta: "Mi hermano tiene un nuevo caballo.",
        regla_ortografica: "'Nuevo' se escribe con 'v' después de 'e'. 'Caballo' con 'b' antes de 'll'.",
        feedback_error: "Acá hay dos errores: 'nuevo' (con v) y 'caballo' (con b). ¡A revisar!"
    },
    // Nivel 2 — omisión de b inicial
    {
        id: "CARTA-005",
        nivel: 2,
        tipo_error: "uso_b_v",
        subtipo: "omision_b_inicial",
        texto_mostrado: "Buenas, vengo a uscar trabajo.",
        correccion_correcta: "Buenas, vengo a buscar trabajo.",
        regla_ortografica: "Las formas del verbo 'buscar' empiezan con 'b'.",
        feedback_error: "Faltó la 'b' en 'buscar'. ¡Las acciones empiezan con b!"
    },
    {
        id: "CARTA-006",
        nivel: 2,
        tipo_error: "uso_b_v",
        subtipo: "omision_b_inicial",
        texto_mostrado: "El autobús salió al octubre.",
        correccion_correcta: "El autobús salió a octubre.",
        regla_ortografica: "Los meses llevan minúscula: 'octubre' (no 'al octubre').",
        feedback_error: "Acá el error era otro: sobraba 'al'. 'Octubre' con minúscula."
    },
    {
        id: "CARTA-007",
        nivel: 2,
        tipo_error: "uso_b_v",
        subtipo: "omision_b_inicial",
        texto_mostrado: "Vamos a nadar en el alberca.",
        correccion_correcta: "Vamos a nadar en la alberca.",
        regla_ortografica: "Antes de 'alberca' va 'la', no 'el' (palabra femenina).",
        feedback_error: "Acá el error era el artículo: 'la alberca', no 'el alberca'."
    },
    {
        id: "CARTA-008",
        nivel: 2,
        tipo_error: "uso_b_v",
        subtipo: "omision_b_inicial",
        texto_mostrado: "El ornitorrinco nada en el río.",
        correccion_correcta: "El ornitorrinco nada en el río.",
        regla_ortografica: "Aunque suene raro, 'ornitorrinco' empieza con 'o' (sin b).",
        feedback_error: "Esta carta estaba bien. No todas las palabras raras llevan 'b'."
    },
    // Nivel 3 — confusión en prefijos (ab-, ob-, sub-)
    {
        id: "CARTA-009",
        nivel: 3,
        tipo_error: "uso_b_v",
        subtipo: "confusion_prefijo",
        texto_mostrado: "El avión despegó aveloz.",
        correccion_correcta: "El avión despegó a veloz.",
        regla_ortografica: "La preposición 'a' + 'veloz' va separada: 'a veloz' (mal uso, pero la idea es 'a velocidad').",
        feedback_error: "Acá va separado: 'a veloz'. ¡Las preposiciones no se pegan!"
    },
    {
        id: "CARTA-010",
        nivel: 3,
        tipo_error: "uso_b_v",
        subtipo: "confusion_prefijo",
        texto_mostrado: "El niño suvió la colina.",
        correccion_correcta: "El niño subió la colina.",
        regla_ortografica: "El prefijo 'sub-' lleva siempre 'b': 'subió', 'submarino'.",
        feedback_error: "El verbo 'subir' se escribe con 'b'. ¡Subió, no suvió!"
    },
    {
        id: "CARTA-011",
        nivel: 3,
        tipo_error: "uso_b_v",
        subtipo: "confusion_prefijo",
        texto_mostrado: "El examen fue ovio.",
        correccion_correcta: "El examen fue obvio.",
        regla_ortografica: "El prefijo 'ob-' lleva 'b': 'obvio', 'obtener'.",
        feedback_error: "Acá va 'b' en 'obvio'. ¡El prefijo 'ob-' nunca cambia!"
    },
    {
        id: "CARTA-012",
        nivel: 3,
        tipo_error: "uso_b_v",
        subtipo: "confusion_prefijo",
        texto_mostrado: "El abuelo aporta saviduría.",
        correccion_correcta: "El abuelo aporta sabiduría.",
        regla_ortografica: "'Sabiduría' viene de 'saber', con 'b'.",
        feedback_error: "Familia de 'saber' siempre con 'b': 'sabiduría', 'sabio'."
    },
    // Nivel 4 — Agudas con tilde
    {
        id: "CARTA-013",
        nivel: 4,
        tipo_error: "clasificacion_acentos",
        subtipo: "aguda",
        texto_mostrado: "El cafe está caliente.",
        correccion_correcta: "El café está caliente.",
        regla_ortografica: "Aguda terminada en vocal: lleva tilde. 'Café'.",
        feedback_error: "Las agudas terminadas en vocal llevan tilde: 'café'."
    },
    {
        id: "CARTA-014",
        nivel: 4,
        tipo_error: "clasificacion_acentos",
        subtipo: "aguda",
        texto_mostrado: "Quiero un nacatamal, porfa.",
        correccion_correcta: "Quiero un nacatamal, porfa.",
        regla_ortografica: "Aguda terminada en 'l' (consonante): NO lleva tilde.",
        feedback_error: "Las agudas terminadas en consonante (distinta de n/s) NO llevan tilde. 'Nacatamal' está bien."
    },
    {
        id: "CARTA-015",
        nivel: 4,
        tipo_error: "clasificacion_acentos",
        subtipo: "aguda",
        texto_mostrado: "Compró vigorón en Granada.",
        correccion_correcta: "Compró vigorón en Granada.",
        regla_ortografica: "Aguda terminada en 'n': lleva tilde si es aguda. 'Vigorón'.",
        feedback_error: "Esta carta está bien. 'Vigorón' sí lleva tilde (aguda terminada en n)."
    },
    {
        id: "CARTA-016",
        nivel: 4,
        tipo_error: "clasificacion_acentos",
        subtipo: "aguda",
        texto_mostrado: "El camion llegó al mercado.",
        correccion_correcta: "El camión llegó al mercado.",
        regla_ortografica: "Aguda terminada en 'n': lleva tilde. 'Camión'.",
        feedback_error: "'Camión' es aguda terminada en 'n', lleva tilde. ¡A sellar!"
    },
    // Nivel 5 — Graves (con/sin tilde)
    {
        id: "CARTA-017",
        nivel: 5,
        tipo_error: "clasificacion_acentos",
        subtipo: "grave",
        texto_mostrado: "El árbol da sombra.",
        correccion_correcta: "El árbol da sombra.",
        regla_ortografica: "Grave terminada en 'l' (no n/s): ¿lleva tilde? 'Árbol' sí, 'sombra' no (es grave sin tilde).",
        feedback_error: "Ojo: 'árbol' lleva tilde, pero 'sombra' no. Esta carta está bien."
    },
    {
        id: "CARTA-018",
        nivel: 5,
        tipo_error: "clasificacion_acentos",
        subtipo: "grave",
        texto_mostrado: "La cuajada está fresca.",
        correccion_correcta: "La cuajada está fresca.",
        regla_ortografica: "Grave terminada en vocal: NO lleva tilde. 'Cuajada', 'fresca'.",
        feedback_error: "Ningún error. Las graves terminadas en vocal no llevan tilde."
    },
    {
        id: "CARTA-019",
        nivel: 5,
        tipo_error: "clasificacion_acentos",
        subtipo: "grave",
        texto_mostrado: "El lápiz se rompió.",
        correccion_correcta: "El lápiz se rompió.",
        regla_ortografica: "Grave terminada en 'z' (no n/s/vocal): lleva tilde. 'Lápiz'.",
        feedback_error: "'Lápiz' lleva tilde (grave terminada en z, no en n/s)."
    },
    {
        id: "CARTA-020",
        nivel: 5,
        tipo_error: "clasificacion_acentos",
        subtipo: "grave",
        texto_mostrado: "Carne asada con chimichurri.",
        correccion_correcta: "Carne asada con chimichurri.",
        regla_ortografica: "Graves terminadas en vocal: NO llevan tilde. 'Carne', 'asada' están bien.",
        feedback_error: "Esta carta no tiene errores. ¡Leé con cuidado!"
    },
    // Nivel 6 — Esdrújulas (siempre con tilde)
    {
        id: "CARTA-021",
        nivel: 6,
        tipo_error: "clasificacion_acentos",
        subtipo: "esdrujula",
        texto_mostrado: "La musica nicaragüense es linda.",
        correccion_correcta: "La música nicaragüense es linda.",
        regla_ortografica: "Esdrújula: siempre lleva tilde. 'Música'.",
        feedback_error: "Toda esdrújula lleva tilde. 'Música' la necesita."
    },
    {
        id: "CARTA-022",
        nivel: 6,
        tipo_error: "clasificacion_acentos",
        subtipo: "esdrujula",
        texto_mostrado: "El rápido va rápido.",
        correccion_correcta: "El rápido va rápido.",
        regla_ortografica: "Esdrújulas siempre con tilde. 'Rápido'.",
        feedback_error: "Esta carta está bien. 'Rápido' lleva tilde."
    },
    {
        id: "CARTA-023",
        nivel: 6,
        tipo_error: "clasificacion_acentos",
        subtipo: "esdrujula",
        texto_mostrado: "Una pajaro canta en el árbol.",
        correccion_correcta: "Un pájaro canta en el árbol.",
        regla_ortografica: "Esdrújula 'pájaro' siempre con tilde; y es 'un pájaro' (masculino).",
        feedback_error: "Dos errores: 'un pájaro' (con tilde, masculino). ¡A revisar!"
    },
    {
        id: "CARTA-024",
        nivel: 6,
        tipo_error: "clasificacion_acentos",
        subtipo: "esdrujula",
        texto_mostrado: "El sabado voy a Masaya.",
        correccion_correcta: "El sábado voy a Masaya.",
        regla_ortografica: "Esdrújula 'sábado' siempre con tilde.",
        feedback_error: "'Sábado' es esdrújula, siempre lleva tilde. ¡Sellala bien!"
    },
    // Nivel 7 — Exclamativas sin ¡ de apertura
    {
        id: "CARTA-025",
        nivel: 7,
        tipo_error: "signos_apertura",
        subtipo: "exclamativa_sin_apertura",
        texto_mostrado: "Qué rica está la vigorón!",
        correccion_correcta: "¡Qué rica está la vigorón!",
        regla_ortografica: "Las exclamaciones en español abren con ¡ y cierran con !.",
        feedback_error: "Faltó el signo de apertura ¡. ¡Las exclamaciones abren y cierran!"
    },
    {
        id: "CARTA-026",
        nivel: 7,
        tipo_error: "signos_apertura",
        subtipo: "exclamativa_sin_apertura",
        texto_mostrado: "Ay, me quemé con el pinol!",
        correccion_correcta: "¡Ay, me quemé con el pinol!",
        regla_ortografica: "Toda exclamación abre con ¡.",
        feedback_error: "Antes de 'Ay' va el signo ¡. ¡No te olvides de abrir!"
    },
    {
        id: "CARTA-027",
        nivel: 7,
        tipo_error: "signos_apertura",
        subtipo: "exclamativa_sin_apertura",
        texto_mostrado: "Qué calor hace en León!",
        correccion_correcta: "¡Qué calor hace en León!",
        regla_ortografica: "Las frases que empiezan con 'Qué' son exclamativas: abren con ¡.",
        feedback_error: "Faltó el ¡ inicial. ¡Acordate de abrir siempre!"
    },
    {
        id: "CARTA-028",
        nivel: 7,
        tipo_error: "signos_apertura",
        subtipo: "exclamativa_sin_apertura",
        texto_mostrado: "Viva Nicaragua libre!",
        correccion_correcta: "¡Viva Nicaragua libre!",
        regla_ortografica: "Las proclamas también abren con ¡.",
        feedback_error: "Antes de 'Viva' va el signo ¡. ¡Viva Nicaragua!"
    },
    // Nivel 8 — Interrogativas sin ¿ de apertura
    {
        id: "CARTA-029",
        nivel: 8,
        tipo_error: "signos_apertura",
        subtipo: "interrogativa_sin_apertura",
        texto_mostrado: "Cuánto cuesta la cuajada?",
        correccion_correcta: "¿Cuánto cuesta la cuajada?",
        regla_ortografica: "Las preguntas abren con ¿ y cierran con ?.",
        feedback_error: "Faltó el signo ¿. ¡Toda pregunta abre con él!"
    },
    {
        id: "CARTA-030",
        nivel: 8,
        tipo_error: "signos_apertura",
        subtipo: "interrogativa_sin_apertura",
        texto_mostrado: "Dónde está el mercado?",
        correccion_correcta: "¿Dónde está el mercado?",
        regla_ortografica: "Las preguntas con 'dónde', 'qué', 'cómo' abren con ¿.",
        feedback_error: "Antes de 'Dónde' va el signo ¿. ¡Las preguntas siempre abren!"
    },
    {
        id: "CARTA-031",
        nivel: 8,
        tipo_error: "signos_apertura",
        subtipo: "interrogativa_sin_apertura",
        texto_mostrado: "Vamos a jugar fútbol?",
        correccion_correcta: "¿Vamos a jugar fútbol?",
        regla_ortografica: "Aunque sea pregunta sin pronombre, también abre con ¿.",
        feedback_error: "Faltó el ¿ inicial. ¡Toda pregunta lo necesita!"
    },
    {
        id: "CARTA-032",
        nivel: 8,
        tipo_error: "signos_apertura",
        subtipo: "interrogativa_sin_apertura",
        texto_mostrado: "Quién quiere pinol?",
        correccion_correcta: "¿Quién quiere pinol?",
        regla_ortografica: "Las preguntas con 'quién' abren con ¿.",
        feedback_error: "Antes de 'Quién' va el ¿. ¡Acordate!"
    },
    // Nivel 9 — Mezcla ¡/¿
    {
        id: "CARTA-033",
        nivel: 9,
        tipo_error: "signos_apertura",
        subtipo: "mezcla_signos",
        texto_mostrado: "¡Cuánto cuesta esta hamaca?",
        correccion_correcta: "¿Cuánto cuesta esta hamaca?",
        regla_ortografica: "Es pregunta: va ¿ al inicio, no ¡.",
        feedback_error: "Es pregunta, no exclamación. Cambiá ¡ por ¿."
    },
    {
        id: "CARTA-034",
        nivel: 9,
        tipo_error: "signos_apertura",
        subtipo: "mezcla_signos",
        texto_mostrado: "¿Qué rico está el cacao!",
        correccion_correcta: "¡Qué rico está el cacao!",
        regla_ortografica: "Es exclamación: va ¡ al inicio, no ¿.",
        feedback_error: "Es exclamación, no pregunta. Cambiá ¿ por ¡."
    },
    {
        id: "CARTA-035",
        nivel: 9,
        tipo_error: "signos_apertura",
        subtipo: "mezcla_signos",
        texto_mostrado: "¿Te gustó la vigorón!",
        correccion_correcta: "¿Te gustó la vigorón?",
        regla_ortografica: "Si abriste con ¿, debés cerrar con ?.",
        feedback_error: "Abriste con ¿, entonces cerrá con ?. ¡Parejan los signos!"
    },
    {
        id: "CARTA-036",
        nivel: 9,
        tipo_error: "signos_apertura",
        subtipo: "mezcla_signos",
        texto_mostrado: "¡Cuántas pitahayas quieres?",
        correccion_correcta: "¿Cuántas pitahayas quieres?",
        regla_ortografica: "Es pregunta (cuántas + quieres): abre con ¿.",
        feedback_error: "Es pregunta, no exclamación. Va ¿ al inicio."
    },
    // Nivel 10 — Clasificar tipo de error (cierre, tipo_error triple)
    {
        id: "CARTA-037",
        nivel: 10,
        tipo_error: "uso_b_v",
        subtipo: "clasificar_tipo",
        texto_mostrado: "El avión voló aveloz.",
        correccion_correcta: "El avión voló a veloz.",
        regla_ortografica: "Errores de b/v + separación de preposición.",
        feedback_error: "Acá hay dos errores: 'voló' (v) y 'a veloz' (separado)."
    },
    {
        id: "CARTA-038",
        nivel: 10,
        tipo_error: "clasificacion_acentos",
        subtipo: "clasificar_tipo",
        texto_mostrado: "El sabado hay feria en Masaya.",
        correccion_correcta: "El sábado hay feria en Masaya.",
        regla_ortografica: "Esdrújula 'sábado': siempre con tilde.",
        feedback_error: "'Sábado' es esdrújula, lleva tilde siempre."
    },
    {
        id: "CARTA-039",
        nivel: 10,
        tipo_error: "signos_apertura",
        subtipo: "clasificar_tipo",
        texto_mostrado: "Cuánto cuesta el nacatamal?",
        correccion_correcta: "¿Cuánto cuesta el nacatamal?",
        regla_ortografica: "Pregunta: falta el ¿ de apertura.",
        feedback_error: "Es pregunta, abrila con ¿. ¡Última carta, vos podés!"
    },
    {
        id: "CARTA-040",
        nivel: 10,
        tipo_error: "clasificacion_acentos",
        subtipo: "clasificar_tipo",
        texto_mostrado: "El camion sale al mercado.",
        correccion_correcta: "El camión sale al mercado.",
        regla_ortografica: "Aguda terminada en 'n': lleva tilde.",
        feedback_error: "Aguda terminada en 'n' lleva tilde: 'camión'. ¡Última carta sellada!"
    }
];
const cartasPorNivel = (nivel)=>cartasNiveles.filter((c)=>c.nivel === nivel);
const totalNivelesCarta = 10;
const cartasPorNivelCount = 4;
const __TURBOPACK__default__export__ = cartasNiveles;
}),
"[project]/Proyecto-De-Modalidad/frontend/src/data/atrapaAcento.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Atrapa el Acento — Diseño de 20 Desafíos
 * ------------------------------------------
 * Minijuego de ritmo y velocidad ortográfica para 3er grado
 * (segundo semestre MINED Nicaragua).
 *
 * Mecánica: Aparece una palabra incompleta (sin tilde) en pantalla.
 * Tres vocales flotantes con tilde se mueven por la pantalla (¡/¿/ó/á...).
 * El niño debe "atrapar" (tocar rápido) la vocal con tilde correcta
 * antes de que salga de la pantalla. El audio guía refuerza la
 * pronunciación exagerada de la sílaba tónica.
 *
 * Progresión pedagógica:
 *   1-7  Agudas (7 desafíos)       → terminadas en n, s, vocal
 *   8-15 Graves (8 desafíos)       → terminadas en consonante (no n/s)
 *   16-20 Esdrújulas (5 desafíos)  → siempre con tilde
 *
 * Distribución de Posición_X:
 *   - Variación rotativa (centro → derecha → izquierda) para que el
 *     niño no memorice la posición y deba leer la palabra.
 */ __turbopack_context__.s([
    "RESUMEN_ATRAPA",
    ()=>RESUMEN_ATRAPA,
    "agudas",
    ()=>agudas,
    "default",
    ()=>__TURBOPACK__default__export__,
    "desafiosAtrapa",
    ()=>desafiosAtrapa,
    "esdrujulas",
    ()=>esdrujulas,
    "graves",
    ()=>graves
]);
const desafiosAtrapa = [
    // ====== AGUDAS (1-7) ======
    {
        id: "AA-001",
        palabra_completa: "café",
        palabra_incompleta: "ca-fe",
        clasificacion: "Aguda",
        letra_con_tilde_correcta: "é",
        posicion_x: "centro",
        audio_guia: "ca-FÉÉÉ",
        silaba_tonica: 1,
        distractores: [
            "á",
            "í"
        ],
        regla: "Aguda terminada en vocal: lleva tilde."
    },
    {
        id: "AA-002",
        palabra_completa: "camión",
        palabra_incompleta: "ca-mion",
        clasificacion: "Aguda",
        letra_con_tilde_correcta: "ó",
        posicion_x: "derecha",
        audio_guia: "ca-MIÓN",
        silaba_tonica: 1,
        distractores: [
            "o",
            "ú"
        ],
        regla: "Aguda terminada en 'n': lleva tilde."
    },
    {
        id: "AA-003",
        palabra_completa: "vigorón",
        palabra_incompleta: "vi-go-ron",
        clasificacion: "Aguda",
        letra_con_tilde_correcta: "ó",
        posicion_x: "izquierda",
        audio_guia: "vi-go-RÓN",
        silaba_tonica: 1,
        distractores: [
            "o",
            "á"
        ],
        regla: "Aguda terminada en 'n': lleva tilde. (Comida típica nicaragüense)"
    },
    {
        id: "AA-004",
        palabra_completa: "colibrí",
        palabra_incompleta: "co-li-bri",
        clasificacion: "Aguda",
        letra_con_tilde_correcta: "í",
        posicion_x: "centro",
        audio_guia: "co-li-BRÍÍÍ",
        silaba_tonica: 1,
        distractores: [
            "i",
            "é"
        ],
        regla: "Aguda terminada en vocal: lleva tilde."
    },
    {
        id: "AA-005",
        palabra_completa: "bambú",
        palabra_incompleta: "bam-bu",
        clasificacion: "Aguda",
        letra_con_tilde_correcta: "ú",
        posicion_x: "derecha",
        audio_guia: "bam-BÚÚÚ",
        silaba_tonica: 1,
        distractores: [
            "u",
            "ó"
        ],
        regla: "Aguda terminada en vocal: lleva tilde."
    },
    {
        id: "AA-006",
        palabra_completa: "canción",
        palabra_incompleta: "can-cion",
        clasificacion: "Aguda",
        letra_con_tilde_correcta: "ó",
        posicion_x: "izquierda",
        audio_guia: "can-CIÓN",
        silaba_tonica: 1,
        distractores: [
            "o",
            "é"
        ],
        regla: "Aguda terminada en 'n': lleva tilde."
    },
    {
        id: "AA-007",
        palabra_completa: "León",
        palabra_incompleta: "Le-on",
        clasificacion: "Aguda",
        letra_con_tilde_correcta: "ó",
        posicion_x: "centro",
        audio_guia: "le-ÓN",
        silaba_tonica: 1,
        distractores: [
            "o",
            "á"
        ],
        regla: "Aguda terminada en 'n': lleva tilde. (Departamento de Nicaragua)"
    },
    // ====== GRAVES (8-15) ======
    {
        id: "AA-008",
        palabra_completa: "árbol",
        palabra_incompleta: "ar-bol",
        clasificacion: "Grave",
        letra_con_tilde_correcta: "á",
        posicion_x: "derecha",
        audio_guia: "ÁR-bol",
        silaba_tonica: 2,
        distractores: [
            "a",
            "é"
        ],
        regla: "Grave terminada en 'l' (no n/s): lleva tilde."
    },
    {
        id: "AA-009",
        palabra_completa: "lápiz",
        palabra_incompleta: "la-piz",
        clasificacion: "Grave",
        letra_con_tilde_correcta: "á",
        posicion_x: "izquierda",
        audio_guia: "LÁ-piz",
        silaba_tonica: 2,
        distractores: [
            "a",
            "í"
        ],
        regla: "Grave terminada en 'z' (no n/s): lleva tilde."
    },
    {
        id: "AA-010",
        palabra_completa: "fácil",
        palabra_incompleta: "fa-cil",
        clasificacion: "Grave",
        letra_con_tilde_correcta: "á",
        posicion_x: "centro",
        audio_guia: "FÁ-cil",
        silaba_tonica: 2,
        distractores: [
            "a",
            "ó"
        ],
        regla: "Grave terminada en 'l' (no n/s): lleva tilde."
    },
    {
        id: "AA-011",
        palabra_completa: "Pérez",
        palabra_incompleta: "Pe-rez",
        clasificacion: "Grave",
        letra_con_tilde_correcta: "é",
        posicion_x: "derecha",
        audio_guia: "PÉ-rez",
        silaba_tonica: 2,
        distractores: [
            "e",
            "á"
        ],
        regla: "Grave terminada en 'z' (no n/s): lleva tilde. (Apellido común)"
    },
    {
        id: "AA-012",
        palabra_completa: "Sánchez",
        palabra_incompleta: "San-chez",
        clasificacion: "Grave",
        letra_con_tilde_correcta: "á",
        posicion_x: "izquierda",
        audio_guia: "SÁN-chez",
        silaba_tonica: 2,
        distractores: [
            "a",
            "é"
        ],
        regla: "Grave terminada en 'z' (no n/s): lleva tilde. (Apellido común)"
    },
    {
        id: "AA-013",
        palabra_completa: "móvil",
        palabra_incompleta: "mo-vil",
        clasificacion: "Grave",
        letra_con_tilde_correcta: "ó",
        posicion_x: "centro",
        audio_guia: "MÓ-vil",
        silaba_tonica: 2,
        distractores: [
            "o",
            "á"
        ],
        regla: "Grave terminada en 'l' (no n/s): lleva tilde."
    },
    {
        id: "AA-014",
        palabra_completa: "cárcel",
        palabra_incompleta: "car-cel",
        clasificacion: "Grave",
        letra_con_tilde_correcta: "á",
        posicion_x: "derecha",
        audio_guia: "CÁR-cel",
        silaba_tonica: 2,
        distractores: [
            "a",
            "é"
        ],
        regla: "Grave terminada en 'l' (no n/s): lleva tilde."
    },
    {
        id: "AA-015",
        palabra_completa: "huésped",
        palabra_incompleta: "hues-ped",
        clasificacion: "Grave",
        letra_con_tilde_correcta: "é",
        posicion_x: "izquierda",
        audio_guia: "HUÉS-ped",
        silaba_tonica: 2,
        distractores: [
            "e",
            "á"
        ],
        regla: "Grave terminada en 'd' (no n/s): lleva tilde."
    },
    // ====== ESDRÚJULAS (16-20) ======
    {
        id: "AA-016",
        palabra_completa: "música",
        palabra_incompleta: "mu-si-ca",
        clasificacion: "Esdrújula",
        letra_con_tilde_correcta: "ú",
        posicion_x: "centro",
        audio_guia: "MÚ-si-ca",
        silaba_tonica: 3,
        distractores: [
            "u",
            "á"
        ],
        regla: "Esdrújula: siempre lleva tilde."
    },
    {
        id: "AA-017",
        palabra_completa: "pájaro",
        palabra_incompleta: "pa-ja-ro",
        clasificacion: "Esdrújula",
        letra_con_tilde_correcta: "á",
        posicion_x: "derecha",
        audio_guia: "PÁ-ja-ro",
        silaba_tonica: 3,
        distractores: [
            "a",
            "ó"
        ],
        regla: "Esdrújula: siempre lleva tilde."
    },
    {
        id: "AA-018",
        palabra_completa: "sábado",
        palabra_incompleta: "sa-ba-do",
        clasificacion: "Esdrújula",
        letra_con_tilde_correcta: "á",
        posicion_x: "izquierda",
        audio_guia: "SÁ-ba-do",
        silaba_tonica: 3,
        distractores: [
            "a",
            "ú"
        ],
        regla: "Esdrújula: siempre lleva tilde. (Feria de Masaya es los sábados)"
    },
    {
        id: "AA-019",
        palabra_completa: "rápido",
        palabra_incompleta: "ra-pi-do",
        clasificacion: "Esdrújula",
        letra_con_tilde_correcta: "á",
        posicion_x: "centro",
        audio_guia: "RÁ-pi-do",
        silaba_tonica: 3,
        distractores: [
            "a",
            "é"
        ],
        regla: "Esdrújula: siempre lleva tilde."
    },
    {
        id: "AA-020",
        palabra_completa: "médico",
        palabra_incompleta: "me-di-co",
        clasificacion: "Esdrújula",
        letra_con_tilde_correcta: "é",
        posicion_x: "derecha",
        audio_guia: "MÉ-di-co",
        silaba_tonica: 3,
        distractores: [
            "e",
            "á"
        ],
        regla: "Esdrújula: siempre lleva tilde. (El médico del MINSA)"
    }
];
const agudas = desafiosAtrapa.filter((d)=>d.clasificacion === "Aguda");
const graves = desafiosAtrapa.filter((d)=>d.clasificacion === "Grave");
const esdrujulas = desafiosAtrapa.filter((d)=>d.clasificacion === "Esdrújula");
const RESUMEN_ATRAPA = {
    total: desafiosAtrapa.length,
    agudas: agudas.length,
    graves: graves.length,
    esdrujulas: esdrujulas.length,
    vocabulario_nicaraguense: [
        "vigorón",
        "León",
        "sábado (feria Masaya)"
    ]
};
const __TURBOPACK__default__export__ = desafiosAtrapa;
}),
"[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/context/AppContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$LoginScreen$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/LoginScreen.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/Dashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$SubjectView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/SubjectView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ModuleView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ModuleView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$AvatarCustomizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/AvatarCustomizer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$RankingView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/RankingView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ProfileView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ProfileView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ParentDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ParentDashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$TeacherDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/TeacherDashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$StudentProgressView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/StudentProgressView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ContentManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ContentManager.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$BancoDesafiosViewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/BancoDesafiosViewer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ContenidoMINEDViewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/ContenidoMINEDViewer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$PulperiaFraccionesWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/PulperiaFraccionesWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$CamionMultiplicacionesWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/CamionMultiplicacionesWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$BusLetrasWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/BusLetrasWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$CartaOrtografiaWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/CartaOrtografiaWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$AtrapaAcentoWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/AtrapaAcentoWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/Header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Toasts$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Proyecto-De-Modalidad/frontend/src/components/Toasts.tsx [app-ssr] (ecmascript)");
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
;
;
;
;
;
;
function Router() {
    const { usuario, vista } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    if (!usuario) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$LoginScreen$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoginScreen"], {}, void 0, false, {
            fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
            lineNumber: 29,
            columnNumber: 12
        }, this);
    }
    let contenido = null;
    switch(vista){
        case "dashboard":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 35,
                columnNumber: 19
            }, this);
            break;
        case "asignatura":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$SubjectView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SubjectView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 38,
                columnNumber: 19
            }, this);
            break;
        case "modulo":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ModuleView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ModuleView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 41,
                columnNumber: 19
            }, this);
            break;
        case "avatar":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$AvatarCustomizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarCustomizer"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 44,
                columnNumber: 19
            }, this);
            break;
        case "ranking":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$RankingView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RankingView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 47,
                columnNumber: 19
            }, this);
            break;
        case "perfil":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ProfileView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProfileView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 50,
                columnNumber: 19
            }, this);
            break;
        case "padre":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ParentDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ParentDashboard"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 53,
                columnNumber: 19
            }, this);
            break;
        case "maestro":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$TeacherDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TeacherDashboard"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 56,
                columnNumber: 19
            }, this);
            break;
        case "progreso-estudiante":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$StudentProgressView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StudentProgressView"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 59,
                columnNumber: 19
            }, this);
            break;
        case "contenido":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ContentManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContentManager"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 62,
                columnNumber: 19
            }, this);
            break;
        case "banco-desafios":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$BancoDesafiosViewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BancoDesafiosViewer"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 65,
                columnNumber: 19
            }, this);
            break;
        case "contenido-mined":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$ContenidoMINEDViewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContenidoMINEDViewer"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 68,
                columnNumber: 19
            }, this);
            break;
        case "pulperia":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$PulperiaFraccionesWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PulperiaFraccionesWrapper"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 71,
                columnNumber: 19
            }, this);
            break;
        case "camion":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$CamionMultiplicacionesWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CamionMultiplicacionesWrapper"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 74,
                columnNumber: 19
            }, this);
            break;
        case "bus":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$BusLetrasWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BusLetrasWrapper"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 77,
                columnNumber: 19
            }, this);
            break;
        case "carta":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$CartaOrtografiaWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CartaOrtografiaWrapper"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 80,
                columnNumber: 19
            }, this);
            break;
        case "atrapa":
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$AtrapaAcentoWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AtrapaAcentoWrapper"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 83,
                columnNumber: 19
            }, this);
            break;
        default:
            contenido = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 86,
                columnNumber: 19
            }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pop",
                children: contenido
            }, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppProvider"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Router, {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Proyecto$2d$De$2d$Modalidad$2f$frontend$2f$src$2f$components$2f$Toasts$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastContainer"], {}, void 0, false, {
                fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Proyecto-De-Modalidad/frontend/src/app/page.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Proyecto-De-Modalidad_frontend_src_0i7rzpp._.js.map