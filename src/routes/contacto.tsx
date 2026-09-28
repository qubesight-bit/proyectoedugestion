import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/contacto')({
  component: Contacto,
});

function Contacto() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'contacto', ...data }),
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error enviando a n8n:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-blue-900 py-16 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctenos</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">
          Estamos aquí para responder a todas sus consultas. Escríbanos o visítenos en nuestras instalaciones.
        </p>
      </div>

      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
            
            {/* Formulario */}
            <div>
              <div className="mb-8">
                <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                  Envíenos un mensaje
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Tiene alguna duda?</h2>
                <p className="text-slate-600 text-lg">
                  Complete el formulario y nuestro equipo administrativo se pondrá en contacto con usted a la mayor brevedad.
                </p>
              </div>

              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-8">
                  {isSuccess ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Mensaje Enviado!</h3>
                      <p className="text-slate-600">
                        Gracias por escribirnos. Le responderemos muy pronto a su correo o teléfono.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input id="nombre" name="nombre" required placeholder="Ej. Ana Robles" />
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo Electrónico</Label>
                          <Input id="email" name="email" type="email" required placeholder="ana@ejemplo.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
                          <Input id="telefono" name="telefono" type="tel" placeholder="8888-8888" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="asunto">Asunto</Label>
                        <Input id="asunto" name="asunto" required placeholder="Ej. Consulta sobre Preescolar" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mensaje">Mensaje</Label>
                        <Textarea id="mensaje" name="mensaje" required placeholder="Escriba aquí sus dudas o comentarios..." className="h-32" />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-lg shadow-md"
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Información de Contacto */}
            <div className="flex flex-col gap-8 lg:mt-24">
              
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardContent className="p-6 flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Llámenos o Escríbanos</h3>
                    <p className="text-slate-600 text-sm mb-3">Consultas rápidas vía WhatsApp</p>
                    <a href="https://wa.me/50683069777" target="_blank" rel="noreferrer" className="text-blue-700 font-bold hover:underline">
                      +506 8306-9777
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-white">
                  <CardContent className="p-6 flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Correo Electrónico</h3>
                    <p className="text-slate-600 text-sm mb-3">Para asuntos administrativos</p>
                    <a href="mailto:info@ceac.ed.cr" className="text-blue-700 font-bold hover:underline">
                      info@ceac.ed.cr
                    </a>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-md bg-blue-800 text-white overflow-hidden h-full flex flex-col justify-between">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Ubicación y Horario</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="w-6 h-6 text-blue-400 mr-4 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Dirección</h4>
                        <p className="text-blue-100/90 leading-relaxed">
                          De los Tribunales de Justicia, 700 m norte y 50 m este.<br />
                          Cartago, Costa Rica.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-6 h-6 text-blue-400 mr-4 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Horario de Atención Administrativa</h4>
                        <p className="text-blue-100/90 leading-relaxed">
                          Lunes a Jueves: 7:00 a.m. - 4:00 p.m.<br />
                          Viernes: 7:00 a.m. - 2:00 p.m.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-blue-700/50 flex items-center justify-between">
                    <span className="font-semibold text-blue-100">Nuestras Redes</span>
                    <div className="flex space-x-3">
                      <a href="https://facebook.com/ceacartagocr" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md">
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a href="https://instagram.com/adventistacartago" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md">
                        <Instagram className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
          
          {/* Mapa de Ubicación */}
          <div className="max-w-6xl mx-auto mt-12 bg-white p-2 md:p-4 rounded-3xl shadow-xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center pt-4">Encuéntrenos en el Mapa</h3>
            <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-slate-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15723.123!2d-83.92!3d9.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e340e4f8d551%3A0x6e788880d88033!2sCartago%2C%20Costa%20Rica!5e0!3m2!1sen!2sus!4v1714488888888!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación CEAC Cartago"
              ></iframe>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
