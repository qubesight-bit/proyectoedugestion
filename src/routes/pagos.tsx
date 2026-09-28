import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Landmark, Smartphone, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const Route = createFileRoute('/pagos')({
  component: PagosPage,
});

function PagosPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-slate-900 py-16 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Formas de Pago</h1>
        <p className="text-slate-300 max-w-2xl mx-auto px-4 text-lg">
          Opciones seguras y rápidas para el pago de matrículas, mensualidades y otros servicios institucionales.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16">
        
        <Alert className="mb-10 max-w-3xl mx-auto bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-bold">Importante</AlertTitle>
          <AlertDescription className="text-amber-700">
            Siempre indique el <strong>Nombre Completo del Estudiante</strong> y el <strong>Grado</strong> en el detalle o motivo de su pago para procesarlo correctamente.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* SINPE Móvil */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden" id="sinpe">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">SINPE / SIMPLE Móvil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-6">
                Realice sus pagos de forma instantánea a través de SINPE Móvil del Banco Nacional (BN).
              </p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6 text-center">
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-2 font-semibold">Número Oficial SINPE</p>
                <p className="text-4xl font-black text-blue-900 tracking-widest">
                  {/* TODO: Confirmar con Aaron el número real */}
                  8888-8888
                </p>
                <p className="text-xs text-slate-400 mt-2">* Número pendiente de confirmación oficial</p>
              </div>

              <Button className="w-full bg-[#009b3a] hover:bg-[#007a2d] text-white text-lg py-6 rounded-xl shadow-md">
                Pagar vía App BN
              </Button>
              <p className="text-xs text-center text-slate-500 mt-3">
                Será redirigido a la plataforma de su banco si está disponible en su dispositivo.
              </p>
            </CardContent>
          </Card>

          {/* Transferencias Bancarias */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow" id="financieros">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Landmark className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Datos Financieros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-6">
                Para transferencias interbancarias tradicionales o depósitos directos en ventanilla.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Razón Social</p>
                    <p className="text-slate-600">Centro Educativo Adventista de Cartago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Cédula Jurídica</p>
                    <p className="text-slate-600">3-000-000000</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Landmark className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Cuenta IBAN (Colones)</p>
                    <p className="text-slate-600 font-mono text-sm bg-slate-100 px-2 py-1 rounded mt-1">
                      CR00 0000 0000 0000 0000 00
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                Favor enviar el comprobante de transferencia al correo <strong>financiero@ceac.ed.cr</strong> o al WhatsApp administrativo.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
