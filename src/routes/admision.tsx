import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, User, Users, FileText, Send, Phone, MessageCircle, Calendar, DollarSign, UploadCloud, Info } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { admissionFromForm } from '@/lib/admissions';

export const Route = createFileRoute('/admision')({
  component: Admision,
});

function Admision() {
  const [tipoIngreso, setTipoIngreso] = useState<'nuevo' | 'regular' | 'reingreso'>('nuevo');
  const [nivelIngreso, setNivelIngreso] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!nivelIngreso) {
      setSubmitError("Seleccioná el nivel al que ingresará el estudiante.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("est_nivel", nivelIngreso);
      const values = admissionFromForm(formData, tipoIngreso);
      const { error } = await supabase.rpc("submit_admission_request", {
        p_student_name: values.student_name,
        p_student_document: values.student_document,
        p_birth_date: values.birth_date,
        p_desired_level: values.desired_level,
        p_guardian_name: values.guardian_name,
        p_guardian_document: values.guardian_document,
        p_guardian_email: values.guardian_email,
        p_guardian_phone: values.guardian_phone,
        p_entry_type: values.entry_type ?? "nuevo",
      });
      if (error) throw error;
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error al guardar solicitud", error);
      setSubmitError("No pudimos enviar la solicitud. Verificá los campos o intentá nuevamente en unos minutos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <PublicLayout>
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-20 px-4">
          <Card className="max-w-2xl w-full border-0 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-blue-600 p-10 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">¡Solicitud Enviada con Éxito!</h2>
              <p className="text-blue-100 text-lg">Hemos recibido su solicitud de ingreso.</p>
            </div>
            <CardContent className="p-10 space-y-6">
              <p className="text-slate-600 text-lg text-center">
                Gracias por su interés en el Centro Educativo Adventista de Cartago. Nuestro equipo revisará su solicitud de <strong>{tipoIngreso === 'nuevo' ? 'Nuevo Ingreso' : tipoIngreso === 'regular' ? 'Estudiante Regular' : 'Reingreso'}</strong> y le contactaremos para indicar los próximos pasos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white" size="lg">
                  <a href="https://wa.me/50683069777" target="_blank" rel="noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" /> Escribir por WhatsApp
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 border-blue-600 text-blue-700 hover:bg-blue-50" size="lg" onClick={() => setIsSuccess(false)}>
                  Volver al inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-blue-900 py-16 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Proceso de Admisión</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4 text-lg">
          Toda la información que necesita para formar parte de la familia CEAC. Conozca nuestros requisitos, fechas importantes y costos, o envíe su solicitud en línea.
        </p>
      </div>

      <section className="py-12 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <Tabs defaultValue="informacion" className="w-full">
            <div className="flex justify-center mb-10 overflow-x-auto pb-2">
              <TabsList className="bg-white p-1 border border-slate-200 shadow-sm rounded-full h-auto flex flex-wrap justify-center">
                <TabsTrigger value="informacion" className="rounded-full px-6 py-3 text-sm md:text-base font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Info className="w-4 h-4 mr-2" /> Requisitos y Fechas
                </TabsTrigger>
                <TabsTrigger value="costos" className="rounded-full px-6 py-3 text-sm md:text-base font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <DollarSign className="w-4 h-4 mr-2" /> Inversión
                </TabsTrigger>
                <TabsTrigger value="formulario" className="rounded-full px-6 py-3 text-sm md:text-base font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <FileText className="w-4 h-4 mr-2" /> Formulario de Solicitud
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: Información y Requisitos */}
            <TabsContent value="informacion" className="space-y-8 animate-in fade-in-50 duration-500">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Fechas */}
                <Card className="border-0 shadow-lg" id="fechas">
                  <CardHeader className="bg-blue-50 border-b border-blue-100">
                    <CardTitle className="flex items-center text-blue-900">
                      <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                      Fechas de Matrícula
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="font-semibold text-slate-700">Apertura (Estudiantes Regulares)</span>
                        <span className="text-blue-600 font-bold">1 de Septiembre</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="font-semibold text-slate-700">Apertura (Nuevo Ingreso)</span>
                        <span className="text-blue-600 font-bold">15 de Septiembre</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="font-semibold text-slate-700">Cierre Oficial</span>
                        <span className="text-blue-600 font-bold">15 de Enero</span>
                      </li>
                    </ul>
                    <p className="text-sm text-slate-500 mt-4">
                      * Cupos sujetos a disponibilidad en cada nivel. Recomendamos realizar el proceso con anticipación.
                    </p>
                  </CardContent>
                </Card>

                {/* Documentos */}
                <Card className="border-0 shadow-lg" id="documentos">
                  <CardHeader className="bg-blue-50 border-b border-blue-100">
                    <CardTitle className="flex items-center text-blue-900">
                      <FileText className="w-6 h-6 mr-3 text-blue-600" />
                      Documentos Requeridos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-slate-600">Cédula del menor o Certificado de Nacimiento emitido por el Registro Civil.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-slate-600">Cédula de identidad de los padres o encargados legales (al día).</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-slate-600">Fotografía tamaño pasaporte reciente del estudiante.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-slate-600">Boletín o informe de calificaciones del año anterior (para nuevo ingreso/traslado).</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-slate-600">Constancia de vacunas al día.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB: Costos */}
            <TabsContent value="costos" className="animate-in fade-in-50 duration-500" id="inversion">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-slate-900 text-white text-center py-10">
                  <CardTitle className="text-3xl font-bold">Inversión Educativa</CardTitle>
                  <p className="text-slate-300 mt-2">Valores para el ciclo lectivo vigente</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-10 text-center">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Preescolar</h3>
                      <p className="text-slate-500 mb-8">Maternal a Transición</p>
                      
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-slate-500 font-semibold uppercase">Matrícula Anual</p>
                          <p className="text-3xl font-black text-blue-600 mt-1">₡XX,XXX</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-semibold uppercase">Mensualidad (10 Cuotas)</p>
                          <p className="text-3xl font-black text-blue-600 mt-1">₡XX,XXX</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-10 text-center bg-slate-50">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Primaria</h3>
                      <p className="text-slate-500 mb-8">I y II Ciclo</p>
                      
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-slate-500 font-semibold uppercase">Matrícula Anual</p>
                          <p className="text-3xl font-black text-blue-600 mt-1">₡XX,XXX</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-semibold uppercase">Mensualidad (10 Cuotas)</p>
                          <p className="text-3xl font-black text-blue-600 mt-1">₡XX,XXX</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-8 border-t border-blue-100" id="planes">
                    <h4 className="font-bold text-blue-900 mb-4 text-center">Información Adicional</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-2">Lista de Materiales</h5>
                        <p className="text-sm text-blue-700">La lista de materiales y libros de texto se entrega al momento de formalizar la matrícula. El costo varía según el nivel.</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-2">Planes Financieros y Becas</h5>
                        <p className="text-sm text-blue-700">Contamos con planes de pago y descuentos para hermanos. Consulte en administración sobre el proceso de solicitud de becas institucionales.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <p className="text-center text-xs text-slate-400 mt-4">* Los montos mostrados son informativos y deben confirmarse con la administración del CEAC.</p>
            </TabsContent>

            {/* TAB: Formulario */}
            <TabsContent value="formulario" className="animate-in fade-in-50 duration-500">
              <Card className="border-0 shadow-xl overflow-hidden rounded-2xl max-w-4xl mx-auto">
                <div className="bg-blue-600 p-8 text-white">
                  <h2 className="text-2xl font-bold mb-2">Formulario de Solicitud En Línea</h2>
                  <p className="text-blue-100">Complete los datos y adjunte los documentos requeridos para iniciar el proceso.</p>
                </div>
                
                <CardContent className="p-8 md:p-12">
                  
                  <div className="flex flex-wrap gap-4 mb-10 pb-8 border-b border-slate-200">
                    <Label className="w-full text-base font-bold text-slate-900 mb-2">Tipo de Solicitud:</Label>
                    <button
                      onClick={() => setTipoIngreso('nuevo')}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm border ${
                        tipoIngreso === 'nuevo' ? 'bg-blue-900 border-blue-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Nuevo Ingreso
                    </button>
                    <button
                      onClick={() => setTipoIngreso('regular')}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm border ${
                        tipoIngreso === 'regular' ? 'bg-blue-900 border-blue-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Estudiante Regular
                    </button>
                    <button
                      onClick={() => setTipoIngreso('reingreso')}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm border ${
                        tipoIngreso === 'reingreso' ? 'bg-blue-900 border-blue-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Reingreso (Antiguo Alumno)
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-12">
                    
                    {/* 1. Datos del Estudiante */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                          <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">1. Datos del Estudiante</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="est-nombre">Nombre Completo <span className="text-red-500">*</span></Label>
                          <Input id="est-nombre" name="est_nombre" required placeholder="Nombres y apellidos" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="est-id">Cédula del Menor <span className="text-red-500">*</span></Label>
                          <Input id="est-id" name="est_id" required placeholder="Número de TIM o Cédula" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="est-fecha">Fecha de Nacimiento <span className="text-red-500">*</span></Label>
                          <Input id="est-fecha" name="est_fecha" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="est-nivel">Nivel a Ingresar <span className="text-red-500">*</span></Label>
                          <Select value={nivelIngreso} onValueChange={setNivelIngreso} required>
                            <SelectTrigger id="est-nivel">
                              <SelectValue placeholder="Seleccione el nivel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maternal">Maternal</SelectItem>
                              <SelectItem value="interactivo1">Interactivo I</SelectItem>
                              <SelectItem value="interactivo2">Interactivo II</SelectItem>
                              <SelectItem value="preparatoria">Transición (Preparatoria)</SelectItem>
                              <SelectItem value="1">Primer Grado</SelectItem>
                              <SelectItem value="2">Segundo Grado</SelectItem>
                              <SelectItem value="3">Tercer Grado</SelectItem>
                              <SelectItem value="4">Cuarto Grado</SelectItem>
                              <SelectItem value="5">Quinto Grado</SelectItem>
                              <SelectItem value="6">Sexto Grado</SelectItem>
                            </SelectContent>
                          </Select>
                          <input type="hidden" name="est_nivel" value={nivelIngreso} />
                        </div>
                      </div>
                    </div>

                    {/* 2. Datos del Encargado */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                          <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">2. Datos del Encargado Legal</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="enc-nombre">Nombre Completo <span className="text-red-500">*</span></Label>
                          <Input id="enc-nombre" name="enc_nombre" required placeholder="Nombres y apellidos" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="enc-id">Cédula <span className="text-red-500">*</span></Label>
                          <Input id="enc-id" name="enc_id" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="enc-email">Correo Electrónico <span className="text-red-500">*</span></Label>
                          <Input id="enc-email" name="enc_email" type="email" required placeholder="correo@ejemplo.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="enc-tel">Teléfono / WhatsApp <span className="text-red-500">*</span></Label>
                          <Input id="enc-tel" name="enc_tel" type="tel" required placeholder="8888-8888" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-slate-50 p-5 text-sm text-slate-700">
                      Si se necesitan documentos adicionales, administración te indicará cómo enviarlos de forma segura.
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      {submitError && <p role="alert" className="mb-3 text-red-700">{submitError}</p>}
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-12 py-6 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                      >
                        {isSubmitting ? (
                          'Enviando...'
                        ) : (
                          <span className="flex items-center">
                            Enviar Solicitud <Send className="ml-2 w-5 h-5" />
                          </span>
                        )}
                      </Button>
                      <p className="text-xs text-slate-500 mt-4 max-w-xl">
                        Al enviar, usted acepta que el CEAC procese sus datos para fines de admisión y matrícula.
                      </p>
                    </div>

                  </form>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

        </div>
      </section>
    </PublicLayout>
  );
}
