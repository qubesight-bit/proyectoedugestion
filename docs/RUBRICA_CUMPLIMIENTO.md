# Matriz de cumplimiento — Proyecto final FWD Academy

Supabase sustituye el requisito de JSON Server por autorización del docente. La aplicación mantiene el mismo principio académico: React consume endpoints mediante una capa de servicios, pero utiliza persistencia, autenticación y seguridad reales.

| # | Requisito | Estado | Evidencia en el IDE | Demostración |
| --- | --- | --- | --- | --- |
| 1 | React, componentes, páginas y rutas | Cumple | `src/components/`, `src/pages/`, `src/routes/`, `src/router.tsx` | Abrir `/`, `/auth` y `/app` |
| 2 | Responsive 375/768/1280 | Cumple | Clases `sm:`, `md:`, `lg:`, `xl:` y `src/styles.css` | DevTools en los tres anchos |
| 3 | Accesibilidad 3 de 4 | Cumple 4/4 | `AccessibilityWidget.tsx`, `CrudDialog.tsx`, `__root.tsx` | Alto contraste, texto grande, Tab/Escape y estados con texto |
| 4 | Carpeta Services local/externa | Cumple | `src/services/api/`, `src/services/external/weather.service.ts` | Clima de Cartago en dashboard |
| 5 | Backend simulado | Sustituido | `src/integrations/supabase/`, `supabase/migrations/` | Crear dato, recargar y verificar persistencia |
| 6 | Rutas públicas/privadas | Cumple | `src/routes/_authenticated/route.tsx`, `src/lib/access.ts` | `/app` redirige sin sesión |
| 7 | Login y módulo interno de usuarios | Cumple funcionalmente con Supabase Auth | `/auth`, `TeachersManager.tsx`, Supabase Authentication | Crear usuario administrativo y vincular rol |
| 8 | Roles persistidos | Cumple | tabla `user_roles`, RLS, `useAccount.ts`, `validation.ts` | Comparar admin/docente |
| 9 | CRUD administrativos | Cumple | Cursos, estudiantes, docentes, anuncios, notas, expedientes y solicitudes en `src/components/app/` | Crear, leer, editar, borrar/archivar |
| 10 | 3 métricas y gráfico | Cumple ampliamente | `AnalyticsDashboard.tsx`, Recharts | KPI, pastel y barras |
| 11 | Pruebas unitarias | Cumple | `tests/`, `vitest.config.ts`, Testing Library | `npm test` |
| 12 | IA en frontend | Cumple | `AIChat.tsx`, `AssistantChat.tsx`, `/api/chat`, `/api/internal-chat` | Consulta pública e interna |
| 13 | N8N: mínimo 2 flujos | Cumple | `ceac-website-chat.json`, `ceac-internal-chat.json` | Importar/abrir ambos flujos |
| 14 | Anteproyecto | Cumple | `docs/ANTEPROYECTO.md` | Abrir en el IDE |
| 15 | Mockups escritorio/móvil | Cumple | `docs/mockups/` | Previsualizar SVG |
| 16 | Libro de marca | Cumple | `docs/LIBRO_DE_MARCA.md` | Mostrar paleta, logo y reglas |

## Equivalencias tecnológicas

- **Router:** Lovable generó el proyecto con **TanStack Router**, que proporciona Router DOM, rutas anidadas, redirecciones y guards tipados. Migrarlo solo para cambiar el nombre de la librería rompería la arquitectura de TanStack Start sin aportar una función académica nueva.
- **Pruebas:** se usa **Vitest**, compatible con Jest (`describe`, `it`, `expect`, mocks) y recomendado para Vite. Testing Library y `@testing-library/jest-dom` validan la interfaz. El comando solicitado se conserva como `npm test`.
- **Backend:** Supabase reemplaza JSON Server por acuerdo. Los roles se almacenan en `user_roles`, la sesión en Supabase Auth y la autorización adicional en RLS.

## Comandos de verificación

```bash
npm ci
npm test
npx tsc --noEmit
npm run build
```

## Guion corto para el profesor

1. Abrir esta matriz en el IDE.
2. Ejecutar las pruebas y compilación.
3. Mostrar el guard de `/app`, una política RLS y `user_roles`.
4. Hacer un CRUD completo de anuncio y archivar/recuperar un estudiante.
5. Mostrar indicadores, gráficas y el endpoint externo.
6. Probar accesibilidad con teclado, contraste y texto grande.
7. Ejecutar el chatbot y enseñar los dos workflows en n8n.
