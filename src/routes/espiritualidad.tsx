import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Heart, Calendar } from 'lucide-react';

export const Route = createFileRoute('/espiritualidad')({
  component: EspiritualidadPage,
});

function EspiritualidadPage() {
  return (
    <PublicLayout>
      <div className="bg-slate-900 py-16 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Espiritualidad</h1>
        <p className="text-slate-300 max-w-2xl mx-auto px-4 text-lg">
          Formamos el carácter de nuestros estudiantes bajo los principios y valores de la Educación Adventista.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16 max-w-5xl mx-auto">
          
          {/* Declaración de fe */}
          <div className="flex flex-col md:flex-row gap-8 items-center" id="creencias">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shadow-inner">
                <Book className="w-16 h-16" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Declaración de Fe</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                El Centro Educativo Adventista de Cartago basa sus enseñanzas en la Biblia, considerándola como la única regla de fe y práctica. Compartimos las 28 creencias fundamentales de la Iglesia Adventista del Séptimo Día.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Creemos en un Dios creador, en la salvación por gracia mediante Jesucristo, y en el desarrollo integral del ser humano (cuerpo, mente y espíritu) como el propósito supremo de la educación. Respetamos la libertad religiosa y damos la bienvenida a familias de cualquier denominación que respeten nuestro ideario.
              </p>
            </div>
          </div>

          {/* Capellanía */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center" id="capellania">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                <Heart className="w-16 h-16" />
              </div>
            </div>
            <div className="md:w-2/3 md:text-right">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Capellanía y Devocionales</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Nuestro departamento de capellanía brinda apoyo espiritual y emocional tanto a estudiantes como a sus familias. Es un espacio seguro de consejería, oración y orientación en tiempos de necesidad.
              </p>
              <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg p-4 text-left">
                <h4 className="font-bold text-slate-900 mb-2">Actividades Semanales:</h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Devocionales matutinos diarios en cada aula.</li>
                  <li>Capilla general una vez por semana.</li>
                  <li>Consejería estudiantil personalizada.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Semana Espiritual */}
          <div className="flex flex-col md:flex-row gap-8 items-center" id="devocionales">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shadow-inner">
                <Calendar className="w-16 h-16" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Semana de Énfasis Espiritual</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Dos veces al año (generalmente en abril y septiembre), celebramos nuestra "Semana de Oración" o Semana de Énfasis Espiritual. Durante estos días, suspendemos la rutina académica normal para tener programas especiales con música, dramas e invitados especiales que comparten mensajes inspiradores diseñados específicamente para las edades de nuestros alumnos de preescolar y primaria.
              </p>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
