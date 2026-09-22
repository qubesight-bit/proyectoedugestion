# Rama de trabajo — Ernesto

Esta rama contiene el trabajo asignado a **Ernesto** para el proyecto React del Centro Educativo Adventista de Cartago.

## Responsabilidades principales

### 1. Autenticación y acceso
Archivos/módulos bajo responsabilidad:
- `src/features/auth/index.tsx`
- Integración de login con Supabase.
- Manejo de roles Administrador / Docente.
- Protección de acceso y sesión.

### 2. Dashboard administrativo
Archivos/módulos:
- `src/features/dashboard/index.tsx`
- Métricas institucionales.
- Acciones rápidas.
- Resumen administrativo.

### 3. Gestión de estudiantes
Archivos/módulos:
- `src/features/students/index.tsx`
- `src/services/api/students.service.ts`
- Registro, listado, búsqueda y edición de estudiantes.
- Conexión de estos datos con Supabase.

### 4. Gestión de cursos
Archivos/módulos:
- `src/features/courses/index.tsx`
- `src/services/api/courses.service.ts`
- Crear, editar, listar y filtrar cursos.
- Persistencia de datos.

### 5. Supervisión administrativa
Archivos/módulos:
- `src/features/admin/index.tsx`
- Supervisión de actividad docente.
- Documentos y registros visibles al administrador.

### 6. Datos e integración
Responsable principal de:
- `src/integrations/supabase/**`
- `supabase/**`
- Integración final de datos reales.
- Reemplazar mocks administrativos por consultas reales cuando corresponda.

## Trabajo ya existente asignado a Ernesto

Del código que ya estaba en `main`, se consideran parte de esta rama:
- Login React.
- Dashboard administrativo.
- Cursos.
- Estudiantes.
- Supervisión.
- Servicios API existentes.
- Configuración e integración Supabase.

## Regla para evitar conflictos

`src/routes/app.tsx` es un archivo de integración. Evitar convertirlo nuevamente en un archivo monolítico. Las funcionalidades nuevas deben implementarse primero en sus módulos dentro de `src/features` y luego conectarse al router.

No modificar directamente módulos asignados a Caleb salvo que sea necesario para integrar un Pull Request previamente acordado.
