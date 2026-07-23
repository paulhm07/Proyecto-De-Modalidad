# Guía de Administrador — EducaPlay

> **Panel del Maestro/a** — Gestión de contenido, seguimiento de estudiantes y recursos curriculares.
> Esta guía está dirigida al personal docente y de soporte técnico que administra la plataforma.

---

## 1. Introducción al Rol de Administrador

En EducaPlay, el rol de **administrador** lo ejerce el **Maestro/a**. Es quien crea, organiza y mantiene el contenido educativo, y quien da seguimiento al desempeño de los estudiantes.

### Responsabilidades principales

- **Crear contenido curricular**: asignaturas, módulos y desafíos alineados al currículo del MINED.
- **Gestionar el ciclo de vida del contenido**: crear y eliminar desafíos, módulos y asignaturas (operaciones CRUD parciales).
- **Monitorear a los estudiantes**: consultar puntos, nivel, porcentaje global de avance y medallas de cada estudiante.
- **Aprovechar recursos curriculares**: consultar y exportar el **Banco de Desafíos** y el **Contenido MINED** para reutilizar material listo.
- **Dar soporte**: ayudar a estudiantes con problemas de acceso (verificación de nombre y PIN).

### Alcance

- El maestro/a gestiona **sus propias** asignaturas y los **estudiantes asignados** a ellas.
- **No** hay edición directa (PUT/PATCH) de asignaturas, módulos o desafíos: para modificar un registro, debe **eliminarse y volver a crearse**.
- Las cuentas de usuario y el seed inicial de la tienda de avatares se gestionan a nivel de sistema (backend/BD), no desde el panel del maestro.

---

## 2. Acceso al Panel

### 2.1 Cómo ingresar de forma segura

1. Abre EducaPlay.
2. En la pantalla de inicio, toca el rol **Maestro/a**.
3. Asegúrate de estar en el modo **Iniciar sesión**.
4. Escribe tu **Nombre** y tu **PIN de 4 dígitos**.
5. Toca **¡Entrar a jugar!**.

> **Modo Demo**: si solo necesitas explorar el panel sin usar tu cuenta real, puedes entrar con el botón **Maestro/a → `MaestroDemo`** del bloque *Modo Demo*. No use la cuenta demo para gestionar contenido real.

### 2.2 Recomendaciones de acceso

- **No compartas tu PIN**. Es tu llave de administración.
- Cierra sesión con el botón **Salir** al terminar, especialmente en equipos compartidos.
- La sesión se guarda en el navegador; al recargar, volverás al panel si seguías logueado. Usa **Salir** para limpiar la sesión del dispositivo.

### 2.3 Estructura del menú del Maestro/a

Desde la barra superior (**Header**), el maestro/a tiene acceso a:

- **Inicio** — Panel del maestro/a (centro de control).
- **Contenido** — Gestión de contenido (CRUD).
- **Perfil** — Tu propio perfil.

---

## 3. Módulos de Gestión

---

### 3.1 Módulo: Panel del Maestro/a (centro de control)

**Propósito**
Pantalla de inicio del docente. Resume accesos rápidos a los bancos de contenido, la lista de estudiantes y las asignaturas propias.

**Elementos clave**

- **Botón Volver**: regresa a tu perfil.
- **Saludo**: *"Hola, {nombre}. Gestiona tus asignaturas y estudiantes."*.
- **Banner "Banco de Desafíos"**: 30 desafíos curriculares listos (Matemáticas y Lengua, 3 niveles). Al tocarlo abre el visor del banco.
- **Banner "Contenido MINED — 3er Grado"**: 4 módulos, 55 ítems alineados al MINED. Al tocarlo abre el visor MINED.
- **Sección "Mis estudiantes"**: lista con avatar, nombre, puntos, nivel y *% global*. Botón **Ver** para el detalle de cada uno.
- **Sección "Mis asignaturas"**: botón **Crear** (abre la gestión de contenido) y tarjetas de tus asignaturas con botón **Gestionar**.

**Flujo de trabajo — Cómo orientarse al ingresar**

