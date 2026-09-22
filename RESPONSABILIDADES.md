# Rama Front End — Ernesto

Proyecto: Centro Educativo Adventista de Cartago

> Alcance obligatorio: **100% Front End en React + TypeScript.**
> No se requiere backend, base de datos, API real ni autenticación real.

## Responsabilidad de Ernesto — Panel Administrador

### Pantallas y funciones
- Login visual y selección de rol.
- Dashboard administrativo.
- Gestión visual de estudiantes.
- Gestión visual de cursos.
- Supervisión de profesores.
- Perfil institucional.
- Formularios y modales.
- Búsquedas, filtros, tarjetas, métricas y feedback visual.

### Archivos principales
- `src/features/auth/index.tsx`
- `src/features/dashboard/index.tsx`
- `src/features/students/index.tsx`
- `src/features/courses/index.tsx`
- `src/features/admin/index.tsx`

### Funcionamiento Front End
Las operaciones se simulan con:
- `useState`
- props
- arreglos de datos mock
- modales
- filtros locales
- mensajes/toasts

No se deben agregar llamadas a API, Supabase ni servicios de backend.

## Trabajo existente que corresponde a Ernesto
- Login React.
- Dashboard de administrador.
- Cursos.
- Estudiantes.
- Supervisión docente.
- Interacciones y formularios del administrador.

## Archivos compartidos
`src/routes/app.tsx`, tipos y componentes compartidos solo deben modificarse cuando sea necesario para conectar módulos del Front End.

## Regla de trabajo
Trabajar en la rama `ernesto`.
No hacer push directo a `main`.
