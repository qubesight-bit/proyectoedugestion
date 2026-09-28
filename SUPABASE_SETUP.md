# Conexión de Supabase

El proyecto utiliza `https://zwyccbuegzomgtsclcxh.supabase.co`. La URL y la clave *publishable* del cliente están fijadas en `vite.config.ts`; las funciones de usuario autenticado usan ese mismo proyecto. No cambie solo uno de estos lugares al cambiar de proyecto. Las operaciones administrativas del webhook n8n requieren `SUPABASE_URL=https://zwyccbuegzomgtsclcxh.supabase.co` y una `SUPABASE_SERVICE_ROLE_KEY` **de este proyecto** en el entorno del servidor. Nunca exponga esa clave en el cliente ni la suba a GitHub.

La migración en `supabase/migrations/` crea `profiles`, `user_roles`, `courses`, `students` y `announcements`. Verifique que esté aplicada en el proyecto Supabase conectado. Los usuarios se autentican con correo y contraseña o con Google si el proveedor está habilitado en Supabase. Configure las URL de redirección de Supabase para `/app` en el dominio publicado y en el entorno local.

Para el proyecto EduGestion `zwyccbuegzomgtsclcxh`, donde ya existen `profiles` y `user_roles` pero faltan las otras tablas, ejecute **una vez** `supabase/manual/complete_edugestion.sql` en SQL Editor. La transacción crea las tablas vacías y sus políticas RLS; no carga datos de ejemplo. No ejecute de nuevo la primera migración sobre las tablas existentes.

Un usuario autenticado necesita un registro en `public.user_roles` con rol `admin` o `docente` para acceder al panel. Primero cree el usuario en Authentication → Users del proyecto Supabase (o habilite el proveedor de Google). La pertenencia como Owner de la organización Supabase no crea automáticamente un usuario de la aplicación. Asigne el rol desde SQL Editor con una cuenta verificada; la aplicación no concede roles al registrarse. El rol `estudiante` aún no tiene un panel habilitado. Las operaciones de lectura y escritura siguen las políticas RLS de la base de datos.

Las vistas de cursos, estudiantes y anuncios del panel usan funciones de servidor con el token de la sesión. Algunas vistas antiguas del dashboard todavía muestran datos de ejemplo; su migración queda pendiente.