1. Revisa **Mis estudiantes** para ver el estado general de tu grupo.
2. Si necesitas crear o ajustar contenido, toca **Contenido** en el menú (o **Crear/Gestionar**).
3. Si necesitas inspiración o material listo, entra al **Banco de Desafíos** o al **Contenido MINED**.

---

### 3.2 Módulo: Gestión de Contenido (CRUD)

**Propósito**
Es el corazón administrativo. Permite **crear, listar y eliminar** asignaturas, módulos y desafíos. Se organiza en **tres pestañas**: **Asignaturas**, **Módulos** y **Desafíos**.

> **Regla importante**: aquí **no existe la edición**. Para cambiar el texto de un desafío o el título de un módulo, **elimínalo y vuelve a crearlo**.

**Elementos globales**

- **Botón Volver**: regresa al panel principal.
- **Pestañas**: **Asignaturas**, **Módulos**, **Desafíos**.

#### 3.2.1 Pestaña Asignaturas

**Funciones disponibles**

- **Crear**: formulario "Nueva asignatura" con campos **Nombre** *(obligatorio, máx. 80)* y **Descripción** *(opcional, máx. 240)*. Botón **Crear asignatura**.
- **Ver/Listar**: sección "Asignaturas creadas" con tarjetas (nombre, descripción, nº de módulos).
- **Eliminar**: botón de papelera en cada tarjeta. Pide confirmación: *"¿Eliminar esta asignatura? Se borrarán sus módulos y desafíos."*.
- **Editar**: ❌ no disponible.

**Flujo de trabajo — Cómo crear una asignatura**

1. Toca la pestaña **Asignaturas**.
2. En "Nueva asignatura", escribe el **Nombre** (ej. *"Matemáticas"*) y, opcionalmente, una **Descripción**.
3. Toca **Crear asignatura**.
4. La nueva asignatura aparece en la lista "Asignaturas creadas".

**Flujo — Cómo pasar a gestionar módulos**

1. En la tarjeta de la asignatura, toca **Módulos**. Esto la selecciona y te lleva a la pestaña **Módulos**.

#### 3.2.2 Pestaña Módulos

**Funciones disponibles**

- **Crear**: requiere seleccionar primero una **asignatura** en el desplegable. Luego, formulario "Nuevo módulo" con **Título** *(obligatorio, máx. 80)* y **Nivel mínimo requerido** *(numérico, 1–99)*. Botón **Crear módulo**.
- **Ver/Listar**: sección "Módulos" con tarjetas (orden, título, nivel, nº de desafíos).
- **Eliminar**: papelera con confirmación: *"¿Eliminar este módulo y sus desafíos?"*.
- **Editar**: ❌ no disponible.

**Flujo de trabajo — Cómo crear un módulo**

1. Toca la pestaña **Módulos**.
2. En el desplegable, **selecciona una asignatura**.
3. Escribe el **Título** del módulo (ej. *"Sumas básicas"*) y el **Nivel mínimo requerido** (ej. *1*).
4. Toca **Crear módulo**.

> El **Nivel mínimo requerido** bloquea el módulo para estudiantes que no hayan alcanzado ese nivel. Úsalo para crear progresión pedagógica.

#### 3.2.3 Pestaña Desafíos

**Funciones disponibles**

- **Crear**: requiere seleccionar **Asignatura** y **Módulo** en dos desplegables. Formulario "Nuevo desafío" con:
  - **Tipo** (desplegable): *Selección múltiple*, *Completa el texto*, *Verdadero o falso*, *Asocia la pareja*, *Ordena la oración*.
  - **Pregunta** *(obligatorio, máx. 280)*.
  - **Puntos** *(numérico, 1–1000)*.
  - **Opciones**: lista de opciones con texto. Botón **Añadir** para agregar más. Cada opción tiene un botón circular para **marcar la correcta** (debe haber **exactamente 1** correcta y **mínimo 2** opciones con texto). Botón **X** para quitar una opción.
  - Botón **Crear desafío**.
