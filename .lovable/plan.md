# Cumplir criterios del proyecto (base de datos, CRUD, rutas, IA, n8n, pruebas)

La base de datos (Lovable Cloud) ya está activa con usuarios, perfiles y roles. Falta conectarla a la app y completar los criterios.

## 1. Almacenamiento (base de datos)
Nuevas tablas con reglas de acceso por rol:
- **cursos**: nombre, categoría, docente, descripción, horario, cupo
- **estudiantes**: nombre, grado, correo, encargado, estado, notas médicas
- **anuncios**: título, contenido, autor, fecha
- Admin: crear/editar/eliminar todo. Docente: ver todo y editar sus cursos. Datos de ejemplo actuales cargados como filas iniciales.

## 2. CRUDs
Reemplazar los datos de ejemplo por datos reales en Cursos, Estudiantes y Anuncios: listar, crear, editar y eliminar (con confirmación y avisos de éxito/error).

## 3. Rutas públicas y privadas + protección
- Públicas: `/` (inicio institucional), `/auth` (iniciar sesión).
- Privadas: `/app/...` (panel, cursos, estudiantes, anuncios, IA, perfil) — si no hay sesión redirige a `/auth`.
- Secciones de administración solo visibles para rol admin; el servidor también valida el rol en cada operación.

## 4. Persistencia de la sesión
La sesión se guarda y se restaura al recargar; cerrar sesión limpia datos y regresa a `/auth`. Opción "Recordar sesión" funcional.

## 5. Integración de IA
Asistente en la pestaña IA (chat en español con respuestas en tiempo real) que conoce el contexto institucional y puede resumir datos de cursos/estudiantes. Sin claves adicionales.

## 6. n8n
- Endpoint público seguro que n8n puede llamar (ej. crear anuncio automáticamente), validado con una clave secreta compartida.
- Envío de eventos a n8n (nuevo estudiante, nuevo anuncio) a una URL de webhook de n8n. Necesitaré que me proporciones esa URL y crees una clave secreta al final.

## 7. Accesibilidad
Etiquetas en campos y botones con íconos, navegación con teclado, foco visible, contraste, `lang="es"`, textos alternativos, anuncios de errores para lectores de pantalla.

## 8. Pruebas unitarias
Configurar Vitest + Testing Library con pruebas para: validaciones de formularios, utilidades, formulario de inicio de sesión, protección por rol y componentes de listas. Comando `bun run test`.

## Detalles técnicos
- Migración: tablas `courses`, `students`, `announcements` con GRANTs, RLS usando `has_role`, triggers `updated_at`, INSERTs de ejemplo.
- Rutas TanStack: `src/routes/auth.tsx`, `src/routes/_authenticated/route.tsx` (gestionado), `src/routes/_authenticated/app/*`; `onAuthStateChange` en `__root`.
- Server functions con `requireSupabaseAuth` para CRUD; validación con zod.
- IA: server route de streaming usando Lovable AI Gateway (`google/gemini-3-flash-preview`).
- n8n: `src/routes/api/public/n8n.ts` con verificación de secreto `N8N_WEBHOOK_SECRET`; salida vía `N8N_WEBHOOK_URL`.
- Vitest + jsdom + @testing-library/react; tests en `src/**/*.test.ts(x)`.
