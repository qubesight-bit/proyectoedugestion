# Rama Front End — Caleb

Proyecto: Centro Educativo Adventista de Cartago

> Alcance obligatorio: **100% Front End en React + TypeScript.**
> No se requiere backend, base de datos, API real ni autenticación real.

## Responsabilidad de Caleb — Docente + Sitio Público

### Página pública
- Landing page del colegio.
- Secciones institucionales.
- Oferta académica.
- Admisiones.
- Contacto.
- Responsive.

Archivo principal:
- `src/routes/index.tsx`

### Profesores
- Directorio de profesores.
- Tarjetas y detalles visuales.

Archivo principal:
- `src/features/teachers/index.tsx`

### Panel del docente
Caleb tiene asignadas las vistas:
- Inicio / resumen.
- Mis cursos.
- Calificaciones.
- Asistencia.
- Recursos/materiales.

Estas vistas deben organizarse como componentes React dentro de:
- `src/features/teacher/`

### Navegación
- Navegación del rol Docente.
- Sidebar.
- Bottom navigation móvil.
- Adaptación responsive.

Archivo compartido:
- `src/components/layout/index.tsx`

### Funcionamiento Front End
Las operaciones se simulan con:
- `useState`
- props
- arreglos de datos mock
- filtros locales
- botones y modales
- estados visuales

No se deben agregar llamadas a API, Supabase ni servicios de backend.

## Trabajo existente que corresponde a Caleb
- Landing page.
- Directorio de profesores.
- Dashboard docente existente.
- Navegación del docente.
- Responsive de estas pantallas.

## Regla de trabajo
Trabajar en la rama `caleb`.
No hacer push directo a `main`.