- **Ver/Listar**: sección "Desafíos del módulo" con tarjetas (tipo, puntos, nº de opciones, pregunta).
- **Eliminar**: papelera con confirmación: *"¿Eliminar este desafío?"*.
- **Editar**: ❌ no disponible.

**Validaciones al crear un desafío**

- Si no hay módulo seleccionado: *"Selecciona un módulo"*.
- Si falta la pregunta: *"Escribe la pregunta"*.
- Si hay menos de 2 opciones con texto: *"Agrega al menos 2 opciones con texto"*.
- Si no hay exactamente 1 opción marcada como correcta: *"Debe haber exactamente 1 opción correcta"*.
- Si todo está bien: *"¡Desafío creado!"*.

**Flujo de trabajo — Cómo crear un desafío de selección múltiple**

1. Toca la pestaña **Desafíos**.
2. Selecciona **Asignatura** y **Módulo** en los desplegables.
3. En **Tipo**, elige *"Selección múltiple"*.
4. Escribe la **Pregunta** (ej. *"¿Cuánto es 7 × 6?"*).
5. Define los **Puntos** (ej. *10*).
6. En **Opciones**, escribe la primera opción en el campo *"Opción A"*. Toca **Añadir** para agregar *"Opción B"*, y repite si necesitas más.
7. **Marca la correcta** tocando el botón circular junto a la opción verdadera (aparece un ✓).
8. Toca **Crear desafío**.

**Flujo — Cómo crear un desafío Verdadero/Falso**

1. Selecciona el tipo *"Verdadero o falso"*.
2. Escribe una afirmación como **Pregunta**.
3. Añade dos **opciones**: una con texto *"Verdadero"* y otra *"Falso"* (escríbelas manualmente, no hay plantilla).
4. Marca la opción correcta.
5. Toca **Crear desafío**.

> **Tip profesional**: aunque el tipo sea "Completa el texto", "Asocia la pareja" u "Ordena la oración", el formulario de creación siempre pide **opciones con una correcta**. Asegúrate de que el enunciado guí al estudiante sobre cómo elegir la opción adecuada.

**Flujo — Cómo modificar un desafío existente**

1. En la lista "Desafíos del módulo", localiza el desafío.
2. Toca la papelera para **eliminarlo** (confirma el mensaje).
3. Vuelve a **crear** el desafío con los datos corregidos.

---

### 3.3 Módulo: Banco de Desafíos

**Propósito**
Visor curricular de **30 desafíos listos** (Matemáticas + Lengua) para 3.er grado. Permite **filtrar, copiar y descargar** el material en formato JSON o Kotlin para reutilizarlo.

**Elementos clave**

- **Botón Volver al panel**: regresa al panel del maestro/a.
- **Acciones globales**: **Descargar JSON** (descarga el archivo completo) y **Copiar todo** (copia todo en el formato seleccionado).
- **Stats resumen**: total, Matemáticas, Lengua, Fácil, Medio, Difícil.
- **Filtros**: por **Materia** (Todas / Matemáticas / Lengua), **Dificultad** (Todas / Fácil / Medio / Difícil) y **Mecánica** (Todas / Opción Múltiple / Arrastrar y Soltar / Completar Espacio).
- **Selector de formato**: pills **"{ } JSON"** / **"⌘ Kotlin"**.
- **Tarjetas de desafío**: cada una muestra materia, dificultad, mecánica, ID, enunciado, opciones (la correcta con ✓), pista y botones **Copiar** y **expandir código**.
- **Mapa curricular** (al final): resume qué cubre Matemáticas (15) y Lengua (15) por dificultad.

**Flujo de trabajo — Cómo reutilizar un desafío del banco**

1. Toca el banner **Banco de Desafíos** desde el panel del maestro/a.
2. Usa los **filtros** para acotar por materia, dificultad o mecánica.
3. Revisa el enunciado y las opciones en la tarjeta.
4. Toca **Copiar JSON** (o Kotlin) en la tarjeta, o usa **Copiar todo** para llevarte todo el banco.
5. Pega el contenido en tu herramienta externa o úsalo como referencia para crear un desafío equivalente en la **Gestión de Contenido**.

