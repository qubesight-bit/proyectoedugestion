# Docentes, cursos, admisión y asistente interno

## Activación en Supabase

El código de GitHub no ejecuta SQL automáticamente. En el **proyecto EduGestion que usa Lovable**, abrí SQL Editor y ejecutá **una sola vez** `supabase/manual/teacher_admissions.sql`. Requiere las tablas y funciones anteriores de `complete_edugestion.sql`. La migración crea perfiles docentes, vínculos curso-estudiante y solicitudes de admisión con RLS. Conserva los cursos y estudiantes existentes y genera perfiles a partir de los nombres de docente actuales. No vuelvas a ejecutar el archivo si ya se aplicó: SQL Editor no registra migraciones.

Después de ejecutarlo, recargá Lovable y comprobá:

1. Admin → **Docentes**: editar perfil existente o añadir docente. Para darle acceso, seleccioná una cuenta existente con rol `docente`.
2. Admin → **Cursos**: asignar docente y abrir **Ver estudiantes y ficha**; vincular un estudiante existente.
3. Iniciar sesión con esa cuenta docente: **Mis cursos** y la ficha de ese estudiante; otros cursos no aparecen en su panel. RLS restringe la lectura de fichas a cursos asignados.
4. En la página pública `/admision`, enviar una solicitud ficticia. Debe aparecer en Admin → **Solicitudes**; cambiar su estado allí. Borrá el registro ficticio desde Supabase cuando termines la prueba.
5. Admin → **Anuncios**: crear, editar y borrar un anuncio institucional.

## Asistente interno

El chat público continúa usando su workflow anterior. El panel **Consultas** puede responder de inmediato mediante consultas locales autenticadas. Para respuestas generadas por Groq, importá y activá `n8n/workflows/ceac-internal-chat.json` y configurá `N8N_INTERNAL_CHAT_WEBHOOK_URL` en los secretos del servidor de Lovable; las instrucciones están en `n8n/README.md`. Usa el mismo `N8N_CHAT_WEBHOOK_SECRET` ya configurado. Nunca pongás claves en el frontend. La IA recibe agregados y anuncios, sin nombres ni contactos de estudiantes o familias; la consulta escrita por el usuario sí se envía a Groq.

## Verificación en IDE

Ejecutá `npm test`, `npx tsc --noEmit` y `npm run build`. El panel docente está en `src/components/app/TeachersManager.tsx`; el vínculo y ficha en `CourseRoster.tsx`; la bandeja en `AdmissionsManager.tsx`; el formulario en `src/routes/admision.tsx`; el endpoint privado en `src/lib/internal-chat.server.ts`.
