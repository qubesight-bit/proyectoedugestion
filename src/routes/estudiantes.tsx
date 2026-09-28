import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Music, Trophy, Microscope, Calendar, Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/estudiantes')({
  component: EstudiantesPage,
});

function EstudiantesPage() {
  return (
    <PublicLayout>
      <div className="bg-slate-900 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vida Estudiantil</h1>
          <p className="text-slate-300 max-w-2xl mx-auto px-4 text-lg">
            Más allá del aula: actividades, clubes y eventos que complementan la experiencia educativa en el CEAC.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        
        {/* Clubes */}
        <section className="max-w-6xl mx-auto mb-20" id="clubes">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Clubes y Talleres Extracurriculares</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Fomentamos el descubrimiento de talentos a través de clubes extracurriculares diseñados para diversas áreas de interés.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Club Deportivo</h3>
                <p className="text-sm text-slate-600">Fútbol, voleibol y desarrollo psicomotor. Fomentando el trabajo en equipo y la vida saludable.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Club de Música</h3>
                <p className="text-sm text-slate-600">Coro estudiantil, campanas y ensamble instrumental para desarrollar el talento artístico.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Microscope className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Club de Ciencias</h3>
                <p className="text-sm text-slate-600">Experimentos prácticos, robótica básica y cuidado del medio ambiente.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Club de Conquistadores</h3>
                <p className="text-sm text-slate-600">Programa especial adventista enfocado en destrezas al aire libre, liderazgo y servicio.</p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">* La oferta de clubes puede variar según el semestre y el nivel del estudiante.</p>
        </section>

        {/* Actividades Destacadas */}
        <section className="max-w-5xl mx-auto bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100" id="actividades">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Actividades Destacadas del Año</h2>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <Calendar className="w-6 h-6 text-blue-600 mr-4 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Feria Científica y Tecnológica</h4>
                    <p className="text-slate-600 mt-1">Exposición anual donde los estudiantes presentan sus proyectos de innovación y robótica.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="w-6 h-6 text-amber-500 mr-4 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Actos Cívicos y Culturales</h4>
                    <p className="text-slate-600 mt-1">Celebración de efemérides patrias, mes de la Biblia y festivales de la familia.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Calendar className="w-6 h-6 text-blue-600 mr-4 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Giras Educativas (Excursiones)</h4>
                    <p className="text-slate-600 mt-1">Salidas de campo programadas para enriquecer el aprendizaje en museos y reservas naturales.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-slate-600 mb-4 font-medium">¿Quiere ver fotos y detalles de nuestros últimos eventos?</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                  <Link to="/blog" search={{}}>Visitar el Blog de Actividades</Link>
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 w-full h-full min-h-[300px]">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-blue-200 rounded-2xl h-48 overflow-hidden shadow-md">
                   {/* Placeholder visual */}
                   <img src="https://placehold.co/400x400/0ea5e9/ffffff/png?text=Feria+Ciencia&font=Montserrat" className="w-full h-full object-cover mix-blend-multiply opacity-80" alt="Feria" />
                </div>
                <div className="bg-amber-200 rounded-2xl h-64 mt-12 overflow-hidden shadow-md">
                   {/* Placeholder visual */}
                   <img src="https://placehold.co/400x600/f59e0b/ffffff/png?text=Excursión&font=Montserrat" className="w-full h-full object-cover mix-blend-multiply opacity-80" alt="Excursión" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
