# Configurar acceso con Google

El botón del sitio usa Supabase Auth. Las credenciales privadas de Google se configuran en los paneles correspondientes y nunca se guardan en GitHub.

## 1. Google Cloud Console

En **APIs y servicios → Pantalla de consentimiento OAuth**, publique la aplicación o agregue como usuarios de prueba las cuentas que la usarán.

En el cliente OAuth de tipo **Aplicación web**, configure:

- Origen JavaScript autorizado: `https://ceaccr.lovable.app`
- URI de redirección autorizada: `https://zwyccbuegzomgtsclcxh.supabase.co/auth/v1/callback`

Copie el Client ID y Client Secret.

## 2. Supabase

En **Authentication → Providers → Google**:

1. Active Google.
2. Pegue el Client ID y Client Secret.
3. Guarde los cambios.

En **Authentication → URL Configuration** use:

- Site URL: `https://ceaccr.lovable.app`
- Redirect URLs: `https://ceaccr.lovable.app/auth**` y `http://localhost:3000/auth**`

## 3. Rol interno

Autenticarse con Google crea o enlaza la identidad, pero `/app` solo admite administradores y docentes. Después del primer acceso, asigne al usuario un registro en `public.user_roles` mediante el módulo **Usuarios** del panel o desde Supabase.

Si la cuenta se autentica pero no tiene uno de esos roles, el sitio cierra esa sesión y muestra una explicación en vez de quedar en un ciclo de redirecciones.
