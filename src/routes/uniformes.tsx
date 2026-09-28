import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Plus, Minus, Trash2, Smartphone, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/uniformes')({
  component: Uniformes,
});

interface Producto {
  id: string;
  nombre: string;
  categoria: 'preescolar' | 'primaria' | 'ambos';
  precio: number;
  imagen: string;
}

const catalogo: Producto[] = [
  { id: '1', nombre: 'Camiseta Polo Diaria', categoria: 'ambos', precio: 8500, imagen: '/placeholder.svg' },
  { id: '2', nombre: 'Pantalón de Vestir', categoria: 'primaria', precio: 12000, imagen: '/placeholder.svg' },
  { id: '3', nombre: 'Falda-Pantalón', categoria: 'primaria', precio: 11500, imagen: '/placeholder.svg' },
  { id: '4', nombre: 'Buzo Deportivo', categoria: 'ambos', precio: 10000, imagen: '/placeholder.svg' },
  { id: '5', nombre: 'Camiseta Deportiva', categoria: 'ambos', precio: 7500, imagen: '/placeholder.svg' },
  { id: '6', nombre: 'Gabacha', categoria: 'preescolar', precio: 9000, imagen: '/placeholder.svg' },
];

interface CartItem extends Producto {
  cantidad: number;
  talla: string;
}

