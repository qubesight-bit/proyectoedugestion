import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Flag, PartyPopper, Info, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Route = createFileRoute('/anuncios')({
  component: Anuncios,
});

// Mock data (en producción, esto vendría de Firestore)
type TipoAnuncio = 'feriado' | 'acto civico' | 'actividad' | 'general';
interface Anuncio {
  id: string;
  titulo: string;
  tipo: TipoAnuncio;
  fecha: Date;
  descripcion: string;
  imagenUrl?: string;
}

const mockAnuncios: Anuncio[] = [
  {
    id: '1',
    titulo: 'Feriado: Día del Trabajador',
    tipo: 'feriado',
    fecha: new Date(2026, 4, 1),
    descripcion: 'Recordamos a los padres de familia que este día no habrá lecciones por motivo del feriado nacional del Día del Trabajador.',
  },
  {
    id: '2',
    titulo: 'Acto Cívico: Anexión de Nicoya',
    tipo: 'acto civico',
    fecha: new Date(2026, 6, 24),
    descripcion: 'Invitamos a los estudiantes a venir con traje típico para conmemorar la Anexión del Partido de Nicoya. El acto iniciará a las 7:30 a.m. en el Salón de Actos.',
  },
  {
    id: '3',
    titulo: 'Feria Científica Institucional',
    tipo: 'actividad',
    fecha: new Date(2026, 7, 15),
    descripcion: 'Estaremos celebrando nuestra feria científica anual. Los padres de familia están invitados a ver los proyectos a partir de las 9:00 a.m.',
  },
  {
    id: '4',
    titulo: 'Inicio de matrícula adelantada',
    tipo: 'general',
    fecha: new Date(2026, 8, 1),
    descripcion: 'Se abre el proceso de matrícula adelantada para el próximo curso lectivo. Puede realizar el proceso desde nuestra sección de Admisión.',
  },
];

function getTipoIcon(tipo: TipoAnuncio) {
  switch (tipo) {
    case 'feriado': return <Calendar className="w-5 h-5" />;
    case 'acto civico': return <Flag className="w-5 h-5" />;
    case 'actividad': return <PartyPopper className="w-5 h-5" />;
    case 'general': default: return <Info className="w-5 h-5" />;
  }
}

function getTipoColor(tipo: TipoAnuncio) {
  switch (tipo) {
    case 'feriado': return 'bg-red-100 text-red-700 border-red-200';
    case 'acto civico': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'actividad': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'general': default: return 'bg-blue-100 text-blue-700 border-blue-200';
  }
}

function Anuncios() {
  const sortedAnuncios = [...mockAnuncios].sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-blue-900 py-12 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Anuncios</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">
          Manténgase informado sobre nuestras actividades, actos cívicos y feriados institucionales.
        </p>
      </div>

      {/* Content */}
      <section className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex items-center gap-3 mb-10 text-slate-800">
              <CalendarDays className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold">Calendario de Actividades</h2>
            </div>

            <div className="space-y-6">
              {sortedAnuncios.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No hay anuncios publicados en este momento.
                </div>
              ) : (
                sortedAnuncios.map((anuncio) => (
                  <Card key={anuncio.id} className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="flex flex-col md:flex-row">
                      {/* Date Section (Left) */}
                      <div className="bg-slate-100 md:w-48 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 group-hover:bg-blue-50 transition-colors">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                          {format(anuncio.fecha, 'MMMM', { locale: es })}
                        </span>
                        <span className="text-4xl font-black text-blue-700">
                          {format(anuncio.fecha, 'dd')}
                        </span>
                        <span className="text-sm font-medium text-slate-500 mt-1">
                          {format(anuncio.fecha, 'EEEE', { locale: es })}
                        </span>
                      </div>
                      
                      {/* Content Section (Right) */}
                      <CardContent className="p-6 md:p-8 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wider ${getTipoColor(anuncio.tipo)}`}>
                            {getTipoIcon(anuncio.tipo)}
                            {anuncio.tipo}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{anuncio.titulo}</h3>
                        <p className="text-slate-600 leading-relaxed">
                          {anuncio.descripcion}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                ))
              )}
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