---

### 3.4 Módulo: Contenido MINED — 3.er Grado

**Propósito**
Visor del banco curricular oficial alineado al **MINED de Nicaragua**. Son **4 módulos** con **55 ítems** en total. Permite **copiar y descargar** el JSON de cada módulo.

**Elementos clave**

- **Botón Volver al panel**: regresa al panel del maestro/a.
- **Hero**: encabezado con currículo, grado y semestre; título *"Banco de Contenido MINED"*; chips de elementos culturales nicaragüenses.
- **Pestañas de 4 módulos**:
  - **Módulo 1** (Multiplicación y División) — Matemática.
  - **Módulo 2** (Fracciones y Geometría) — Matemática.
  - **Módulo 3** (Comprensión Lectora) — Lengua.
  - **Módulo 4** (Ortografía y Signos) — Lengua.
- **Acciones de exportación** por módulo: **Copiar JSON** y **Descargar JSON**.

**Contenido por módulo**

- **Módulo 1**: filtros *Todos / × Mult / ÷ Div*. Cada ítem incluye subtipo, contexto cultural, dificultad, enunciado, operación esperada, respuesta y distractores con explicación.
- **Módulo 2**: 10 desafíos visuales (5 fracciones + 5 geometría) con "Descripción Visual para UI", pregunta, opciones y explicación pedagógica.
- **Módulo 3**: lecturas colapsables con texto y contexto cultural 📌; cada lectura trae preguntas (habilidad, tipo, opciones y explicación).
- **Módulo 4**: tres subpestañas — **B/V**, **Acentuación** y **Signos**. Cada ítem muestra la palabra/oración con error, la forma correcta, la regla y el tipo de error.

**Flujo de trabajo — Cómo usar el contenido MINED**

1. Toca el banner **Contenido MINED** desde el panel del maestro/a.
2. Selecciona el **módulo** que te interese.
3. Revisa los ítems y sus explicaciones pedagógicas.
4. Toca **Copiar JSON** o **Descargar JSON** para exportar el módulo completo.
5. Usa el material como base para crear asignaturas y desafíos en la **Gestión de Contenido**.

---

### 3.5 Módulo: Seguimiento de Estudiantes (Progreso)

**Propósito**
Permite consultar el progreso detallado de un estudiante: puntos, nivel, porcentaje global, avance por asignatura/módulo y medallas.

**Elementos clave**

- **Botón Volver**: regresa al panel del maestro/a (o al del padre, según el rol).
- **Hero**: nombre del estudiante + *"Progreso detallado"*.
- **4 tarjetas de estadísticas**: **Puntos**, **Nivel**, **Desafíos** (completados/total) y **Global** (% de avance).
- **Sección "Asignaturas"**: por cada asignatura, un porcentaje, una barra de progreso y el desglose por módulo (completados/total y puntos ganados/totales).
- **Sección "Medallas"**: lista de medallas ganadas (título y descripción).

**Flujo de trabajo — Cómo revisar el avance de un estudiante**

1. Desde el **Panel del Maestro/a**, en "Mis estudiantes", toca **Ver** en la tarjeta del estudiante.
2. Revisa las **4 estadísticas** superiores para un diagnóstico rápido.
3. Baja a **Asignaturas** para ver en qué módulos va bien y dónde tiene rezago.
4. Consulta **Medallas** para reconocer logros y motivar al estudiante.

**Flujo — Cómo intervenir ante bajo rendimiento**

1. Identifica el módulo con menor porcentaje en la sección **Asignaturas**.
2. Verifica si el estudiante tiene el **nivel** suficiente (revisa la tarjeta **Nivel**).
3. Si el contenido es muy difícil, considera crear un **módulo de refuerzo** en la **Gestión de Contenido** con desafíos más sencillos (dificultad *Fácil* del **Banco de Desafíos**).

---

## 4. Buenas Prácticas de Seguridad y Soporte

### 4.1 Manejo de datos de usuarios

