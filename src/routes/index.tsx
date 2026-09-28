import { createFileRoute, Link } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Coffee, Laptop, MonitorPlay, Trees } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-32">
        {/* Fondo fotográfico */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img src="/img/hero-4k.png" alt="Estudiantes CEAC" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-900/90"></div>
        </div>
        
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-blue-600/40 blur-3xl opacity-60 pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-yellow-500/30 blur-3xl opacity-60 pointer-events-none z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl p-4">
            <img src="/logo.png" alt="Logo Educación Adventista CEAC" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
            ¿Está listo para dar el siguiente paso en la educación de su hijo?
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl font-light">
            Educamos hoy la generación del mañana con una formación integral para cuerpo, mente y espíritu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
              <Link to="/admision">APLICAR AHORA</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-slate-600 text-slate-800 hover:text-blue-700 bg-white hover:bg-slate-100 rounded-full px-8 py-6 text-lg transition-all">
              <Link to="/nosotros">Conózcanos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                Quiénes somos
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Institución misionera sin fines de lucro
              </h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Somos parte de la red global de Educación Adventista. Nuestra misión es ofrecer una formación integral desde una perspectiva espiritual y de valores, abierta a toda la comunidad sin distinción de creencias.
              </p>
              <Button asChild variant="link" className="text-blue-600 p-0 text-lg group">
                <Link to="/nosotros" className="flex items-center">
                  Descubra nuestra historia <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/n7QTjc-2I0k?si=cfuuBmoddx-cJ8s_" 
                  title="Video Institucional CEAC" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Niveles Académicos */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Nuestros Niveles</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Preescolar Card */}
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-3xl bg-white">
              <div className="h-56 flex items-center justify-center relative overflow-hidden">
                <img src="/img/preescolar.jpg" alt="Preescolar CEAC" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/80 to-transparent z-20"></div>
                <h3 className="relative z-30 text-3xl font-bold text-white mt-auto mb-6 drop-shadow-lg">Preescolar</h3>
              </div>
              <CardContent className="p-8 text-left">
                <p className="text-slate-600 mb-8 line-clamp-3">
                  Un ambiente seguro y estimulante donde los más pequeños desarrollan sus habilidades cognitivas, motoras y sociales a través del juego y valores cristianos.
                </p>
                <Button asChild variant="outline" className="w-full rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  <Link to="/niveles" search={{ nivel: 'preescolar' }}>Ver detalles</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Primaria Card */}
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-3xl bg-white">
              <div className="h-56 flex items-center justify-center relative overflow-hidden">
                <img src="/img/primaria.jpg" alt="Primaria CEAC" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/80 to-transparent z-20"></div>
                <h3 className="relative z-30 text-3xl font-bold text-white mt-auto mb-6 drop-shadow-lg">Primaria</h3>
              </div>
              <CardContent className="p-8 text-left">
                <p className="text-slate-600 mb-8 line-clamp-3">
                  I y II Ciclos de Educación General Básica. Fomentamos el pensamiento crítico, la excelencia académica y el desarrollo del carácter en un entorno de apoyo.
                </p>
                <Button asChild variant="outline" className="w-full rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  <Link to="/niveles" search={{ nivel: 'primaria' }}>Ver detalles</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Servicios / Instalaciones y Tour Virtual */}
      <section id="tour-virtual" className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nuestras Instalaciones</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Contamos con espacios diseñados para potenciar el aprendizaje y bienestar de nuestros estudiantes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 max-w-5xl mx-auto mb-16">
            <ServiceIcon icon={<Coffee />} title="Comedor" />
            <ServiceIcon icon={<BookOpen />} title="Biblioteca" />
            <ServiceIcon icon={<Laptop />} title="Lab. Cómputo" />
            <ServiceIcon icon={<Users />} title="Salón de Actos" />
            <ServiceIcon icon={<Trees />} title="Zona Recreativa" />
            <ServiceIcon icon={<div className="w-6 h-6 border-2 border-current rounded-sm"></div>} title="Cancha Deportiva" />
            <ServiceIcon icon={<MonitorPlay />} title="Aulas Equipadas" />
            <ServiceIcon icon={<div className="w-6 h-6 border-b-4 border-current"></div>} title="Parqueo" />
          </div>

          {/* Tour Virtual Gallery */}
          <div className="max-w-5xl mx-auto px-12 relative">
            <div className="text-left mb-8 md:max-w-lg">
              <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
                Explorar
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Tour Virtual 360°</h3>
              <p className="text-slate-600">
                Recorra nuestros pasillos, aulas, y zonas de recreación desde la comodidad de su hogar con esta galería.
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {[1, 2, 3, 4, 5].map((index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-slate-100">
                        <CardContent className="p-0 aspect-[4/3] relative group">
                          <img 
                            src={`/tour/${index}.jpg`} 
                            alt={`Instalaciones CEAC - Foto ${index}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.src.includes('placehold.co')) {
                                target.src = `https://placehold.co/600x400/059669/FFFFFF/png?text=Tour+${index}&font=Montserrat`;
                              }
                            }}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 md:-left-12 bg-white/90 shadow-md border-slate-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700" />
              <CarouselNext className="right-0 md:-right-12 bg-white/90 shadow-md border-slate-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Testimonios (Social Proof) */}
      <section className="py-24 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/40 blur-3xl opacity-60 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros padres</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              La confianza de nuestras familias es nuestra mayor garantía de calidad y compromiso.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                text: "Ver a mi hija crecer no solo académicamente, sino en valores y espiritualidad, no tiene precio. El CEAC ha sido una bendición para nuestra familia.",
                author: "María Fernanda Soto",
                role: "Madre de estudiante de 3° grado",
                stars: 5
              },
              {
                text: "Las instalaciones son seguras y el personal docente siempre está dispuesto a escuchar. Sentimos que nuestros hijos están en el mejor lugar posible.",
                author: "Carlos y Ana Ramírez",
                role: "Padres de familia",
                stars: 5
              },
              {
                text: "El nivel de inglés y las actividades extracurriculares han ayudado a que mi hijo desarrolle talentos que no sabíamos que tenía. ¡Totalmente recomendado!",
                author: "Lucía Valverde",
                role: "Madre de estudiante de 6° grado",
                stars: 5
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-white/10 border-0 backdrop-blur-md hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                  </div>
                  <p className="text-slate-200 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.author}</p>
                    <p className="text-sm text-blue-300">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function ServiceIcon({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex flex-col items-center group cursor-default">
      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <div className="[&>svg]:w-8 [&>svg]:h-8">
          {icon}
        </div>
      </div>
      <span className="text-sm font-semibold text-slate-700 text-center">{title}</span>
    </div>
  );
}
