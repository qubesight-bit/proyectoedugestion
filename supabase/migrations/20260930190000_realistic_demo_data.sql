-- Datos de demostración idempotentes para pruebas funcionales del panel CEAC.
-- No crea cuentas en Auth ni contraseñas: solo registros académicos visibles en el dashboard.
BEGIN;

INSERT INTO public.teacher_profiles (full_name,email,phone,specialty,bio)
SELECT * FROM (VALUES
('Gabriela Alvarado','gabriela.alvarado@ceaccr.ed.cr','+506 8701-2101','Educación Preescolar','Docente de primera infancia con enfoque en aprendizaje por proyectos.'),
('Daniel Solano','daniel.solano@ceaccr.ed.cr','+506 8701-2102','Matemáticas','Docente de matemática para I y II ciclos.'),
('Laura Jiménez','laura.jimenez@ceaccr.ed.cr','+506 8701-2103','Español','Docente de Español y comprensión lectora.'),
('Andrés Chaves','andres.chaves@ceaccr.ed.cr','+506 8701-2104','Ciencias','Docente de Ciencias y coordinador de feria científica.'),
('Natalia Rojas','natalia.rojas@ceaccr.ed.cr','+506 8701-2105','Estudios Sociales','Docente de Estudios Sociales y Educación Cívica.'),
('Melissa Quesada','melissa.quesada@ceaccr.ed.cr','+506 8701-2106','Inglés','Docente de Inglés con énfasis comunicativo.'),
('José Pablo Brenes','jose.brenes@ceaccr.ed.cr','+506 8701-2107','Educación Física','Docente de Educación Física y recreación.'),
('Valeria Campos','valeria.campos@ceaccr.ed.cr','+506 8701-2108','Artes Plásticas','Docente de arte, creatividad y expresión visual.'),
('Esteban Mora','esteban.mora@ceaccr.ed.cr','+506 8701-2109','Música','Docente de Música y director del ensamble escolar.'),
('Paola Vargas','paola.vargas@ceaccr.ed.cr','+506 8701-2110','Educación Especial','Docente de apoyo y acompañamiento educativo.')
) AS v(full_name,email,phone,specialty,bio)
WHERE NOT EXISTS (
 SELECT 1 FROM public.teacher_profiles t WHERE lower(trim(t.full_name))=lower(trim(v.full_name))
);

INSERT INTO public.courses (title,category,level,tag,teacher,teacher_id,schedule,room,capacity,note)
SELECT v.title,v.category,v.level,v.tag,t.full_name,t.id,v.schedule,v.room,v.capacity,v.note
FROM (VALUES
('Lectoescritura Inicial','humanidades','Transición','Lenguaje','Gabriela Alvarado','Lunes a jueves · 8:00 a. m.','Preescolar 1',20,'Actividades de conciencia fonológica y lectura inicial.'),
('Matemáticas 1°','ciencias','1° Primaria','Pensamiento lógico','Daniel Solano','Lunes, miércoles y viernes · 9:00 a. m.','Aula 1',28,'Uso de material concreto para resolución de problemas.'),
('Español 2°','humanidades','2° Primaria','Comunicación','Laura Jiménez','Martes y jueves · 8:00 a. m.','Aula 2',28,'Lectura guiada y producción escrita.'),
('Ciencias 3°','ciencias','3° Primaria','Exploración','Andrés Chaves','Lunes y miércoles · 10:30 a. m.','Laboratorio',26,'Incluye prácticas sencillas de laboratorio.'),
('Estudios Sociales 4°','humanidades','4° Primaria','Ciudadanía','Natalia Rojas','Martes y viernes · 10:00 a. m.','Aula 4',30,'Historia y geografía de Costa Rica.'),
('Inglés 5°','idiomas','5° Primaria','English','Melissa Quesada','Lunes y jueves · 11:00 a. m.','Aula 5',30,'Desarrollo de conversación y vocabulario.'),
('Matemáticas 6°','ciencias','6° Primaria','Razonamiento','Daniel Solano','Martes, miércoles y viernes · 8:00 a. m.','Aula 6',30,'Preparación académica para el siguiente ciclo.'),
('Educación Física','ciencias','1° a 6° Primaria','Movimiento','José Pablo Brenes','Viernes · 9:00 a. m.','Gimnasio',35,'Actividad física, coordinación y trabajo en equipo.'),
('Artes Plásticas','artes','1° a 6° Primaria','Creatividad','Valeria Campos','Miércoles · 1:00 p. m.','Taller de Arte',25,'Técnicas de dibujo, pintura y expresión creativa.'),
('Música y Coro','artes','1° a 6° Primaria','Expresión musical','Esteban Mora','Jueves · 1:00 p. m.','Salón de Música',30,'Formación musical y participación en actos escolares.')
) AS v(title,category,level,tag,teacher_name,schedule,room,capacity,note)
JOIN public.teacher_profiles t ON lower(t.full_name)=lower(v.teacher_name)
WHERE NOT EXISTS (
 SELECT 1 FROM public.courses c WHERE c.title=v.title AND c.level=v.level
);

