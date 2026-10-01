# Anteproyecto — Plataforma del Centro Educativo Adventista de Cartago

**Modalidad:** equipo  
**Tecnología:** React, TypeScript, Supabase, n8n y Groq  
**Institución:** FWD Academy

## Introducción

El Centro Educativo Adventista de Cartago requiere centralizar la información académica y administrativa que actualmente se consulta en procesos separados. La plataforma propuesta integra el sitio público, admisiones y un panel privado para administradores y docentes. El sistema prioriza seguridad, accesibilidad, trazabilidad y facilidad de uso en dispositivos móviles, tabletas y computadoras.

## Objetivo general

Desarrollar una aplicación web responsive en React que permita administrar estudiantes, docentes, cursos, calificaciones, anuncios, solicitudes de ingreso y expedientes, aplicando autenticación, autorización por roles, persistencia, automatización e inteligencia artificial.

## Objetivos específicos

1. Implementar navegación pública y privada con protección de rutas y persistencia de sesión.
2. Gestionar los recursos institucionales mediante operaciones de creación, lectura, actualización y eliminación o archivado recuperable.
3. Proteger datos mediante roles de administrador y docente y políticas RLS en Supabase.
4. Presentar métricas académicas mediante indicadores y gráficos accesibles.
5. Integrar un chatbot público y un asistente interno mediante n8n y un modelo de IA.
6. Automatizar la notificación de cambios en solicitudes de admisión.
7. Aplicar prácticas de accesibilidad y diseño adaptable a 375, 768 y 1280 píxeles.
8. Verificar la lógica crítica con pruebas unitarias automatizadas.

## Desarrollo y alcance

La solución incluye un landing institucional, información académica, anuncios y formulario público de admisión. El área `/app` está reservada para personal autenticado. Los administradores gestionan todos los recursos; los docentes consultan únicamente los cursos y estudiantes autorizados. El sistema conserva expedientes y permite archivar estudiantes sin perder su información.

Supabase sustituye, con autorización docente, el JSON Server propuesto inicialmente. Esta decisión conserva el objetivo pedagógico de consumir endpoints desde React y agrega persistencia real, autenticación, almacenamiento privado y autorización a nivel de filas. Las consultas externas se concentran en `src/services/`; el panel consume además Open-Meteo como endpoint externo real.

Los workflows entregados en `n8n/workflows/` cubren dos flujos independientes: chatbot público y asistente interno. La automatización de admisiones complementa esos flujos mediante la función `update-admission-status` y un webhook de correo.

## Arquitectura

- `src/routes/`: páginas y rutas públicas/privadas.
- `src/components/`: componentes reutilizables y módulos del panel.
- `src/services/`: consumo de Supabase y servicios externos.
- `src/hooks/`: lógica reutilizable de React.
- `src/lib/`: reglas de negocio, validación y seguridad.
- `supabase/`: migraciones, RLS, Storage y Edge Functions.
- `n8n/workflows/`: automatizaciones importables.
- `tests/`: pruebas unitarias de componentes y lógica.

## Anexos y mockups

- [Mockup de escritorio](mockups/escritorio.svg)
- [Mockup móvil](mockups/movil.svg)
- [Libro de marca](LIBRO_DE_MARCA.md)
- [Matriz completa de la rúbrica](RUBRICA_CUMPLIMIENTO.md)

Los mockups reflejan el dashboard implementado: navegación, indicadores, gráficas, cursos y acciones rápidas.
