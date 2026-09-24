CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','docente'))
$$;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;

CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'ciencias',
  level text NOT NULL DEFAULT '1° de Secundaria',
  tag text NOT NULL DEFAULT '',
  teacher text NOT NULL DEFAULT '',
  schedule text NOT NULL DEFAULT '',
  room text NOT NULL DEFAULT '',
  capacity integer NOT NULL DEFAULT 30,
  enrolled integer NOT NULL DEFAULT 0,
  note text NOT NULL DEFAULT '',
  face text NOT NULL DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view courses" ON public.courses FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins insert courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update courses" ON public.courses FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete courses" ON public.courses FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL DEFAULT ('EST-' || to_char(now(),'YYYY') || '-' || lpad((floor(random()*900)+100)::text,3,'0')),
  name text NOT NULL,
  grade text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Activo',
  score numeric(4,1),
  tutor text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  alert text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view students" ON public.students FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins insert students" ON public.students FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update students" ON public.students FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete students" ON public.students FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  author_name text NOT NULL DEFAULT 'Dirección',
  source text NOT NULL DEFAULT 'app',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view announcements" ON public.announcements FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins insert announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update announcements" ON public.announcements FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete announcements" ON public.announcements FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.courses (title, category, level, tag, teacher, schedule, room, capacity, enrolled, note, face) VALUES
('Matemáticas Avanzadas y Cálculo','ciencias','3° de Secundaria','Ciencias Exactas','Prof. Carlos Menéndez','Lun y Mié • 08:00 - 09:30 hrs','Aula Magna 204 • Pabellón B',30,28,'¡Últimos 2 cupos disponibles antes de lista de espera!','https://lh3.googleusercontent.com/aida-public/AB6AXuAZrVRSRKciy9svwx4BfCusB5TJcLAgrVtx306N9zoz_eo0TEekE-wls7jpIowFKu-pRSEaEP17JYBpYQHeC4xXXotFvywPAzP_A2PHJUhOTuZqQU6wm8rZ_4x6bZaWP5d8dmLbLaMSza7rvOZJlUc4IJ48nLdkBVbw6WKae22PAcODFidKUC1-SiE5-dYoS5OhexG60NpXfntPbxqQf76obc0Yq8YPQL1zctzP5u4SihJqkmPhwuM7Qw'),
('Lengua Española y Literatura','humanidades','2° de Secundaria','Humanidades','Prof. Patricia Valenzuela','Mar y Jue • 10:00 - 11:30 hrs','Salón 108 • Edificio Central',30,22,'8 cupos regulares disponibles','https://lh3.googleusercontent.com/aida-public/AB6AXuD9cDdKgjVFhTkWyjyQ2ChcPqtAtsGBZRpUpz5Us1Zg9PmKr6QXGAKbxBJIOqEveCVVyzuT3Yah1NtqKCmZt3YzDmzu6RI8Tmt5xysBJNzx4YiJ6EnK1WIp3moaELMQDiYyUn1gONCM6WnYecVtTFuZvNHJNeyKqVfzeKjOSlCnMTeGB01gX2h8KMoiWkX99zmlwo1dpuqShwvigQD4J8If6pRV9uQJMEMHwYo7_Oqk4srAEWTpRnLPzw'),
('Biología Celular y Laboratorio','ciencias','4° de Secundaria','Laboratorio Práctico','Dr. Roberto Salgado','Viernes • 08:30 - 12:00 hrs','Laboratorio de Bioquímica 3',20,15,'Cupo máximo limitado por protocolos de bioseguridad','https://lh3.googleusercontent.com/aida-public/AB6AXuD0CX2QR1KQzWVBULqzW8F9MpV0PD3bbrTQgfD5u4HRy8dx744ZD6PWryZCbB_1WKWpvLLcXJRUA0IZdd_dtAxFF1sP4-IurHrcBgOKiJ8UtQo7rNglJe7nCNT94SvP7snIGStTgJOjnBR1b6QvaFA3DWt4oGvf03911f56_3g5ncIvQ0SsRaE-4IgCUIoqbGRnMzCELc_MEiO_Y_NOYJs89FPEZqI7v6f4g51PF-i8SHZEZZq83Ds5SQ');

INSERT INTO public.students (code, name, grade, status, score, tutor, alert, image) VALUES
('EST-2024-089','Camilo Andrés Morales','4° Primaria ''A''','Activo',9.2,'M. Morales','','https://lh3.googleusercontent.com/aida-public/AB6AXuAsPemPGMLES2DZjlzwpWVMjpQzFDpi8eN9Nf-Tb4TYjPOqEQkhZa7jKHUxb9K-OTQSeYfpbyLylT_OnfCF_6zVfMsVI2oP-1iTahMCZ-vMg8HcciPCEkjm3efrmqAAnEMVZWTCp24oHJ4t32Jqwqv7iErCEYSx8egT_lxrlXaktYOpg2QgB79i_SXRBd8q77MU6ALKMEI18YRBR7UvKme7i55UQhLmx2580fKkKetshLeUeXdwWq9EsA'),
('EST-2024-112','Valentina Sofía Ríos','2° Secundaria ''B''','Activo',8.4,'E. Ríos G.','','https://lh3.googleusercontent.com/aida-public/AB6AXuAc12AYzHjzUA3rgnlq0mhaSaCX6uhp81jBR8wGaQsdTqWeW34fbVv1oNlA2I-8x80qSzC5Fk-MTGXcDJxuc3b2cYGSToIuSspE8BYtORxneZnmR-EQoJTI95gMtNyd5ppxf-kc2ykXKihOM20GRfMEaVMjLeP2GClpK-_sp2Gfy7IhFWSqhRDle4eXexihy2963OtzczxsUqjp5U2htZkbJz1-Ynd1Pbx65dmKk5O6xy5uRv7ueU22mw'),
('EST-2024-045','Matías Herrera Vera','1° Secundaria ''C''','Doc. Pendiente',7.9,'','Falta Certificado Médico','https://lh3.googleusercontent.com/aida-public/AB6AXuB-y9nlIkFaqE6S34ovdXLj-IjOcSEwClIIHeKi56vktCy0vyyIOFYRV8T8nUgg23sQHiUsb9JCvsjcWDsmvReluDaOpOYRf2SA6KIcq-PBTlJ3DuA6QT2yXYgm5wE_Qg_C23Q80DtijfcMI5lw70loE5cNnnMuBexTj0tT6j9CBR8AjzrtqUeg7DSE4NFPToiRXJHjso3Sb_5cPzMvuoQcR2NbEc7Mp_4Pk2fKc0yCrXz21axY2mt-hg');

INSERT INTO public.announcements (title, content, author_name) VALUES
('Reunión de padres de familia','Viernes 18:00 en el auditorio principal. Asistencia obligatoria.','Dirección'),
('Semana de ciencias','Inscripciones abiertas para la feria científica anual.','Coordinación Académica');