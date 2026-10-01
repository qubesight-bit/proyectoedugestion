import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Target, Heart } from 'lucide-react';

export const Route = createFileRoute('/nosotros')({
  component: Nosotros,
});

function Nosotros() {
  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-slate-900 py-20 text-white text-center relative overflow-hidden">
        <img src="/tour/5.jpg" alt="Estudiantes CEAC" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl">Nosotros</h1>
          <p className="text-slate-100 max-w-2xl mx-auto px-4 text-lg drop-shadow-md font-medium">
            Conozca más sobre nuestra institución, nuestra historia y los valores que nos guían.
          </p>
        </div>
      </div>

      {/* Historia */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="lg:w-1/2">
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                Nuestra Historia
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Fundación e Inspiración</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Fundado en 1983, el Centro Educativo Adventista de Cartago (CEAC) nació con el propósito de ofrecer una educación diferente. Somos una institución misionera sin fines de lucro, orgullosamente parte de la red global de Educación Adventista.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Durante décadas, hemos servido a la comunidad de Cartago y sus alrededores, brindando una formación integral que abarca el cuerpo, la mente y el espíritu, fundamentada en valores cristianos, pero con los brazos abiertos a familias de todas las creencias.
              </p>
            </div>
            <div className="lg:w-1/2 w-full">
               <img src="/tour/6.jpg" alt="Entrada del CEAC" className="rounded-2xl shadow-2xl w-full h-96 object-cover transform hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Misión / Visión / Valores */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Misión (Blanca) */}
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Nuestra Misión</h3>
                <p className="text-slate-600">
                  Proveer una educación integral y redentora, que restaure la imagen de Dios en los estudiantes, promoviendo el desarrollo armonioso de lo físico, mental y espiritual, para servir a Dios y a la humanidad.
                </p>
              </CardContent>
            </Card>

            {/* Visión (Color Sólido) */}
            <Card className="border-0 shadow-xl bg-blue-700 text-white rounded-2xl overflow-hidden transform md:-translate-y-4">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
                <p className="text-blue-50">
                  Ser una institución educativa líder en Cartago, reconocida por su excelencia académica, su sólido fundamento en valores y su compromiso con la formación de ciudadanos íntegros preparados para el presente y la eternidad.
                </p>
              </CardContent>
            </Card>

            {/* Valores (Blanca) */}
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Nuestros Valores</h3>
                <p className="text-slate-600">
                  Amor, respeto, integridad, servicio, responsabilidad y excelencia. Creemos que la educación debe formar el carácter tanto como el intelecto.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Equipo Directivo */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Equipo Directivo</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-16">
            Conozca a las personas que lideran nuestra institución con dedicación y compromiso.
          </p>

          <div className="flex flex-col items-center max-w-sm mx-auto bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
            <div className="w-40 h-40 bg-blue-50 rounded-full mb-6 shadow-inner flex items-center justify-center overflow-hidden">
               {/* Placeholder until real photo is provided */}
               <span className="text-blue-200 text-sm font-medium">Foto Directora</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 text-center mb-1">MSc. Abigail Eunice Rojas Dézamo</h4>
            <p className="text-md text-blue-600 font-semibold uppercase tracking-wider">Directora</p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
