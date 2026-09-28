const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'html_site');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const navbarAndTopBar = `
      <!-- Top Bar -->
      <div class="bg-emerald-900 text-white py-2 px-4 hidden md:flex justify-between items-center text-sm">
        <div class="flex space-x-6">
          <a href="mailto:info@ceac.ed.cr" class="flex items-center hover:text-emerald-200 transition-colors">
            <i data-lucide="mail" class="w-4 h-4 mr-2"></i> info@ceac.ed.cr
          </a>
          <a href="https://wa.me/50683069777" class="flex items-center hover:text-emerald-200 transition-colors">
            <i data-lucide="phone" class="w-4 h-4 mr-2"></i> +506 8306-9777
          </a>
        </div>
        <div class="flex space-x-4">
          <a href="https://facebook.com/ceacartagocr" target="_blank" class="hover:text-emerald-200 transition-colors">
            <i data-lucide="facebook" class="w-4 h-4"></i>
          </a>
          <a href="https://instagram.com/adventistacartago" target="_blank" class="hover:text-emerald-200 transition-colors">
            <i data-lucide="instagram" class="w-4 h-4"></i>
          </a>
        </div>
      </div>

      <!-- Navbar -->
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="index.html" class="flex items-center space-x-2">
            <div class="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-xl">C</div>
            <div class="flex flex-col">
              <span class="font-bold text-xl leading-tight text-emerald-950">CEAC</span>
              <span class="text-xs text-slate-500 hidden md:block">Centro Educativo Adventista</span>
            </div>
          </a>

          <nav class="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-700">
            <a href="index.html" class="hover:text-emerald-600 transition-colors">Inicio</a>
            <a href="nosotros.html" class="hover:text-emerald-600 transition-colors">Nosotros</a>
            
            <div class="relative group">
              <button class="flex items-center hover:text-emerald-600 transition-colors outline-none cursor-pointer">
                Niveles Académicos <i data-lucide="chevron-down" class="ml-1 w-4 h-4"></i>
              </button>
              <div class="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="niveles.html?nivel=preescolar" class="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700">Preescolar</a>
                <a href="niveles.html?nivel=primaria" class="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700">Primaria</a>
              </div>
            </div>

            <a href="anuncios.html" class="hover:text-emerald-600 transition-colors">Anuncios</a>
            <a href="uniformes.html" class="hover:text-emerald-600 transition-colors">Uniformes</a>
            <a href="blog.html" class="hover:text-emerald-600 transition-colors">Blog</a>
            <a href="contacto.html" class="hover:text-emerald-600 transition-colors">Contacto</a>
          </nav>

          <div class="flex items-center space-x-4">
            <a href="admision.html" class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all hidden md:flex">
              ADMISIÓN
            </a>
            <button class="lg:hidden text-slate-700">
              <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
          </div>
        </div>
      </header>
`;

const footer = `
      <footer class="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div class="col-span-1 md:col-span-1">
              <div class="flex items-center space-x-2 mb-6">
                <div class="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">C</div>
                <span class="font-bold text-xl text-white">CEAC</span>
              </div>
              <p class="text-sm mb-6 text-slate-400">Educamos hoy la generación del mañana. Formación integral para cuerpo, mente y espíritu.</p>
              <div class="flex space-x-4">
                <a href="https://facebook.com/ceacartagocr" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white"><i data-lucide="facebook" class="w-5 h-5"></i></a>
                <a href="https://instagram.com/adventistacartago" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white"><i data-lucide="instagram" class="w-5 h-5"></i></a>
              </div>
            </div>
            <div>
              <h3 class="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Enlaces Rápidos</h3>
              <ul class="space-y-3 text-sm">
                <li><a href="nosotros.html" class="hover:text-emerald-400 transition-colors">Nosotros</a></li>
                <li><a href="niveles.html" class="hover:text-emerald-400 transition-colors">Niveles Académicos</a></li>
                <li><a href="admision.html" class="hover:text-emerald-400 transition-colors">Admisión</a></li>
                <li><a href="uniformes.html" class="hover:text-emerald-400 transition-colors">Uniformes</a></li>
                <li><a href="anuncios.html" class="hover:text-emerald-400 transition-colors">Anuncios</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contacto</h3>
              <ul class="space-y-4 text-sm">
                <li class="flex items-start">
                  <i data-lucide="map-pin" class="w-5 h-5 mr-3 text-emerald-500 shrink-0"></i>
                  <span>De los Tribunales de Justicia, 700 m norte y 50 m este, Cartago.</span>
                </li>
                <li class="flex items-center">
                  <i data-lucide="phone" class="w-5 h-5 mr-3 text-emerald-500 shrink-0"></i>
                  <span>WhatsApp: +506 8306-9777</span>
                </li>
                <li class="flex items-center">
                  <i data-lucide="mail" class="w-5 h-5 mr-3 text-emerald-500 shrink-0"></i>
                  <span>info@ceac.ed.cr</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Ubicación</h3>
              <div class="h-32 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15721.439006900654!2d-83.9213193!3d9.8622116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e342c50d15c5%3A0x73b22ed1c7b80a13!2sCartago!5e0!3m2!1sen!2scr!4v1700000000000!5m2!1sen!2scr" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
              </div>
            </div>
          </div>
          <div class="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>&copy; 2026 Centro Educativo Adventista de Cartago. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
`;

