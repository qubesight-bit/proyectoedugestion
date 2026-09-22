# Rama de trabajo — Caleb

Esta rama contiene el trabajo asignado a **Caleb** para el proyecto React del Centro Educativo Adventista de Cartago.

## Responsabilidades principales

### 1. Portal público del colegio
Archivos/módulos:
- `src/routes/index.tsx`
- Página de inicio pública.
- Secciones institucionales.
- Oferta académica visible al público.
- Admisiones, contacto, imágenes y contenido institucional.

### 2. Gestión de profesores
Archivos/módulos:
- `src/features/teachers/index.tsx`
- Directorio de profesores.
- Tarjetas, detalles y acciones de docentes.

### 3. Dashboard del docente
Responsable de separar y mantener desde `src/routes/app.tsx` las vistas:
- `teacher_home`
- `teacher_courses`
- `teacher_grades`
- `teacher_attendance`
- `teacher_resources`

Estas vistas deben migrarse progresivamente a módulos React propios dentro de `src/features/teacher/`.

### 4. Funciones del docente
Implementar y mantener:
- Mis cursos.
- Registro de calificaciones.
- Registro de asistencia.
- Recursos/materiales.
- Vista resumen del docente.

### 5. Navegación y experiencia visual
Archivos/módulos:
- `src/components/layout/index.tsx`
- Navegación responsive.
- Sidebar y BottomNav.
- Experiencia visual del portal docente y público.
- Adaptación móvil/escritorio sin cambiar la arquitectura React.

## Trabajo ya existente asignado a Caleb

Del código que ya estaba en `main`, se consideran parte de esta rama:
- Landing page pública.
- Directorio de profesores.
- Dashboard docente existente dentro de `src/routes/app.tsx`.
- Navegación para el rol Docente.
- Estilos y componentes visuales relacionados con sus pantallas.

## Regla para evitar conflictos

Caleb debe mover las vistas docentes que todavía están dentro de `src/routes/app.tsx` hacia componentes separados en `src/features/teacher/`, en lugar de seguir aumentando el archivo monolítico.

Los cambios compartidos de tipos o navegación deben mantenerse pequeños para que luego puedan integrarse mediante Pull Request sin conflictos.
