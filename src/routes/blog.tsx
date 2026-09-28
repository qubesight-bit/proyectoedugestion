import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Image as ImageIcon, Video } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Route = createFileRoute('/blog')({
  component: Blog,
  validateSearch: (search: Record<string, unknown>): { postId?: string } => {
    return {
      postId: typeof search['postId'] === 'string' ? search['postId'] : undefined,
    };
  },
});

interface BlogPost {
  id: string;
  titulo: string;
  fecha: Date;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
  galeria?: string[];
  videoUrl?: string;
}

const mockPosts: BlogPost[] = [
  {
    id: 'feria-robotica-2025',
    titulo: 'Éxito rotundo en la Feria de Robótica 2025',
    fecha: new Date(2025, 10, 15),
    resumen: 'Nuestros estudiantes de primaria deslumbraron con proyectos innovadores enfocados en resolver problemas ambientales usando tecnología.',
    contenido: 'El pasado viernes se llevó a cabo nuestra Feria de Robótica anual. Fue una jornada llena de innovación y creatividad donde los estudiantes de II Ciclo presentaron prototipos funcionales de robots diseñados para clasificar reciclaje y conservar agua.\n\nEl jurado, compuesto por expertos locales, elogió el nivel técnico y el compromiso de los niños con el cuidado del medio ambiente.',
    imagenPrincipal: '/placeholder.svg',
    galeria: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  },
  {
    id: 'acto-civico-independencia',
    titulo: 'Celebración del 15 de Septiembre',
    fecha: new Date(2025, 8, 15),
    resumen: 'Con faroles y fervor patrio celebramos un año más de independencia junto a toda la comunidad educativa.',
    contenido: 'La celebración de nuestra independencia patria fue un momento emotivo para toda la familia CEAC. Desde el tradicional desfile de faroles hasta los actos culturales organizados por los estudiantes, resaltamos los valores de libertad, paz y trabajo que caracterizan a nuestro país.\n\nAgradecemos a todos los padres que nos acompañaron y apoyaron en la elaboración de los hermosos faroles.',
    imagenPrincipal: '/placeholder.svg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  }
];

function Blog() {
  const { postId } = Route.useSearch();
  const navigate = Route.useNavigate();

  const selectedPost = postId ? mockPosts.find(p => p.id === postId) : null;

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-blue-900 py-12 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Institucional</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">
          Descubra las últimas noticias, actividades y logros de nuestra comunidad educativa.
        </p>
      </div>

      <section className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {selectedPost ? (
            /* Vista de Detalle */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button 
                variant="ghost" 
                onClick={() => navigate({ search: {} })}
                className="mb-6 -ml-4 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver al listado
              </Button>

              <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                {/* Imagen Principal */}
                <div className="w-full h-64 md:h-96 bg-slate-200 relative flex items-center justify-center">
                   <ImageIcon className="w-16 h-16 text-slate-400" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                     <span className="text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm">FOTO PRINCIPAL // TODO</span>
                   </div>
                </div>

                <div className="p-8 md:p-12">
                  <div className="flex items-center text-slate-500 text-sm font-medium mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(selectedPost.fecha, "d 'de' MMMM, yyyy", { locale: es })}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                    {selectedPost.titulo}
                  </h2>

                  <div className="prose prose-blue lg:prose-lg max-w-none text-slate-700 mb-12 whitespace-pre-line">
                    {selectedPost.contenido}
                  </div>

                  {/* Video Embed */}
                  {selectedPost.videoUrl && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Video className="w-5 h-5 text-blue-600" /> Video Relacionado
                      </h3>
                      <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-md">
                         {/* TODO: Implementar iframe real con url segura */}
                         <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                            <Video className="w-12 h-12 mb-2" />
                            <span>Reproductor de Video Placeholder</span>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Galería */}
                  {selectedPost.galeria && selectedPost.galeria.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-600" /> Galería de Imágenes
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedPost.galeria.map((img, idx) => (
                          <div key={idx} className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            <span className="text-slate-400 text-xs z-10">FOTO {idx+1}</span>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          ) : (
            /* Listado */
            <div className="grid md:grid-cols-2 gap-8">
              {mockPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col"
                  onClick={() => navigate({ search: { postId: post.id } })}
                >
                  <div className="aspect-[16/9] bg-slate-200 relative overflow-hidden flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-400" />
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors"></div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-blue-600 text-xs font-bold mb-3 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {format(post.fecha, "MMM dd, yyyy", { locale: es })}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
                      {post.titulo}
                    </h3>
                    <p className="text-slate-600 line-clamp-3 mb-6 flex-1">
                      {post.resumen}
                    </p>
                    <div className="text-blue-600 font-semibold text-sm flex items-center mt-auto">
                      Leer artículo completo <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}
