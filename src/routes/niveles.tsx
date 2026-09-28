import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Clock, BookOpen, Trees, Download } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/niveles')({
  component: Niveles,
  validateSearch: (search: Record<string, unknown>): { nivel?: 'primaria' | 'preescolar' } => {
    return {
      nivel: search['nivel'] === 'primaria' ? 'primaria' : 'preescolar',
    };
  },
});

function Niveles() {
  const { nivel } = Route.useSearch();
  const navigate = useNavigate({ from: '/niveles' });
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const setNivel = (n: 'preescolar' | 'primaria') => {
    navigate({ search: { nivel: n } });
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate download
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const isPreescolar = nivel === 'preescolar';

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-blue-900 py-12 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Niveles Académicos</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">
          Conozca nuestra oferta educativa y los requisitos para formar parte de la familia CEAC.
        </p>
      </div>

      {/* Tabs / Toggle */}
      <div className="bg-white border-b border-slate-200 sticky top-[72px] z-40">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="flex space-x-8">
            <button
              onClick={() => setNivel('preescolar')}
              className={`py-4 px-2 font-semibold text-lg border-b-4 transition-colors flex items-center ${
                isPreescolar ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-blue-600'
              }`}
            >
              <Trees className="w-5 h-5 mr-2" />
              Preescolar
            </button>
            <button
              onClick={() => setNivel('primaria')}
              className={`py-4 px-2 font-semibold text-lg border-b-4 transition-colors flex items-center ${
                !isPreescolar ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-blue-600'
              }`}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Primaria
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            
            {/* Main Details (Left Col) */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Intro Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <h2 className={`text-3xl font-bold mb-4 ${isPreescolar ? 'text-blue-700' : 'text-blue-700'}`}>
                    {isPreescolar ? 'Educación Preescolar' : 'Educación Primaria'}
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    {isPreescolar 
                      ? 'Nuestro programa de preescolar está diseñado para estimular el desarrollo integral de los niños en un ambiente seguro, lleno de amor y valores cristianos. A través del juego guiado y actividades estructuradas, preparamos a los pequeños para su éxito futuro.'
                      : 'La educación primaria (I y II Ciclos) en CEAC fomenta el pensamiento crítico, la excelencia académica y el desarrollo del carácter. Nuestro currículo cumple con los estándares del MEP, enriquecido con educación en valores y principios cristianos.'}
                  </p>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Niveles Ofrecidos</h3>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {isPreescolar ? (
                      <>
                        <Badge>Maternal</Badge>
                        <Badge>Interactivo I</Badge>
                        <Badge>Interactivo II</Badge>
                        <Badge>Transición (Preparatoria)</Badge>
                      </>
                    ) : (
                      <>
                        <Badge color="blue">Primer Grado</Badge>
                        <Badge color="blue">Segundo Grado</Badge>
                        <Badge color="blue">Tercer Grado</Badge>
                        <Badge color="blue">Cuarto Grado</Badge>
                        <Badge color="blue">Quinto Grado</Badge>
                        <Badge color="blue">Sexto Grado</Badge>
                      </>
                    )}
                  </div>

                  <div className="flex items-center text-slate-700 bg-slate-100 p-4 rounded-lg">
                    <Clock className={`w-6 h-6 mr-3 ${isPreescolar ? 'text-blue-600' : 'text-blue-600'}`} />
                    <div>
                      <span className="block font-bold">Horario de clases:</span>
                      <span>// TODO: Insertar horario real del CEAC para {isPreescolar ? 'Preescolar' : 'Primaria'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Requisitos de Admisión</h3>
                  <ul className="space-y-4">
                    <ChecklistItem text="Copia del acta de nacimiento" />
                    <ChecklistItem text="Constancia de vacunas al día" />
                    <ChecklistItem text="2 fotografías tamaño pasaporte" />
                    <ChecklistItem text="Copia de cédula de los padres o encargados" />
                    {isPreescolar ? (
                      <ChecklistItem text="Edad requerida cumplida al 15 de febrero según nivel MEP" />
                    ) : (
                      <>
                        <ChecklistItem text="Certificado de conclusión de Preescolar (para Primer Grado)" />
                        <ChecklistItem text="Notas o informe al hogar del año anterior (para traslados)" />
                        <ChecklistItem text="Carta de buena conducta de la institución anterior" />
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar / Brochure Download (Right Col) */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl bg-white sticky top-40">
                <div className={`h-2 w-full ${isPreescolar ? 'bg-blue-600' : 'bg-blue-600'}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-4">
                    <Download className={`w-6 h-6 ${isPreescolar ? 'text-blue-600' : 'text-blue-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Descargar Brochure</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Complete el formulario para descargar la información completa de {isPreescolar ? 'Preescolar' : 'Primaria'}.
                  </p>

                  <form onSubmit={handleDownload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input id="nombre" required placeholder="Ej. Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correo">Correo Electrónico</Label>
                      <Input id="correo" type="email" required placeholder="juan@ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" type="tel" required placeholder="8888-8888" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provincia">Provincia</Label>
                        <Select required>
                          <SelectTrigger id="provincia">
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cartago">Cartago</SelectItem>
                            <SelectItem value="sanjose">San José</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="canton">Cantón</Label>
                        <Input id="canton" required placeholder="Ej. Paraíso" />
                      </div>
                    </div>

                    <Button type="submit" className={`w-full mt-4 text-white ${isPreescolar ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {downloadSuccess ? '¡Descargando!' : 'Descargar PDF'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Badge({ children, color = 'blue' }: { children: React.ReactNode, color?: 'blue' | 'blue' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <CheckCircle2 className="w-6 h-6 text-blue-500 mr-3 shrink-0" />
      <span className="text-slate-700 leading-tight pt-0.5">{text}</span>
    </li>
  );
}