const getBaseHtml = (title, content, extraScript = '') => `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | CEAC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
      body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 font-sans flex flex-col min-h-screen">
${navbarAndTopBar}
<main class="flex-grow">
${content}
</main>
${footer}
<script>
  lucide.createIcons();
  ${extraScript}
</script>
</body>
</html>`;

const pages = {
  'index.html': {
    title: 'Inicio',
    content: `
      <section class="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-32">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-emerald-600/20 blur-3xl opacity-50 pointer-events-none"></div>
        <div class="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div class="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <span class="text-3xl font-bold text-white">CEAC</span>
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">¿Está listo para dar el siguiente paso en la educación de su hijo?</h1>
          <p class="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl font-light">Educamos hoy la generación del mañana con una formación integral para cuerpo, mente y espíritu.</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="admision.html" class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-4 text-lg shadow-lg transition-all text-center">APLICAR AHORA</a>
            <a href="nosotros.html" class="border border-slate-600 text-slate-800 bg-white hover:bg-slate-100 rounded-full px-8 py-4 text-lg transition-all text-center">Conózcanos</a>
          </div>
        </div>
      </section>

      <section class="py-20 bg-white relative">
        <div class="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div class="lg:w-1/2">
            <div class="inline-block px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">Quiénes somos</div>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Institución misionera sin fines de lucro</h2>
            <p class="text-slate-600 mb-6 text-lg leading-relaxed">Somos parte de la red global de Educación Adventista. Ofrecemos formación integral desde una perspectiva espiritual y de valores, abierta a toda la comunidad.</p>
            <a href="nosotros.html" class="text-emerald-600 text-lg font-medium hover:underline flex items-center">Descubra nuestra historia <i data-lucide="arrow-right" class="ml-2 w-5 h-5"></i></a>
          </div>
          <div class="lg:w-1/2 w-full">
            <div class="aspect-video bg-slate-200 rounded-2xl overflow-hidden shadow-2xl relative flex items-center justify-center">
              <i data-lucide="monitor-play" class="w-12 h-12 text-slate-400"></i>
              <span class="absolute mt-20 text-slate-500 font-medium">Video/Imagen Institucional</span>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 bg-slate-50">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Nuestros Niveles</h2>
          <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div class="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden text-left flex flex-col">
              <div class="h-48 bg-emerald-100 flex items-center justify-center relative">
                <i data-lucide="trees" class="w-20 h-20 text-emerald-600"></i>
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <h3 class="text-2xl font-bold text-slate-900 mb-4">Preescolar</h3>
                <p class="text-slate-600 mb-8">Un ambiente seguro y estimulante donde los más pequeños desarrollan sus habilidades cognitivas y motoras.</p>
                <a href="niveles.html?nivel=preescolar" class="mt-auto block text-center border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 rounded-full py-2 font-medium">Ver detalles</a>
              </div>
            </div>
            <div class="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden text-left flex flex-col">
              <div class="h-48 bg-blue-100 flex items-center justify-center relative">
                <i data-lucide="book-open" class="w-20 h-20 text-blue-600"></i>
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <h3 class="text-2xl font-bold text-slate-900 mb-4">Primaria</h3>
                <p class="text-slate-600 mb-8">I y II Ciclos de Educación General Básica. Fomentamos el pensamiento crítico y la excelencia.</p>
                <a href="niveles.html?nivel=primaria" class="mt-auto block text-center border border-slate-200 hover:border-blue-600 hover:text-blue-700 rounded-full py-2 font-medium">Ver detalles</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  },
  'nosotros.html': {
    title: 'Nosotros',
    content: `
      <div class="bg-emerald-900 py-16 text-white text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Nosotros</h1>
        <p class="text-emerald-100 max-w-2xl mx-auto px-4">Conozca más sobre nuestra institución, nuestra historia y los valores que nos guían.</p>
      </div>

      <section class="py-20 bg-white">
        <div class="container mx-auto px-4 text-center max-w-3xl">
          <div class="inline-block px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">Nuestra Historia</div>
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Fundación e Inspiración</h2>
          <p class="text-slate-600 text-lg leading-relaxed mb-6">Fundado en 1983, el Centro Educativo Adventista de Cartago (CEAC) nació con el propósito de ofrecer una educación diferente. Somos una institución misionera sin fines de lucro.</p>
        </div>
      </section>

      <section class="py-20 bg-slate-50">
        <div class="container mx-auto px-4 grid md:grid-cols-3 gap-8 max-w-6xl">
          <div class="bg-white shadow-lg rounded-2xl p-10 text-center flex flex-col items-center">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"><i data-lucide="target" class="w-8 h-8"></i></div>
            <h3 class="text-2xl font-bold mb-4">Nuestra Misión</h3>
            <p class="text-slate-600">Proveer una educación integral y redentora, que restaure la imagen de Dios en los estudiantes.</p>
          </div>
          <div class="bg-emerald-700 text-white shadow-xl rounded-2xl p-10 text-center flex flex-col items-center transform md:-translate-y-4">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6"><i data-lucide="book-open" class="w-8 h-8"></i></div>
            <h3 class="text-2xl font-bold mb-4">Nuestra Visión</h3>
            <p class="text-emerald-50">Ser una institución educativa líder en Cartago, reconocida por su excelencia académica y valores.</p>
          </div>
          <div class="bg-white shadow-lg rounded-2xl p-10 text-center flex flex-col items-center">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"><i data-lucide="heart" class="w-8 h-8"></i></div>
            <h3 class="text-2xl font-bold mb-4">Nuestros Valores</h3>
            <p class="text-slate-600">Amor, respeto, integridad, servicio, responsabilidad y excelencia.</p>
          </div>
        </div>
      </section>
    `
  },
  'niveles.html': {
    title: 'Niveles Académicos',
    content: `
      <div class="bg-emerald-900 py-12 text-white text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Niveles Académicos</h1>
      </div>

      <div class="bg-white border-b border-slate-200">
        <div class="container mx-auto px-4 flex justify-center space-x-8">
          <button id="btnPreescolar" class="py-4 px-2 font-semibold text-lg border-b-4 border-emerald-600 text-emerald-700" onclick="showLevel('preescolar')">Preescolar</button>
          <button id="btnPrimaria" class="py-4 px-2 font-semibold text-lg border-b-4 border-transparent text-slate-500 hover:text-blue-600" onclick="showLevel('primaria')">Primaria</button>
        </div>
      </div>

      <section class="py-16 bg-slate-50">
        <div class="container mx-auto px-4 max-w-6xl grid lg:grid-cols-3 gap-10">
          
          <!-- Content Left -->
          <div class="lg:col-span-2 space-y-10" id="content-container">
             <!-- Se llena con JS -->
          </div>

          <!-- Sidebar Right -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow-xl rounded-xl overflow-hidden sticky top-8">
              <div class="h-2 bg-emerald-600" id="sidebar-bar"></div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-slate-900 mb-2">Descargar Brochure</h3>
                <p class="text-sm text-slate-500 mb-6">Complete el formulario para descargar el PDF.</p>
                <form class="space-y-4" onsubmit="event.preventDefault(); alert('PDF Descargado exitosamente.')">
                  <div>
                    <label class="block text-sm font-medium mb-1">Nombre Completo</label>
                    <input type="text" required class="w-full border rounded-md px-3 py-2">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Correo Electrónico</label>
                    <input type="email" required class="w-full border rounded-md px-3 py-2">
                  </div>
                  <button type="submit" class="w-full bg-emerald-600 text-white rounded-md py-2 mt-4 hover:bg-emerald-700" id="btn-download">Descargar PDF</button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </section>
    `,
    extraScript: `
      const data = {
        preescolar: {
          title: 'Educación Preescolar',
          color: 'emerald',
          desc: 'Nuestro programa de preescolar está diseñado para estimular el desarrollo integral de los niños en un ambiente seguro.',
          niveles: ['Maternal', 'Interactivo I', 'Interactivo II', 'Transición (Preparatoria)'],
          reqs: ['Copia del acta de nacimiento', 'Constancia de vacunas', 'Edad requerida cumplida al 15 de febrero']
        },
        primaria: {
          title: 'Educación Primaria',
          color: 'blue',
          desc: 'La educación primaria fomenta el pensamiento crítico, la excelencia académica y el desarrollo del carácter.',
          niveles: ['Primer Grado', 'Segundo Grado', 'Tercer Grado', 'Cuarto Grado', 'Quinto Grado', 'Sexto Grado'],
          reqs: ['Copia del acta de nacimiento', 'Constancia de vacunas', 'Notas o informe al hogar del año anterior']
        }
      };

      function showLevel(level) {
        const d = data[level];
        document.getElementById('btnPreescolar').className = \`py-4 px-2 font-semibold text-lg border-b-4 \${level === 'preescolar' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-emerald-600'}\`;
        document.getElementById('btnPrimaria').className = \`py-4 px-2 font-semibold text-lg border-b-4 \${level === 'primaria' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-blue-600'}\`;
        
        document.getElementById('sidebar-bar').className = \`h-2 bg-\${d.color}-600\`;
        document.getElementById('btn-download').className = \`w-full bg-\${d.color}-600 text-white rounded-md py-2 mt-4 hover:bg-\${d.color}-700\`;

        const badges = d.niveles.map(n => \`<span class="px-3 py-1 rounded-full text-sm font-medium border bg-\${d.color}-100 text-\${d.color}-800 border-\${d.color}-200">\${n}</span>\`).join('');
        const list = d.reqs.map(r => \`<li class="flex items-start"><i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-500 mr-3"></i><span>\${r}</span></li>\`).join('');

        document.getElementById('content-container').innerHTML = \`
          <div class="bg-white shadow-md rounded-xl p-8">
            <h2 class="text-3xl font-bold mb-4 text-\${d.color}-700">\${d.title}</h2>
            <p class="text-slate-600 text-lg mb-6">\${d.desc}</p>
            <h3 class="text-xl font-bold mb-4">Niveles Ofrecidos</h3>
            <div class="flex flex-wrap gap-3 mb-6">\${badges}</div>
            <div class="bg-slate-100 p-4 rounded-lg"><strong>Horario:</strong> // TODO Horario</div>
          </div>
          <div class="bg-white shadow-md rounded-xl p-8">
            <h3 class="text-2xl font-bold mb-6">Requisitos de Admisión</h3>
            <ul class="space-y-4">\${list}</ul>
          </div>
        \`;
        lucide.createIcons();
      }

      const params = new URLSearchParams(window.location.search);
      showLevel(params.get('nivel') === 'primaria' ? 'primaria' : 'preescolar');
    `
  },
  'anuncios.html': {
    title: 'Anuncios',
    content: `
      <div class="bg-emerald-900 py-12 text-white text-center">
        <h1 class="text-4xl font-bold mb-4">Anuncios</h1>
        <p class="text-emerald-100">Calendario de Actividades</p>
      </div>
      <section class="py-16 bg-slate-50 min-h-screen">
        <div class="container mx-auto px-4 max-w-4xl space-y-6">
          <div class="bg-white shadow-md rounded-xl flex flex-col md:flex-row overflow-hidden">
            <div class="bg-slate-100 md:w-48 p-6 flex flex-col items-center justify-center">
              <span class="text-sm font-bold text-slate-500 uppercase">Mayo</span>
              <span class="text-4xl font-black text-emerald-700">01</span>
            </div>
            <div class="p-6 md:p-8 flex-1">
              <span class="px-3 py-1 rounded-full text-xs font-bold border bg-red-100 text-red-700 border-red-200 uppercase inline-block mb-3">Feriado</span>
              <h3 class="text-xl font-bold mb-2">Día del Trabajador</h3>
              <p class="text-slate-600">No habrá lecciones por motivo del feriado nacional del Día del Trabajador.</p>
            </div>
          </div>
          <div class="bg-white shadow-md rounded-xl flex flex-col md:flex-row overflow-hidden">
            <div class="bg-slate-100 md:w-48 p-6 flex flex-col items-center justify-center">
              <span class="text-sm font-bold text-slate-500 uppercase">Julio</span>
              <span class="text-4xl font-black text-emerald-700">24</span>
            </div>
            <div class="p-6 md:p-8 flex-1">
              <span class="px-3 py-1 rounded-full text-xs font-bold border bg-blue-100 text-blue-700 border-blue-200 uppercase inline-block mb-3">Acto Cívico</span>
              <h3 class="text-xl font-bold mb-2">Anexión de Nicoya</h3>
              <p class="text-slate-600">Invitamos a los estudiantes a venir con traje típico para conmemorar la Anexión del Partido de Nicoya.</p>
            </div>
          </div>
        </div>
      </section>
    `
  },
  'uniformes.html': {
    title: 'Uniformes',
    content: `
      <div class="bg-emerald-900 py-12 text-white text-center">
        <h1 class="text-4xl font-bold mb-4">Uniformes</h1>
      </div>
      <section class="py-16 bg-slate-50 min-h-screen text-center">
        <h2 class="text-2xl font-bold mb-6">Catálogo de Uniformes</h2>
        <p class="text-slate-600 mb-8">Esta sección cuenta con carritos de compra que requieren de React o Javascript avanzado.<br/>En la versión HTML estática se mostrará un catálogo informativo.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <div class="bg-white p-4 shadow-md rounded-lg">
             <div class="bg-slate-200 h-48 mb-4 rounded flex items-center justify-center">Foto</div>
             <h3 class="font-bold">Camiseta Polo</h3>
             <p class="text-emerald-600 font-bold">₡8,500</p>
             <button class="w-full bg-slate-900 text-white rounded mt-4 py-2" onclick="alert('Funcionalidad de carrito requiere JS avanzado/React')">Agregar</button>
          </div>
        </div>
      </section>
    `
  },
  'blog.html': {
    title: 'Blog',
    content: `
      <div class="bg-emerald-900 py-12 text-white text-center">
        <h1 class="text-4xl font-bold mb-4">Blog Institucional</h1>
      </div>
      <section class="py-16 bg-slate-50 min-h-screen">
        <div class="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer">
            <div class="h-48 bg-slate-200 flex items-center justify-center"><i data-lucide="image" class="w-10 h-10 text-slate-400"></i></div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">Feria de Robótica 2025</h3>
              <p class="text-slate-600 text-sm mb-4">Nuestros estudiantes deslumbraron con proyectos innovadores...</p>
              <a href="#" class="text-emerald-600 font-bold">Leer más</a>
            </div>
          </div>
        </div>
      </section>
    `
  },
  'admision.html': {
    title: 'Admisión',
    content: `
      <div class="bg-emerald-900 py-12 text-white text-center">
        <h1 class="text-4xl font-bold mb-4">Admisión</h1>
      </div>
      <section class="py-16 bg-slate-50 min-h-screen">
        <div class="container mx-auto max-w-4xl bg-white p-8 rounded-xl shadow-md">
          <h2 class="text-2xl font-bold mb-6 border-b pb-2">Formulario de Solicitud</h2>
          <form onsubmit="event.preventDefault(); alert('Solicitud enviada (Simulación)');">
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div><label class="block mb-1 font-medium">Nombre del Estudiante</label><input type="text" class="w-full border rounded p-2" required></div>
              <div><label class="block mb-1 font-medium">Nivel a Ingresar</label>
                <select class="w-full border rounded p-2" required>
                  <option>Preescolar</option>
                  <option>Primaria</option>
                </select>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div><label class="block mb-1 font-medium">Nombre del Encargado</label><input type="text" class="w-full border rounded p-2" required></div>
              <div><label class="block mb-1 font-medium">Teléfono</label><input type="tel" class="w-full border rounded p-2" required></div>
            </div>
            <button class="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full">Enviar Solicitud</button>
          </form>
        </div>
      </section>
    `
  },
  'contacto.html': {
    title: 'Contacto',
    content: `
      <div class="bg-emerald-900 py-12 text-white text-center">
        <h1 class="text-4xl font-bold mb-4">Contacto</h1>
      </div>
      <section class="py-16 bg-slate-50 min-h-screen">
        <div class="container mx-auto px-4 max-w-6xl grid lg:grid-cols-2 gap-12">
          <div class="bg-white p-8 rounded-xl shadow-md">
             <h2 class="text-2xl font-bold mb-4">Envíenos un mensaje</h2>
             <form onsubmit="event.preventDefault(); alert('Mensaje enviado')">
                <input type="text" placeholder="Nombre" class="w-full border rounded p-2 mb-4" required>
                <input type="email" placeholder="Correo" class="w-full border rounded p-2 mb-4" required>
                <textarea placeholder="Mensaje" class="w-full border rounded p-2 mb-4 h-32" required></textarea>
                <button class="w-full bg-emerald-600 text-white rounded py-3">Enviar</button>
             </form>
          </div>
          <div class="space-y-6">
             <div class="bg-white p-6 rounded-xl shadow-md">
                <h3 class="font-bold">Teléfono / WhatsApp</h3>
                <p>+506 8306-9777</p>
             </div>
             <div class="bg-white p-6 rounded-xl shadow-md">
                <h3 class="font-bold">Dirección</h3>
                <p>Cartago, Costa Rica.</p>
             </div>
          </div>
        </div>
      </section>
    `
  }
};

for (const [filename, page] of Object.entries(pages)) {
    fs.writeFileSync(path.join(outputDir, filename), getBaseHtml(page.title, page.content, page.extraScript));
}

console.log('HTML files generated successfully in: ' + outputDir);
