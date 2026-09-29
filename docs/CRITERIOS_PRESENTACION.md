# EduGestión — evidencia técnica para la presentación

Abrí este repositorio en el IDE. El código y las pruebas son la evidencia; la previsualización de Lovable sirve para comprobar la interfaz y el guardado real.

## Verificación local

```bash
npm ci
npm test
npx tsc --noEmit
npm run build
```

Las pruebas enfocadas están en `tests/lib/` y `tests/components/`. Los archivos generados de pruebas visuales que no compilaban fueron retirados para que `npm test` sea ejecutable y refleje funciones reales.

| Criterio | Dónde está la implementación | Cómo se comprueba |
| --- | --- | --- |
| Estructura y diseño | `src/routes/`, `src/components/app/`, `src/components/shared/`, `src/lib/` | Rutas, UI, acceso a datos y validación están separados; revisar el árbol del proyecto. |
| Pruebas unitarias | `tests/lib/`, `tests/components/`, `vitest.config.ts` | `npm test`: validación, sesión, roles, persistencia, chat, formulario y CRUD. |
| Supabase como almacenamiento | `src/integrations/supabase/`, `supabase/migrations/`, `supabase/manual/complete_edugestion.sql` | En `/app`, crear y recargar un anuncio; verificar la fila en Supabase. Las tablas deben estar aplicadas en el proyecto usado por Lovable. |
| Accesibilidad | `src/components/app/CrudDialog.tsx`, `src/components/shared/AccessibilityWidget.tsx`, `src/routes/__root.tsx` | Navegar con Tab, Shift+Tab y Escape; comprobar etiquetas, errores de formularios y enlace de salto al contenido. La revisión visual y con lector de pantalla requiere navegador. |
| Rutas públicas y privadas | `src/routes/index.tsx`, `src/routes/_authenticated/route.tsx`, `src/routes/_authenticated/app.tsx` | `/` es pública; `/app` redirige a `/auth` sin sesión o sin rol `admin`/`docente`. |
| Persistencia de sección | `src/lib/app-section.ts`, `src/components/app/AppExperience.tsx` | En `/app`, seleccionar Cursos, recargar y verificar que sigue en Cursos. Al cerrar sesión se borra la sección guardada. |
| CRUD | `src/components/app/CoursesManager.tsx`, `StudentsManager.tsx`, `AnnouncementsManager.tsx` | Admin puede crear, leer, editar y borrar; docente solo consulta. `tests/components/app/AnnouncementsManager.test.tsx` ejercita esas operaciones y la confirmación de borrado. |
| n8n e IA | `n8n/workflows/ceac-website-chat.json`, `src/routes/api/chat.ts`, `n8n/README.md` | Chat público → API del servidor → webhook n8n autenticado → Groq → respuesta. El workflow importado y sus credenciales se configuran fuera de GitHub. |
| Protección de rutas y datos | `src/lib/access.ts`, `src/routes/_authenticated/route.tsx`, políticas RLS en `supabase/` | Pruebas de roles en `tests/lib/access.test.ts`; RLS permite leer al personal y escribir solo a admin. Probar además con usuarios reales en Supabase. |

## Demostración sugerida sin datos reales

1. Mostrar `npm test` y `npm run build` en la terminal del IDE.
2. Mostrar el guard de `/app` y una política RLS de `announcements`.
3. Ingresar en la web con un administrador de prueba, crear un anuncio ficticio, recargar, editarlo y borrarlo.
4. Cambiar a Cursos, recargar y comprobar la sección guardada. Probar Tab y Escape en un formulario.
5. Preguntar al chatbot por los niveles ofrecidos y mostrar la ejecución en n8n.

**Alcance:** las pruebas locales no sustituyen verificar credenciales, tablas, RLS y despliegue en la instancia activa. El proyecto no incluye una prueba automática conectada a la base de producción para evitar modificar datos reales.
