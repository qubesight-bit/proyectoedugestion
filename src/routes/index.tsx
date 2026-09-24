import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-transparent bg-[#0d3958] shadow-lg">
        <div className="container mx-auto flex h-24 tv:h-40 max-w-7xl 3xl:max-w-screen-3xl tv:max-w-[3840px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img 
              src="/logo_cartago.png" 
              alt="Centro Educativo Adventista de Cartago" 
              className="h-16 tv:h-28 w-auto object-contain drop-shadow-sm"
            />
          </div>
          
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#inicio" className="text-sm tv:text-2xl font-semibold text-white/90 hover:text-white hover:scale-105 transition-all">Inicio</a>
            <a href="#nosotros" className="text-sm tv:text-2xl font-semibold text-white/90 hover:text-white hover:scale-105 transition-all">Nosotros</a>
            <a href="#academico" className="text-sm tv:text-2xl font-semibold text-white/90 hover:text-white hover:scale-105 transition-all">Académico</a>
            <a href="#contacto" className="text-sm tv:text-2xl font-semibold text-white/90 hover:text-white hover:scale-105 transition-all">Contacto</a>
          </nav>

          <div className="flex items-center">
            <Link to="/auth">
              <Button className="rounded-full bg-yellow-400 px-6 py-5 tv:px-12 tv:py-10 text-sm tv:text-2xl font-bold text-blue-950 shadow-xl hover:bg-yellow-300 transition-all hover:scale-105">
                Iniciar sesión
                <span className="material-symbols-outlined ml-2 text-[20px] tv:text-[32px]">login</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img2.png" 
            alt="Fondo estudiantes" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-blue-900/70" />
        </div>
        
        <div className="container relative z-10 mx-auto max-w-5xl 3xl:max-w-screen-2xl tv:max-w-[3000px] px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-blue-100/10 px-4 py-1.5 tv:px-8 tv:py-3 text-sm tv:text-3xl font-medium tracking-wide text-blue-100 backdrop-blur-sm mb-6 border border-blue-100/20">
            Educación con Valores Cristianos
          </span>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl tv:text-[10rem] tv:leading-[1.1]">
            Formando líderes para el <span className="text-yellow-400">futuro</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl 3xl:max-w-4xl tv:max-w-6xl text-lg text-blue-100 sm:text-xl tv:text-5xl tv:leading-tight">
            En el Centro Educativo Adventista de Cartago, brindamos una educación integral que desarrolla el aspecto físico, mental y espiritual de nuestros estudiantes.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row tv:gap-8">
            <a href="#admisiones">
              <Button className="h-14 tv:h-24 w-full rounded-full bg-yellow-400 px-8 tv:px-16 text-lg tv:text-4xl font-bold text-blue-950 shadow-xl hover:bg-yellow-300 transition-all hover:-translate-y-1 sm:w-auto">
                Proceso de Admisión
              </Button>
            </a>
            <a href="#nosotros">
              <Button variant="outline" className="h-14 tv:h-24 w-full rounded-full border-2 border-white bg-transparent px-8 tv:px-16 text-lg tv:text-4xl font-bold text-white shadow-xl hover:bg-white/10 transition-all sm:w-auto">
                Conoce más
              </Button>
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block h-[50px] w-full" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.24,199.11,113.62,241.6,110.15,282.51,80.75,321.39,56.44Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-24 tv:py-48">
        <div className="container mx-auto max-w-7xl 3xl:max-w-screen-3xl tv:max-w-[3840px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 tv:gap-32 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl tv:text-8xl">
                Nuestra Institución
              </h2>
              <p className="mt-4 text-lg tv:text-4xl text-slate-600 leading-relaxed tv:leading-relaxed">
                El Centro Educativo Adventista del Séptimo Día de Cartago forma parte de la red educativa protestante más grande del mundo. Nuestro objetivo es restaurar en el ser humano la imagen de su Creador, promoviendo el desarrollo armonioso del cuerpo, la mente y el espíritu.
              </p>
              
              <div className="mt-8 tv:mt-16 grid gap-6 tv:gap-16 sm:grid-cols-2">
                <div className="rounded-2xl tv:rounded-[3rem] bg-white p-6 tv:p-12 shadow-lg hover:shadow-xl border border-slate-200 transition-all hover:-translate-y-1">
                  <div className="mb-4 tv:mb-8 flex h-14 w-14 tv:h-24 tv:w-24 items-center justify-center rounded-2xl bg-[#0d3958]/5 text-[#0d3958] border border-[#0d3958]/10">
                    <span className="material-symbols-outlined text-[28px] tv:text-[48px] font-light">explore</span>
                  </div>
                  <h3 className="mb-2 tv:mb-6 text-xl tv:text-5xl font-bold text-[#0d3958]">Visión</h3>
                  <p className="text-sm tv:text-3xl text-slate-600 tv:leading-relaxed">
                    Ser una institución educativa líder en Costa Rica, reconocida por su excelencia académica y la firmeza de sus valores éticos y cristianos.
                  </p>
                </div>
                
                <div className="rounded-2xl tv:rounded-[3rem] bg-white p-6 tv:p-12 shadow-lg hover:shadow-xl border border-slate-200 transition-all hover:-translate-y-1">
                  <div className="mb-4 tv:mb-8 flex h-14 w-14 tv:h-24 tv:w-24 items-center justify-center rounded-2xl bg-[#0d3958]/5 text-[#0d3958] border border-[#0d3958]/10">
                    <span className="material-symbols-outlined text-[28px] tv:text-[48px] font-light">track_changes</span>
                  </div>
                  <h3 className="mb-2 tv:mb-6 text-xl tv:text-5xl font-bold text-[#0d3958]">Misión</h3>
                  <p className="text-sm tv:text-3xl text-slate-600 tv:leading-relaxed">
                    Proveer una educación de calidad que inspire a los estudiantes a alcanzar su máximo potencial, servir a Dios y a su comunidad.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 tv:-inset-12 rounded-3xl tv:rounded-[4rem] bg-blue-50/50 transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Instalaciones Centro Educativo Adventista de Cartago" 
                className="relative rounded-2xl tv:rounded-[3rem] object-cover shadow-2xl h-[500px] tv:h-[1200px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Informativo */}
      <section className="bg-slate-900 py-16 tv:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-950/80 z-0"></div>
        <div className="container relative z-10 mx-auto max-w-5xl 3xl:max-w-screen-2xl tv:max-w-[3000px] px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block rounded-full bg-blue-100/10 px-4 py-1.5 tv:px-8 tv:py-3 text-sm tv:text-3xl font-medium tracking-wide text-blue-100 backdrop-blur-sm mb-6 border border-blue-100/20">
            Experiencia CEAC
          </span>
          <h2 className="mb-8 tv:mb-16 text-3xl font-bold tracking-tight text-white sm:text-4xl tv:text-8xl">
            Conoce nuestras instalaciones y actividades
          </h2>
          <div className="relative w-full overflow-hidden rounded-2xl tv:rounded-[3rem] shadow-2xl border-4 border-white/10" style={{ paddingTop: '56.25%' }}>
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/n7QTjc-2I0k?si=qzns5uvfRh3rHM" 
              title="Video Informativo Centro Educativo Adventista de Cartago" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Academics Section */}
      <section id="academico" className="bg-white py-24 tv:py-48">
        <div className="container mx-auto max-w-7xl 3xl:max-w-screen-3xl tv:max-w-[3840px] px-4 sm:px-6 lg:px-8">
          <div className="mt-8 tv:mt-24 text-center">
            <h3 className="text-2xl tv:text-5xl font-bold text-slate-800 mb-6 tv:mb-12">
              Experiencia Centro Educativo Adventista de Cartago
            </h3>
            <p className="mx-auto mt-4 tv:mt-8 max-w-2xl tv:max-w-6xl text-lg tv:text-4xl text-slate-600 tv:leading-relaxed">
              Contamos con programas diseñados para acompañar a tu hijo desde sus primeros pasos hasta su graduación, con un currículo que integra la fe y la enseñanza.
            </p>
          </div>

          <div className="grid gap-8 tv:gap-24 md:grid-cols-3">
            {[
              {
                title: "Preescolar",
                desc: "Un ambiente seguro y amoroso donde los más pequeños aprenden a través del juego, la música y principios bíblicos.",
                icon: "extension",
                color: "bg-[#0d3958]/10 text-[#0d3958]"
              },
              {
                title: "Primaria",
                desc: "Bases sólidas en lectura, escritura, matemáticas y ciencias, complementadas con educación física y musical.",
                icon: "local_library",
                color: "bg-[#0d3958]/10 text-[#0d3958]"
              },
              {
                title: "Secundaria",
                desc: "Preparación académica rigurosa para el éxito universitario, con énfasis en el liderazgo y servicio comunitario.",
                icon: "architecture",
                color: "bg-[#0d3958]/10 text-[#0d3958]"
              }
            ].map((level, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl tv:rounded-[4rem] bg-white p-8 tv:p-16 transition-all hover:bg-[#0d3958] hover:text-white shadow-lg hover:shadow-2xl hover:-translate-y-2 tv:hover:-translate-y-6 border border-slate-200">
                <div className={`mb-6 tv:mb-12 flex h-16 w-16 tv:h-32 tv:w-32 items-center justify-center rounded-2xl tv:rounded-[2.5rem] ${level.color} transition-colors group-hover:bg-white/20 group-hover:text-white`}>
                  <span className="material-symbols-outlined text-[32px] tv:text-[80px] font-light">{level.icon}</span>
                </div>
                <h3 className="mb-4 tv:mb-8 text-2xl tv:text-6xl font-bold text-[#0d3958] group-hover:text-white">{level.title}</h3>
                <p className="text-slate-600 tv:text-3xl group-hover:text-blue-100 leading-relaxed tv:leading-relaxed">
                  {level.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vida Estudiantil Section */}
      <section className="bg-slate-50 py-12 tv:py-24">
        <div className="container mx-auto max-w-7xl 3xl:max-w-screen-3xl tv:max-w-[3840px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 tv:gap-16">
            <div className="relative group overflow-hidden rounded-3xl tv:rounded-[4rem] shadow-xl">
              <img src="/img1.png" alt="Niños jugando" className="w-full h-[400px] tv:h-[800px] object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-8 tv:p-16">
                <h3 className="text-white text-2xl tv:text-5xl font-bold">Aprender jugando</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-3xl tv:rounded-[4rem] shadow-xl">
              <img src="/img5.png" alt="Estudiantes en el colegio" className="w-full h-[400px] tv:h-[800px] object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-8 tv:p-16">
                <h3 className="text-white text-2xl tv:text-5xl font-bold">Formando amistades</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Admissions Section */}
      <section id="admisiones" className="relative py-24 tv:py-48 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container relative z-10 mx-auto max-w-6xl 3xl:max-w-7xl tv:max-w-[3200px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 tv:gap-24 items-center">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl tv:text-8xl">
                ¿Listo para unirte a nuestra familia?
              </h2>
              <p className="mt-4 tv:mt-12 text-lg tv:text-4xl text-blue-200 tv:leading-relaxed">
                El proceso de matrícula para el ciclo lectivo 2025 ya está abierto. Contáctanos hoy mismo para asegurar el cupo de tu hijo o solicitar una visita guiada a nuestras instalaciones.
              </p>
              <div className="mt-10 tv:mt-24 flex flex-col gap-4 tv:gap-12 sm:flex-row">
                <Button className="h-14 tv:h-28 rounded-full bg-yellow-400 px-8 tv:px-16 text-lg tv:text-4xl font-bold text-[#0d3958] shadow-xl hover:bg-yellow-300 transition-all hover:-translate-y-1">
                  Solicitar Información
                  <span className="material-symbols-outlined ml-2 tv:ml-6 tv:text-[40px] font-light">contact_mail</span>
                </Button>
                <Button variant="outline" className="h-14 tv:h-28 rounded-full border-2 border-white bg-transparent px-8 tv:px-16 text-lg tv:text-4xl font-bold text-white shadow-xl hover:bg-white/10 transition-all hover:-translate-y-1">
                  Llámanos: 2553-2617
                  <span className="material-symbols-outlined ml-2 tv:ml-6 tv:text-[40px] font-light">support_agent</span>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img src="/img4.png" alt="Matrícula Abierta" className="rounded-3xl tv:rounded-[4rem] shadow-2xl h-[500px] tv:h-[1200px] object-contain tv:object-cover transform rotate-2 hover:rotate-0 transition-transform duration-300 bg-blue-800/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-slate-950 py-12 tv:py-32 text-slate-400">
        <div className="container mx-auto max-w-7xl 3xl:max-w-screen-3xl tv:max-w-[3840px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 tv:gap-24 md:grid-cols-2 lg:grid-cols-4">
            
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 tv:gap-6 mb-6 tv:mb-10">
                <img src="/logo_cartago.png" alt="Logo" className="w-12 h-12 tv:w-20 tv:h-20 object-contain" />
                <span className="text-lg tv:text-4xl font-bold text-white">Centro Educativo Adventista de Cartago</span>
              </div>
              <p className="text-sm tv:text-2xl tv:leading-relaxed">
                Formando líderes con excelencia académica y valores cristianos para el servicio de Dios y la humanidad.
              </p>
            </div>

            <div>
              <h3 className="mb-4 tv:mb-10 text-sm tv:text-2xl font-semibold uppercase tracking-wider text-slate-300">Navegación</h3>
              <ul className="space-y-3 tv:space-y-6 text-sm tv:text-2xl">
                <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
                <li><a href="#academico" className="hover:text-white transition-colors">Académico</a></li>
                <li><a href="#admisiones" className="hover:text-white transition-colors">Admisiones</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 tv:mb-10 text-sm tv:text-2xl font-semibold uppercase tracking-wider text-slate-300">Contacto</h3>
              <ul className="space-y-3 tv:space-y-6 text-sm tv:text-2xl">
                <li className="flex items-center gap-2 tv:gap-4">
                  <span className="material-symbols-outlined text-[18px] tv:text-[32px] font-light">location_on</span>
                  Cartago, Costa Rica
                </li>
                <li className="flex items-center gap-2 tv:gap-4">
                  <span className="material-symbols-outlined text-[18px] tv:text-[32px] font-light">support_agent</span>
                  2553-2617
                </li>
                <li className="flex items-center gap-2 tv:gap-4">
                  <span className="material-symbols-outlined text-[18px] tv:text-[32px] font-light">contact_mail</span>
                  ceacartago@gmail.com
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 tv:mb-10 text-sm tv:text-2xl font-semibold uppercase tracking-wider text-slate-300">Administración</h3>
              <Link to="/auth">
                <Button variant="outline" className="w-full h-auto py-3 tv:py-6 text-sm tv:text-3xl border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white">
                  Plataforma Institucional
                </Button>
              </Link>
            </div>
            
          </div>
          
          <div className="mt-12 tv:mt-24 border-t border-slate-800 pt-8 tv:pt-16 text-center text-sm tv:text-2xl">
            <p>&copy; {new Date().getFullYear()} Centro Educativo Adventista de Cartago. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
