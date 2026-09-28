import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Lightbulb, Puzzle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/oferta')({
  component: OfertaPage,
});

function OfertaPage() {
  return (
    <PublicLayout>
      <div className="bg-slate-900 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-blue-600/20 blur-3xl opacity-60 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Oferta Educativa</h1>
          <p className="text-slate-300 max-w-2xl mx-auto px-4 text-lg">
            Descubra nuestro modelo educativo integral diseñado para el éxito académico, físico y espiritual.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        
        {/* Modelo Educativo */}
        <section className="max-w-5xl mx-auto mb-20" id="modelo">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Modelo Educativo Adventista</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
            <div className="md:w-1/2 bg-blue-50 p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Educación Integral</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Nuestro enfoque va más allá del éxito académico. Buscamos el desarrollo armonioso de las facultades físicas, mentales y espirituales.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Preparamos al estudiante para el gozo de servir en este mundo y para un gozo superior proporcionado por un servicio más amplio en el mundo venidero.
              </p>
            </div>
            <div className="md:w-1/2 p-10">
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mr-4 mt-1">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Excelencia Académica</h4>
                    <p className="text-sm text-slate-600 mt-1">Metodologías innovadoras y currículo alineado a los estándares del MEP, enriquecido con valores cristianos.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mr-4 mt-1">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Desarrollo del Carácter</h4>
                    <p className="text-sm text-slate-600 mt-1">Formación en disciplina positiva, liderazgo y empatía, fomentando relaciones interpersonales saludables.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Niveles */}
        <section className="max-w-5xl mx-auto mb-20" id="niveles">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestros Niveles</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              El CEAC ofrece formación especializada y dedicada para los primeros años de vida y la educación básica.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-black text-blue-900 mb-4">Preescolar</h3>
                <p className="text-slate-600 mb-6 min-h-[80px]">
                  Desde la etapa maternal hasta preparatoria (Transición). Enfocado en estimulación temprana, socialización y aprendizaje lúdico.
                </p>
                <Button asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50 rounded-full">
                  <Link to="/niveles" search={{ nivel: 'preescolar' }}>Ver detalles de Preescolar</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-black text-blue-900 mb-4">Primaria</h3>
                <p className="text-slate-600 mb-6 min-h-[80px]">
                  I y II Ciclo de la Educación General Básica. Consolidación de conocimientos, pensamiento crítico e independencia.
                </p>
                <Button asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50 rounded-full">
                  <Link to="/niveles" search={{ nivel: 'primaria' }}>Ver detalles de Primaria</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Programas Especiales y Apoyos */}
        <section className="max-w-5xl mx-auto" id="apoyos">
          <div className="grid md:grid-cols-2 gap-8">
            
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="flex items-center text-slate-900">
                  <Lightbulb className="w-6 h-6 mr-3 text-amber-500" />
                  Programas Especiales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li>
                    <h4 className="font-bold text-slate-800">Inglés Intensivo</h4>
                    <p className="text-sm text-slate-600 mt-1">Programa reforzado para desarrollar habilidades bilingües desde edades tempranas.</p>
                  </li>
                  <li>
                    <h4 className="font-bold text-slate-800">Tecnología y Robótica</h4>
                    <p className="text-sm text-slate-600 mt-1">Introducción a la tecnología educativa y robótica básica para fomentar el pensamiento lógico.</p>
                  </li>
                  <li>
                    <h4 className="font-bold text-slate-800">Música y Arte</h4>
                    <p className="text-sm text-slate-600 mt-1">Desarrollo de la creatividad y talentos artísticos como parte fundamental del currículo.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="flex items-center text-slate-900">
                  <Puzzle className="w-6 h-6 mr-3 text-green-500" />
                  Apoyos Educativos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600 mb-4">
                  Creemos en una educación inclusiva y atenta a las necesidades individuales de cada estudiante.
                </p>
                <ul className="space-y-4">
                  <li>
                    <h4 className="font-bold text-slate-800">Tutorías de Refuerzo</h4>
                    <p className="text-sm text-slate-600 mt-1">Sesiones adicionales para estudiantes que requieran apoyo en áreas específicas.</p>
                  </li>
                  <li>
                    <h4 className="font-bold text-slate-800">Atención Psicoeducativa</h4>
                    <p className="text-sm text-slate-600 mt-1">Acompañamiento psicológico y pedagógico para optimizar el rendimiento y bienestar emocional.</p>
                  </li>
                  <li>
                    <h4 className="font-bold text-slate-800">Adecuaciones Curriculares</h4>
                    <p className="text-sm text-slate-600 mt-1">Implementación de adecuaciones no significativas aprobadas según las necesidades del alumno.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