function Uniformes() {
  const [categoriaActiva, setCategoriaActiva] = useState<'preescolar' | 'primaria'>('preescolar');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');

  const sinpeNumber = import.meta.env.VITE_SCHOOL_SINPE_NUMBER || '8306-9777';

  const productosFiltrados = catalogo.filter(
    (p) => p.categoria === categoriaActiva || p.categoria === 'ambos'
  );

  const agregarAlCarrito = (producto: Producto) => {
    // Por simplicidad, agregamos una talla por defecto 'M'
    const newItem = { ...producto, cantidad: 1, talla: 'M' };
    setCart((prev) => {
      const existing = prev.find((item) => item.id === producto.id && item.talla === newItem.talla);
      if (existing) {
        return prev.map((item) =>
          item.id === producto.id && item.talla === newItem.talla
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const actualizarCantidad = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item
      )
    );
  };

  const eliminarDelCarrito = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleSinpeLink = () => {
    // Intentar abrir la app del BN (Banco Nacional). 
    // Los deep links específicos cambian, a menudo se usa bncr:// o se abre la página web.
    // Como fallback, el usuario verá la pantalla de pago manual.
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
      // Intento de deep link genérico para apps bancarias CR o SINPE Móvil
      // Esto es un placeholder; la recomendación oficial es dar el número.
      window.location.href = `bncr://sinpemovil?telefono=${sinpeNumber.replace(/-/g, '')}&monto=${total}`;
      
      // Fallback a los 500ms si el deep link falla
      setTimeout(() => {
        alert("Si no se abrió su aplicación bancaria, por favor realice la transferencia manualmente.");
      }, 500);
    }
  };

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-blue-900 py-12 text-white text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Uniformes</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">
          Adquiera los uniformes oficiales del CEAC de forma rápida y segura.
        </p>

        {/* Cart Button Floating */}
        <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2">
          <Dialog open={isCartOpen} onOpenChange={(open) => {
            setIsCartOpen(open);
            if (!open) setCheckoutStep('cart');
          }}>
            <DialogTrigger asChild>
              <Button className="relative bg-white text-blue-900 hover:bg-slate-100 rounded-full w-14 h-14 p-0 shadow-xl">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    {cart.reduce((sum, i) => sum + i.cantidad, 0)}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{checkoutStep === 'cart' ? 'Su Carrito' : 'Pago por SINPE Móvil'}</DialogTitle>
                <DialogDescription>
                  {checkoutStep === 'cart' 
                    ? 'Revise sus artículos antes de proceder al pago.'
                    : 'Siga las instrucciones para completar su compra.'}
                </DialogDescription>
              </DialogHeader>

              {checkoutStep === 'cart' ? (
                <div className="space-y-4 my-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      Su carrito está vacío.
                    </div>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.talla}`} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{item.nombre}</h4>
                            <p className="text-sm text-slate-500">
                              Talla: {item.talla} | ₡{item.precio.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-md">
                              <button onClick={() => actualizarCantidad(item.id, -1)} className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-md"><Minus className="w-4 h-4" /></button>
                              <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                              <button onClick={() => actualizarCantidad(item.id, 1)} className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-md"><Plus className="w-4 h-4" /></button>
                            </div>
                            <button onClick={() => eliminarDelCarrito(item.id)} className="text-red-500 hover:text-red-700 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {cart.length > 0 && (
                    <div className="flex justify-between font-bold text-lg pt-4 border-t border-slate-200">
                      <span>Total:</span>
                      <span>₡{total.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 my-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
                    <p className="text-sm text-blue-800 mb-2">Monto a transferir:</p>
                    <p className="text-3xl font-black text-blue-700 mb-4">₡{total.toLocaleString()}</p>
                    <p className="text-sm text-blue-800 mb-2">Número SINPE Móvil (Banco Nacional):</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-wider bg-white py-2 rounded-lg border border-blue-200">{sinpeNumber}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-800 text-sm">Instrucciones:</p>
                    <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                      <li>Realice la transferencia desde su aplicación bancaria.</li>
                      <li>En el detalle, indique su nombre y "Compra Uniformes".</li>
                      <li>Guarde el comprobante (pantallazo o PDF).</li>
                      <li>Para retirar el pedido en la institución, deberá <strong>presentar el comprobante impreso o digital</strong>.</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                    <Button onClick={handleSinpeLink} className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Smartphone className="w-4 h-4" /> App BN
                    </Button>
                    <Button asChild variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50 flex items-center justify-center gap-2">
                      <a href={`https://wa.me/50683069777?text=Hola, acabo de realizar un pago de uniformes por ₡${total}. Adjunto comprobante.`} target="_blank" rel="noreferrer">
                        <MessageCircle className="w-4 h-4" /> Enviar por WA
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <DialogFooter className="sm:justify-between">
                {checkoutStep === 'cart' ? (
                  <>
                    <Button variant="outline" onClick={() => setIsCartOpen(false)}>Seguir Comprando</Button>
                    <Button 
                      onClick={() => setCheckoutStep('payment')} 
                      disabled={cart.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Pagar con SINPE Móvil
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => {
                    setCart([]);
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}>
                    Terminar y Vaciar Carrito
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[72px] z-30">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="flex space-x-8">
            <button
              onClick={() => setCategoriaActiva('preescolar')}
              className={`py-4 px-2 font-semibold text-lg border-b-4 transition-colors ${
                categoriaActiva === 'preescolar' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-blue-600'
              }`}
            >
              Preescolar
            </button>
            <button
              onClick={() => setCategoriaActiva('primaria')}
              className={`py-4 px-2 font-semibold text-lg border-b-4 transition-colors ${
                categoriaActiva === 'primaria' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-blue-600'
              }`}
            >
              Primaria
            </button>
          </div>
        </div>
      </div>

      {/* Catálogo */}
      <section className="py-16 bg-slate-50 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <Card key={producto.id} className="border-0 shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col group">
                <div className="aspect-square bg-slate-200 relative p-4 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                    <span className="text-xs font-medium">FOTO // TODO</span>
                  </div>
                  {producto.categoria === 'ambos' && (
                    <Badge className="absolute top-3 left-3 bg-white/90 text-slate-700 hover:bg-white border-0 shadow-sm backdrop-blur-sm">
                      Unisex / General
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 mb-1 leading-tight">{producto.nombre}</h3>
                  <p className="text-blue-600 font-bold text-lg mb-4 mt-auto">
                    ₡{producto.precio.toLocaleString()}
                  </p>
                  <Button 
                    onClick={() => agregarAlCarrito(producto)}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-colors"
                  >
                    Agregar al Carrito
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
