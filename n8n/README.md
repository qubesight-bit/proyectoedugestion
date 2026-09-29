# Chat público CEAC en n8n

Importá `workflows/ceac-website-chat.json` en tu instancia de n8n. En el nodo **Chat del sitio**, creá una credencial **Header Auth** con nombre de cabecera `x-chat-secret` y un valor aleatorio largo. En **Groq · Llama 3.1 8B**, creá la credencial **Header Auth** llamada `Groq Authorization`, nombre de cabecera `Authorization` y valor `Bearer TU_CLAVE_GROQ`. Guardá la clave únicamente en la credencial de n8n. Activá el workflow y copiá la **Production URL** del webhook.

En el entorno del servidor de Lovable configurá `N8N_CHAT_WEBHOOK_URL` con esa URL y `N8N_CHAT_WEBHOOK_SECRET` con el mismo valor de `x-chat-secret`. El sitio envía solicitudes a `/api/chat`; ese endpoint valida la entrada y llama a n8n desde el servidor. El nodo de n8n consulta Groq y devuelve `{ "reply": "...", "model": "..." }` al sitio. Probá una conversación real tras activar el workflow. No guardés credenciales en GitHub ni en variables públicas `VITE_`.

El modelo pedido, `llama-3.1-8b-instant`, podría no estar disponible en todos los planes de Groq. Si Groq devuelve un error de acceso al modelo, cambiá `model` en el nodo HTTP por uno habilitado en tu cuenta.