INSERT INTO public.students (code,name,grade,status,tutor,phone,email,alert)
SELECT * FROM (VALUES
('EST-DEMO-101','Mariana Hernández Araya','Transición','Activo','Andrea Araya','+506 8812-3401','andrea.araya@example.com',''),
('EST-DEMO-102','Santiago López Mora','1° Primaria','Activo','Roberto López','+506 8812-3402','roberto.lopez@example.com','Alergia alimentaria registrada.'),
('EST-DEMO-103','Isabella Rodríguez Vega','2° Primaria','Activo','Carolina Vega','+506 8812-3403','carolina.vega@example.com',''),
('EST-DEMO-104','Mateo Sánchez Rojas','3° Primaria','Doc. Pendiente','Luis Sánchez','+506 8812-3404','luis.sanchez@example.com','Pendiente copia del carné de vacunas.'),
('EST-DEMO-105','Emma Castro Jiménez','4° Primaria','Activo','Mónica Jiménez','+506 8812-3405','monica.jimenez@example.com',''),
('EST-DEMO-106','Sebastián Vargas Quesada','5° Primaria','Activo','Patricia Quesada','+506 8812-3406','patricia.quesada@example.com',''),
('EST-DEMO-107','Valentina Ramírez Solano','6° Primaria','En Observación','Marco Ramírez','+506 8812-3407','marco.ramirez@example.com','Requiere seguimiento de asistencia.'),
('EST-DEMO-108','Samuel Chaves Brenes','4° Primaria','Activo','Daniela Brenes','+506 8812-3408','daniela.brenes@example.com',''),
('EST-DEMO-109','Luciana Morales Campos','5° Primaria','Activo','Alejandra Campos','+506 8812-3409','alejandra.campos@example.com',''),
('EST-DEMO-110','Gabriel Fernández Ruiz','6° Primaria','Activo','Carlos Fernández','+506 8812-3410','carlos.fernandez@example.com','')
) AS v(code,name,grade,status,tutor,phone,email,alert)
WHERE NOT EXISTS (SELECT 1 FROM public.students s WHERE s.code=v.code);

INSERT INTO public.announcements (title,content,author_name,source)
SELECT * FROM (VALUES
('Reunión general de familias','La reunión trimestral será el jueves a las 5:30 p. m. en el salón multiuso.','Dirección','app'),
('Feria científica institucional','La exposición de proyectos se realizará el 23 de octubre. Cada grupo recibirá su horario.','Coordinación Académica','app'),
('Entrega de informes académicos','Los informes del período estarán disponibles el viernes en horario de 1:00 p. m. a 4:00 p. m.','Secretaría','app'),
('Campaña de recolección solidaria','Durante esta semana recibiremos alimentos no perecederos para apoyar a familias de la comunidad.','Pastoral Educativa','app'),
('Ensayo del coro escolar','El ensayo general será el miércoles a la 1:30 p. m. en el salón de música.','Departamento de Música','app'),
('Jornada deportiva','La jornada deportiva de primaria será el próximo viernes. Los estudiantes deben llevar hidratación.','Educación Física','app'),
('Actualización de datos','Solicitamos revisar teléfonos y correos de contacto en el expediente de cada estudiante.','Administración','app'),
('Taller para familias','Se ofrecerá un taller sobre hábitos de estudio el martes a las 6:00 p. m.','Orientación','app'),
('Día de la niñez','Celebraremos con actividades recreativas y una merienda compartida durante la jornada regular.','Vida Estudiantil','app'),
('Simulacro institucional','El lunes realizaremos un simulacro de evacuación siguiendo el protocolo de seguridad.','Comité de Emergencias','app')
) AS v(title,content,author_name,source)
WHERE NOT EXISTS (SELECT 1 FROM public.announcements a WHERE a.title=v.title);

