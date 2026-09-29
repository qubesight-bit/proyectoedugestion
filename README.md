# EduGestión · CEAC

Build this app using the HTML files referenced below. You can hotlink the images referenced in the HTML. The attached images are screenshots of the desired screens. Here are public links to the html of the screens which you should read and use to build the app:

1. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmZmMmM2YzhlNTAwOTEwN2U5ZjA2MmM4YzUzEgsSBxCNyrmTvAcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NDg1MzA3ODE0ODY0NDcwOQ&filename=&opi=89354086
2. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmZmMmJmOGRjMGYwMmQzZmM3NDMxMWViMGQzEgsSBxCNyrmTvAcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NDg1MzA3ODE0ODY0NDcwOQ&filename=&opi=89354086
3. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmZmMmI0ZWZiMjAwN2M0ZDkxMTRlMWVlNGY1EgsSBxCNyrmTvAcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NDg1MzA3ODE0ODY0NDcwOQ&filename=&opi=89354086
4. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmZmMmM1OGMyZTIwMmQzZDEyY2M2MjljMTcxEgsSBxCNyrmTvAcYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjk0NDg1MzA3ODE0ODY0NDcwOQ&filename=&opi=89354086

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://proyectoedugestion.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c08b0c26-8c81-4793-8fa6-c97ae058a9eb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

### Guía para presentar el proyecto

Abrí [docs/CRITERIOS_PRESENTACION.md](docs/CRITERIOS_PRESENTACION.md) en el IDE: contiene los criterios, rutas de los archivos y una demostración paso a paso. Ejecutá `npm test`, `npx tsc --noEmit` y `npm run build` para verificarlo.

### Chatbot público con n8n y Groq

El endpoint `/api/chat` requiere `N8N_CHAT_WEBHOOK_URL` y `N8N_CHAT_WEBHOOK_SECRET` como variables secretas **del servidor**. La aplicación manda los mensajes al webhook autenticado de n8n, y el nodo HTTP de ese workflow consulta a Groq. La credencial de Groq se guarda en n8n; consultá [n8n/README.md](n8n/README.md). Nunca publiques claves en el repositorio ni las expongas como variables `VITE_`.

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
