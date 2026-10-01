# Centro Educativo Adventista de Cartago

Build this app using the HTML files referenced below. You can hotlink the images referenced in the HTML. The attached images are screenshots of the desired screens. Here are public links to the html of the screens which you should read and use to build the app:

1. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmZmMmM2YzhlNTAwOTEwN2U5ZjA2MmM4YzUzEgsSBxCNyrmTvAcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NDg1MzA3ODE0ODY0NDcwOQ&filename=&opi=89354086
2. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmZmMmJmOGRjMGYwMmQzZmM3NDMxMWViMGQzEgsSBxCNyrmTvAcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NDg1MzA3ODE0ODY0NDcwOQ&filename=&opi=89354086
3. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmZmMmI0ZWZiMjAwN2M0ZDkxMTRlMWVlNGY1EgsSBxCNyrmTvAcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NDg1MzA3ODE0ODY0NDcwOQ&filename=&opi=89354086
4. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmZmMmM1OGMyZTIwMmQzZDEyY2M2MjljMTcxEgsSBxCNyrmTvAcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NDg1MzA3ODE0ODY0NDcwOQ&filename=&opi=89354086

This project was built with [Lovable](https://lovable.dev).

**Aplicación publicada**: https://ceaccr.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c08b0c26-8c81-4793-8fa6-c97ae058a9eb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

### Guía para presentar el proyecto

La evidencia completa está organizada para revisarla directamente desde el IDE:

- [Matriz de cumplimiento de la rúbrica](docs/RUBRICA_CUMPLIMIENTO.md)
- [Anteproyecto](docs/ANTEPROYECTO.md)
- [Libro de marca](docs/LIBRO_DE_MARCA.md)
- [Guía de presentación](docs/CRITERIOS_PRESENTACION.md)
- [Funciones implementadas](docs/NUEVAS_FUNCIONES.md)
- [Mockup de escritorio](docs/mockups/escritorio.svg) y [mockup móvil](docs/mockups/movil.svg)

El backend solicitado originalmente como JSON Server se sustituyó, con autorización académica, por Supabase. Ejecutá `npm test`, `npx tsc --noEmit` y `npm run build` para verificar el proyecto.

### Administración de usuarios

El módulo **Usuarios** de `/app` permite a un administrador listar cuentas, registrar usuarios, asignar roles y eliminarlos. Su función segura se despliega una vez con:

```sh
npx supabase functions deploy admin-users
```

La función exige una sesión válida y comprueba en el servidor que el solicitante tenga el rol `admin`; la clave de servicio nunca se envía al navegador.

### Acceso con Google

La configuración de Google Cloud y Supabase está documentada en [docs/CONFIGURAR_GOOGLE_OAUTH.md](docs/CONFIGURAR_GOOGLE_OAUTH.md). Los secretos OAuth se guardan únicamente en Supabase, nunca en el repositorio.

### Servicio externo real

El panel analítico consume el clima actual del campus desde Open-Meteo mediante `src/services/external/weather.service.ts`, manteniendo las llamadas HTTP externas dentro de la carpeta `services`.

### Chatbot público con n8n y Groq

El endpoint `/api/chat` requiere `N8N_CHAT_WEBHOOK_URL` y `N8N_CHAT_WEBHOOK_SECRET` como variables secretas **del servidor**. La aplicación manda los mensajes al webhook autenticado de n8n, y el nodo HTTP de ese workflow consulta a Groq. La credencial de Groq se guarda en n8n; consultá [n8n/README.md](n8n/README.md). Nunca publiques claves en el repositorio ni las expongas como variables `VITE_`.

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