INSERT INTO public.admission_requests
(student_name,student_document,birth_date,desired_level,guardian_name,guardian_document,guardian_email,guardian_phone,entry_type,status,admin_note)
SELECT * FROM (VALUES
('Amanda Salazar Cruz','TIM-2020-4101','2020-03-14'::date,'Transición','Karla Cruz Méndez','1-1456-0789','karla.cruz@example.com','8700-4101','nuevo','pendiente',''),
('Thiago Acuña Vargas','TIM-2019-4102','2019-07-22'::date,'1° Primaria','Mauricio Acuña','1-1320-0544','mauricio.acuna@example.com','8700-4102','nuevo','en_revision','Documentación inicial recibida.'),
('Antonella Méndez Rojas','TIM-2018-4103','2018-11-05'::date,'2° Primaria','Silvia Rojas','1-1567-0312','silvia.rojas@example.com','8700-4103','nuevo','contactado','Entrevista programada.'),
('Emiliano Cordero León','TIM-2017-4104','2017-02-18'::date,'3° Primaria','José Cordero','3-0445-0890','jose.cordero@example.com','8700-4104','regular','pendiente',''),
('Renata Villalobos Soto','TIM-2016-4105','2016-09-30'::date,'4° Primaria','María Soto','1-1678-0443','maria.soto@example.com','8700-4105','nuevo','en_revision','Pendiente entrevista familiar.'),
('Joaquín Araya Monge','TIM-2015-4106','2015-05-12'::date,'5° Primaria','Sofía Monge','1-1401-0678','sofia.monge@example.com','8700-4106','reingreso','contactado','Familia contactada por teléfono.'),
('Victoria Zúñiga Mora','TIM-2014-4107','2014-08-21'::date,'6° Primaria','Esteban Zúñiga','1-1255-0981','esteban.zuniga@example.com','8700-4107','nuevo','pendiente',''),
('Nicolás Fallas Arias','TIM-2019-4108','2019-01-09'::date,'1° Primaria','Gabriela Arias','1-1588-0246','gabriela.arias@example.com','8700-4108','nuevo','cerrado','Cupo confirmado para el ciclo lectivo.'),
('Julieta Navarro Pérez','TIM-2018-4109','2018-06-27'::date,'2° Primaria','Adriana Pérez','1-1722-0521','adriana.perez@example.com','8700-4109','regular','en_revision','Expediente en revisión.'),
('Felipe Ureña Calderón','TIM-2017-4110','2017-12-03'::date,'3° Primaria','Ricardo Ureña','1-1366-0710','ricardo.urena@example.com','8700-4110','nuevo','pendiente','')
) AS v(student_name,student_document,birth_date,desired_level,guardian_name,guardian_document,guardian_email,guardian_phone,entry_type,status,admin_note)
WHERE NOT EXISTS (
 SELECT 1 FROM public.admission_requests a WHERE a.student_document=v.student_document
);

-- Cada estudiante queda asignado a su curso de nivel y a un curso complementario.
INSERT INTO public.course_students (course_id,student_id)
SELECT c.id,s.id
FROM public.students s
JOIN public.courses c ON
 (s.code='EST-DEMO-101' AND c.title='Lectoescritura Inicial') OR
 (s.code='EST-DEMO-102' AND c.title='Matemáticas 1°') OR
 (s.code='EST-DEMO-103' AND c.title='Español 2°') OR
 (s.code='EST-DEMO-104' AND c.title='Ciencias 3°') OR
 (s.code IN ('EST-DEMO-105','EST-DEMO-108') AND c.title='Estudios Sociales 4°') OR
 (s.code IN ('EST-DEMO-106','EST-DEMO-109') AND c.title='Inglés 5°') OR
 (s.code IN ('EST-DEMO-107','EST-DEMO-110') AND c.title='Matemáticas 6°')
ON CONFLICT DO NOTHING;

INSERT INTO public.course_students (course_id,student_id)
SELECT c.id,s.id
FROM public.students s
CROSS JOIN public.courses c
WHERE s.code BETWEEN 'EST-DEMO-101' AND 'EST-DEMO-110'
 AND c.title = CASE
   WHEN right(s.code,1) IN ('1','3','5','7','9') THEN 'Artes Plásticas'
   ELSE 'Música y Coro'
 END
ON CONFLICT DO NOTHING;

INSERT INTO public.student_grades (student_id,course_id,period,grade,notes)
SELECT s.id,c.id,'I período',v.grade,v.notes
FROM (VALUES
('EST-DEMO-101','Lectoescritura Inicial',9.2::numeric,'Excelente avance en reconocimiento de sonidos.'),
('EST-DEMO-102','Matemáticas 1°',8.7::numeric,'Resuelve operaciones básicas con seguridad.'),
('EST-DEMO-103','Español 2°',9.4::numeric,'Muy buena comprensión lectora.'),
('EST-DEMO-104','Ciencias 3°',7.8::numeric,'Debe reforzar el registro de observaciones.'),
('EST-DEMO-105','Estudios Sociales 4°',8.9::numeric,'Participación constante en clase.'),
('EST-DEMO-106','Inglés 5°',9.1::numeric,'Buen desempeño oral y escrito.'),
('EST-DEMO-107','Matemáticas 6°',7.6::numeric,'Requiere práctica adicional con fracciones.'),
('EST-DEMO-108','Estudios Sociales 4°',8.5::numeric,'Buen dominio de contenidos nacionales.'),
('EST-DEMO-109','Inglés 5°',9.6::numeric,'Excelente pronunciación y vocabulario.'),
('EST-DEMO-110','Matemáticas 6°',8.3::numeric,'Progreso sostenido durante el período.')
) AS v(student_code,course_title,grade,notes)
JOIN public.students s ON s.code=v.student_code
JOIN public.courses c ON c.title=v.course_title
ON CONFLICT (student_id,course_id,period)
DO UPDATE SET grade=EXCLUDED.grade,notes=EXCLUDED.notes;

COMMIT;