- **El PIN es información sensible**. No lo solicites por escrito ni lo almacenes en archivos de texto. Pide al estudiante que lo introduzca directamente en la app.
- **Verifica identidad** antes de gestionar cuentas: confirma el nombre completo del estudiante con el registro del aula.
- **Mínimo privilegio**: cada maestro/a solo gestiona sus propias asignaturas y sus estudiantes asignados. No intentes acceder a contenido de otros docentes.
- **Datos de menores**: EducaPlay está dirigida a niños de 8–9 años. Evita solicitar o registrar datos personales más allá del nombre y PIN necesarios para el funcionamiento.

### 4.2 Gestión responsable del contenido

- **Confirma antes de eliminar**: la eliminación de una asignatura borra en cascada sus módulos y desafíos. Lee siempre el mensaje de confirmación (*"¿Eliminar esta asignatura? Se borrarán sus módulos y desafíos."*).
- **Haz respaldos antes de cambios grandes**: usa **Descargar JSON** del Banco de Desafíos o del Contenido MINED para conservar copias del material curricular antes de reorganizar tus asignaturas.
- **Nombra con claridad**: usa títulos descriptivos para asignaturas y módulos (ej. *"Matemáticas — Multiplicación"* en lugar de solo *"Mate"*), para que estudiantes y otros docentes identifiquen el contenido.
- **Revisa las opciones correctas**: al crear un desafío, asegúrate de marcar **exactamente una** opción como correcta. Un error aquí genera evaluaciones equivocadas.

### 4.3 Resolución de incidencias comunes

| Incidencia | Causa probable | Solución |
|---|---|---|
| El estudiante no puede entrar | Nombre o PIN incorrectos | Verifica el nombre exacto (mayúsculas/minúsculas) y el PIN de 4 dígitos. Si persiste, crea una cuenta nueva. |
| Un módulo aparece **Bloqueado** | El estudiante no alcanza el *Nivel mínimo requerido* | Indica al estudiante que complete desafíos más sencillos para subir de nivel (XP), o ajusta el nivel del módulo. |
| Un desafío no se puede crear | Validación de opciones | Asegúrate de tener **mínimo 2 opciones** con texto y **exactamente 1** marcada como correcta. |
| No aparecen mis estudiantes | Ningún estudiante está asignado a tus asignaturas | Crea al menos una asignatura; los estudiantes que la tengan asignada aparecerán en "Mis estudiantes". |
| Quiero cambiar el texto de un desafío | No hay edición directa | **Elimina** el desafío y **vuelve a crearlo** con los datos corregidos. |
| La app se ve desactualizada | Caché del navegador | Pide al usuario que recargue la página (o cierre y abra sesión). |

### 4.4 Soporte a estudiantes

- **Guía, no reemplaces**: ayuda al estudiante a entender la pregunta, pero deja que él responda. El aprendizaje ocurre al intentar.
- **Usa las explicaciones pedagógicas**: el **Contenido MINED** y el **Banco de Desafíos** incluyen explicaciones y reglas. Aprovéchalas para retroalimentar a tus estudiantes.
- **Fomenta el uso de los minijuegos**: los cinco minijuegos (*La Pulpería de Fracciones*, *El Camión de las Multiplicaciones*, *El Bus de las Letras*, *La Carta Mal Enviada*, *Atrapa el Acento*) refuerzan áreas clave de forma lúdica. Recomienda sesiones cortas y frecuentes.

### 4.5 Recomendaciones de sesión

- **Cierra sesión** con **Salir** al terminar, sobre todo en equipos compartidos.
- Si trabajas desde un dispositivo personal, la sesión se mantiene al recargar; aun así, **cambia tu PIN periódicamente** si sospechas que pudo quedar expuesto.
- Reporta a soporte técnico cualquier error inesperado, indicando el **nombre del estudiante**, la **pantalla** donde ocurrió y el **mensaje exacto** del error.

---

*EducaPlay · Panel del Maestro/a · Documentación operativa para gestión de contenido y seguimiento de estudiantes.*
