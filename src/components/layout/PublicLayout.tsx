import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MapPin, Mail, Phone, Facebook, Instagram } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Bar (Optional, but good for contact info) */}
      <div className="bg-blue-900 text-white py-2 px-4 hidden md:flex justify-between items-center text-sm">
        <div className="flex space-x-6">
          <a href="mailto:info@ceac.ed.cr" className="flex items-center hover:text-blue-200 transition-colors">
            <Mail className="w-4 h-4 mr-2" />
            info@ceac.ed.cr
          </a>
          <a href="https://wa.me/50683069777" className="flex items-center hover:text-blue-200 transition-colors">
            <Phone className="w-4 h-4 mr-2" />
            +506 8306-9777
          </a>
        </div>
        <div className="flex space-x-4">
          <a href="https://facebook.com/ceacartagocr" target="_blank" rel="noreferrer" className="hover:text-blue-200 transition-colors">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="https://instagram.com/adventistacartago" target="_blank" rel="noreferrer" className="hover:text-blue-200 transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Navbar */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 dark:border-b dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="Logo CEAC" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-tight text-blue-950 dark:text-blue-400">CEAC</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">Centro Educativo Adventista</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2">Inicio</Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors outline-none cursor-pointer px-2">
                Nosotros <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md">
                <DropdownMenuItem asChild><Link to="/nosotros" hash="historia" className="cursor-pointer w-full">Nuestra familia / Historia</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/nosotros" hash="adventista" className="cursor-pointer w-full">Educación adventista en CR</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors outline-none cursor-pointer px-2">
                Oferta <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md">
                <DropdownMenuItem asChild><Link to="/oferta" hash="propuesta" className="cursor-pointer w-full">Propuesta resumida</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/oferta" hash="modelo" className="cursor-pointer w-full">Modelo educativo</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/niveles" search={{ nivel: 'preescolar' }} className="cursor-pointer w-full">Preescolar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/niveles" search={{ nivel: 'primaria' }} className="cursor-pointer w-full">Primaria</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/oferta" hash="apoyos" className="cursor-pointer w-full">Apoyos educativos</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors outline-none cursor-pointer px-2">
                Admisión <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md">
                <DropdownMenuItem asChild><Link to="/admision" search={{ tab: 'nuevo' }} className="cursor-pointer w-full">Matrícula nuevo ingreso</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/admision" search={{ tab: 'regular' }} className="cursor-pointer w-full">Matrícula regular</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/admision" search={{ tab: 'reingreso' }} className="cursor-pointer w-full">Matrícula reingreso</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/admision" hash="documentos" className="cursor-pointer w-full">Documentos de admisión</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/admision" hash="inversion" className="cursor-pointer w-full">Inversión / cuotas</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/admision" hash="materiales" className="cursor-pointer w-full">Lista de materiales</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/admision" hash="planes" className="cursor-pointer w-full">Planes financieros</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors outline-none cursor-pointer px-2">
                Espiritualidad <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md">
                <DropdownMenuItem asChild><Link to="/espiritualidad" hash="creencias" className="cursor-pointer w-full">Declaración de fe / Creencias</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/espiritualidad" hash="capellania" className="cursor-pointer w-full">Capellanía</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/espiritualidad" hash="devocionales" className="cursor-pointer w-full">Devocionales</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors outline-none cursor-pointer px-2">
                Estudiantes <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md">
                <DropdownMenuItem asChild><Link to="/estudiantes" hash="clubes" className="cursor-pointer w-full">Clubes</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/blog" className="cursor-pointer w-full">Actividades / Blog</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/uniformes" className="cursor-pointer w-full">Venta de Uniformes</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors outline-none cursor-pointer px-2">
                Pagos <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md">
                <DropdownMenuItem asChild><Link to="/pagos" hash="sinpe" className="cursor-pointer w-full">SINPE / SIMPLE Móvil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/pagos" hash="financieros" className="cursor-pointer w-full">Datos financieros</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/contacto" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2">Contacto</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button asChild variant="outline" className="hidden md:flex rounded-full border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 px-4">
              <Link to="/auth">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all hidden md:flex">
              <Link to="/admision">ADMISIÓN</Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-700 dark:text-slate-300">
              <ChevronDown className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                  <img src="/logo.png" alt="Logo CEAC" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-xl text-white">CEAC</span>
              </div>
              <p className="text-sm mb-6 text-slate-400">
                Educamos hoy la generación del mañana. Formación integral para cuerpo, mente y espíritu.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com/ceacartagocr" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/adventistacartago" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Enlaces Rápidos</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/nosotros" className="hover:text-blue-400 transition-colors">Nosotros</Link></li>
                <li><Link to="/niveles" className="hover:text-blue-400 transition-colors">Niveles Académicos</Link></li>
                <li><Link to="/admision" className="hover:text-blue-400 transition-colors">Admisión</Link></li>
                <li><Link to="/uniformes" className="hover:text-blue-400 transition-colors">Uniformes</Link></li>
                <li><Link to="/anuncios" className="hover:text-blue-400 transition-colors">Anuncios</Link></li>
                <li><a href="/#tour-virtual" className="hover:text-blue-400 transition-colors">Tour Virtual</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contacto</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-blue-500 shrink-0" />
                  <span>De los Tribunales de Justicia, 700 m norte y 50 m este, Cartago, Costa Rica.</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-blue-500 shrink-0" />
                  <span>WhatsApp: +506 8306-9777</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-blue-500 shrink-0" />
                  <span>info@ceac.ed.cr</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Ubicación</h3>
              <div className="h-32 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15721.439006900654!2d-83.9213193!3d9.8622116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e342c50d15c5%3A0x73b22ed1c7b80a13!2sCartago!5e0!3m2!1sen!2scr!4v1700000000000!5m2!1sen!2scr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa CEAC"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>&copy; {currentYear} Centro Educativo Adventista de Cartago. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
