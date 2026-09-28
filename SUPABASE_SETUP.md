# Conexión de Supabase

El proyecto usa el proyecto Supabase indicado en `supabase/config.toml`. Para ejecutar la aplicación, configure `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` en el servidor, y `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` para el cliente local. En Lovable Cloud, use la conexión de Supabase del proyecto. Nunca exponga `SUPABASE_SERVICE_ROLE_KEY` en variables `VITE_`.

La migración en `supabase/migrations/` crea `profiles`, `user_roles`, `courses`, `students` y `announcements`. Verifique que esté aplicada en el proyecto Supabase conectado. Los usuarios se autentican con correo y contraseña o con Google si el proveedor está habilitado en Supabase. Configure las URL de redirección de Supabase para `/app` en el dominio publicado y en el entorno local.

Un usuario autenticado necesita un registro en `public.user_roles` con rol `admin` o `docente` para acceder al panel. Ese registro debe asignarlo un administrador del proyecto desde un entorno confiable; la aplicación no concede roles al registrarse. El rol `estudiante` aún no tiene un panel habilitado. Las operaciones de lectura y escritura siguen las políticas RLS de la base de datos.

Las vistas de cursos, estudiantes y anuncios del panel usan funciones de servidor con el token de la sesión. Algunas vistas antiguas del dashboard todavía muestran datos de ejemplo; su migración queda pendiente.
