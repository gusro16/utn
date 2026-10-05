(async()=>{
  const res=await fetch('../index.html');
  if(!res.ok) throw new Error('No se pudo cargar la base del sitio');
  const raw=await res.text();
  const doc=new DOMParser().parseFromString(raw,'text/html');
  const q=(sel)=>doc.querySelector(sel);

  q('title').textContent='6F · Ruta Proyecto Web';
  const meta=q('meta[name="description"]'); if(meta) meta.content='Centro de acompañamiento para el Proyecto Web de 6F.';
  q('.brand-mark').textContent='6F';
  const brand=q('.brand > div:nth-child(2)'); brand.innerHTML='<strong>Proyecto Web 6F</strong><span>Diseño Web · Centro de acompañamiento</span>';
  q('.topbar .eyebrow').textContent='DISEÑO WEB · 6F';

  const navBtns=[...doc.querySelectorAll('.nav-btn')];
  const navCond=navBtns.find(b=>b.dataset.view==='utn'); if(navCond) navCond.querySelector('span').textContent='Condiciones del proyecto';
  const navRub=navBtns.find(b=>b.dataset.view==='rubrica'); if(navRub) navRub.querySelector('span').textContent='Rúbrica de evaluación';
  const navDef=navBtns.find(b=>b.dataset.view==='defensa'); if(navDef) navDef.querySelector('span').textContent='Defensa oral';

  q('#inicio .hero h2').textContent='Que no te pierdas: sabé dónde estás, qué sigue y qué necesita tu proyecto.';
  const deadline=q('.deadline-box'); deadline.querySelector('strong').textContent='13 NOV'; deadline.querySelector('small').textContent='Entrega final del sitio';
  const quick=[...doc.querySelectorAll('.quick-grid .quick')];
  const status=quick.find(x=>x.dataset.target==='utn'); if(status){status.querySelector('strong').textContent='Estado de mi proyecto';status.querySelector('small').textContent='Requisitos y chequeo de archivos';}
  const rubq=quick.find(x=>x.dataset.target==='rubrica'); if(rubq) rubq.querySelector('strong').textContent='Rúbrica de evaluación';
  const context=doc.createElement('div'); context.className='card compact-tip'; context.innerHTML='<strong>🎯 Contexto 6F:</strong> este proyecto tiene un <strong>beneficiario real</strong>. Además de que el código funcione, revisá si la información, la navegación y la propuesta visual realmente le sirven. El <strong>benchmarking</strong> sirve para comparar referentes y tomar decisiones propias, no para copiar.';
  q('#inicio .grid-2').before(context);
  const oralHome=doc.createElement('div'); oralHome.className='card compact-tip'; oralHome.innerHTML='<strong>🗣️ Después de entregar:</strong> las defensas orales serán el <strong>16 y 20 de noviembre</strong>. Cada equipo tendrá <strong>5 a 7 minutos</strong>. Habrá una <strong>nota grupal</strong> y una <strong>nota individual</strong>, con preguntas breves sobre el desarrollo y el código utilizado.';
  context.after(oralHome);

  const routeSec=q('#ruta'); routeSec.dataset.title='Ruta de trabajo, entrega y defensa'; routeSec.querySelector('.intro-line h2').textContent='Más tiempo, pero con una meta clara por etapa';
  const cal=routeSec.querySelector('.compact-tip'); cal.innerHTML='<strong>Fechas a tener en cuenta:</strong> <strong>12/10</strong> es feriado nacional; <strong>9/11</strong> es feriado nacional y <strong>11/11</strong> es feriado en la Provincia de Buenos Aires por la visita del papa León XIV. La <strong>entrega final del sitio es el 13/11</strong>. Las <strong>defensas orales serán el 16/11 y el 20/11</strong>. El Día de la Soberanía Nacional de 2026 se traslada al 23/11, por lo que el 20/11 queda disponible para la segunda jornada de defensa.';

  const temario=[...doc.querySelectorAll('#contentFilters .chip')].find(b=>b.dataset.filter==='temario'); if(temario) temario.textContent='Temario';

  const cond=q('#utn'); cond.dataset.title='Condiciones y chequeo del proyecto';
  const ch=cond.querySelector('.content-header'); ch.querySelector('.eyebrow').textContent='PROYECTO WEB · 6F'; ch.querySelector('p:last-child').textContent='El chequeo automático busca evidencia en tus archivos. No decide si el diseño está bien, no otorga una nota y no reemplaza la revisión docente ni la explicación del proyecto.';
  const metrics=[...cond.querySelectorAll('.metric')]; if(metrics[2]) metrics[2].innerHTML='<span>🧠</span><strong>Defensa oral</strong><small>Nota grupal + individual</small>';
  const banners=[...cond.querySelectorAll('.official-banner')];
  banners[0].innerHTML='<strong>Cómo leer el estado del proyecto</strong>Los Contenidos Básicos Obligatorios (CBO) funcionan como una guía de mínimos técnicos que conviene tener resueltos en conjunto. El porcentaje del analizador sirve solo para revisar <b>evidencia técnica detectable</b>: no incluye por sí solo la valoración visual/estética, la calidad de la propuesta para el beneficiario ni la defensa oral.';
  const reqs=[...cond.querySelectorAll('.req-card')];
  if(reqs[4]) reqs[4].innerHTML='<strong>🚫 Sin plantillas ni Bootstrap</strong><small>El proyecto tiene que mostrar apropiación real de los contenidos trabajados.</small>';
  if(reqs[6]) reqs[6].innerHTML='<strong>🤝 Beneficiario real</strong><small>El sitio debe responder a una necesidad concreta del beneficiario elegido por el equipo.</small>';
  if(reqs[7]) reqs[7].innerHTML='<strong>🔎 Benchmarking</strong><small>Revisá referentes del mismo rubro y justificá qué decisiones tomaste para tu propia propuesta.</small>';
  const delivery=cond.querySelector('.grid-2 .card:nth-child(2) ul');
  delivery.innerHTML='<li>Trabajá siempre sobre la <strong>carpeta oficial del equipo en Google Drive</strong>, no sobre copias del Escritorio o Descargas.</li><li>Prepará una <strong>versión final ordenada</strong> del proyecto y una copia de respaldo antes de entregar.</li><li>Confirmá que <code>index.html</code> sea la página inicial y esté escrito en minúsculas.</li><li>Probalo desde otra computadora: páginas, enlaces, documentos, imágenes, audio y video.</li><li>Revisá que el contenido responda al <strong>beneficiario real</strong> y que las decisiones tomadas tengan sentido para ese público.</li><li>Volvé al <strong>benchmarking</strong>: compará navegación, organización, estética y contenidos con referentes del rubro sin copiar soluciones.</li><li>Entregá por el canal indicado en Classroom <strong>como máximo el 13 de noviembre</strong>.</li><li>Después de entregar, prepará la <strong>defensa oral del 16 o 20 de noviembre</strong>.</li><li>Cada integrante debe poder explicar las partes principales del proyecto y las decisiones tomadas.</li>';

  const rub=q('#rubrica'); rub.dataset.title='Rúbrica interactiva de evaluación';
  const rh=rub.querySelector('.content-header'); rh.querySelector('.eyebrow').textContent='RÚBRICA DE EVALUACIÓN · FUNDAMENTOS'; rh.querySelector('h2').textContent='Entendé cómo se va a evaluar tu proyecto'; rh.querySelector('p:last-child').textContent='Elegí en cada criterio el descriptor que más se parece hoy a tu proyecto. Es una autoevaluación para orientarte: no calcula ni reemplaza la calificación docente.';
  rub.querySelector('.gate-box small').textContent='Tomalos como los mínimos técnicos que deberían estar presentes en conjunto. Usá esta rúbrica para descubrir qué criterio todavía necesita trabajo.';
  rub.querySelector('.official-banner').innerHTML='<strong>Cómo interpretar esta autoevaluación</strong>La rúbrica combina criterios objetivos y otros de valoración. Los requisitos técnicos pueden comprobarse parcialmente con los archivos, pero la <b>presentación visual, estética, organización de la información, legibilidad, coherencia y calidad de interfaz no se pueden convertir en una medición automática exacta</b>. Esa parte debe revisarse mirando el sitio y comparándolo con los descriptores de la rúbrica. Por eso, un porcentaje técnico alto nunca equivale por sí solo a un proyecto terminado o aprobado.';

  const defense=q('#defensa');
  if(defense){
    defense.dataset.title='Preparar la defensa oral';
    const dh=defense.querySelector('.content-header');
    if(dh){
      const eye=dh.querySelector('.eyebrow'); if(eye) eye.textContent='DEFENSA ORAL · 16 Y 20 DE NOVIEMBRE';
      const h2=dh.querySelector('h2'); if(h2) h2.textContent='5 a 7 minutos para demostrar que entienden lo que construyeron';
      const p=dh.querySelector('p:last-child'); if(p) p.textContent='La defensa es por equipo, pero también se evalúa individualmente el dominio de cada integrante. No alcanza con mostrar que el sitio funciona: tienen que poder fundamentar decisiones y explicar el código utilizado.';
    }
    const info=doc.createElement('div');
    info.className='official-banner';
    info.innerHTML='<strong>Modalidad</strong><b>Fechas:</b> 16 y 20 de noviembre · <b>Duración:</b> 5 a 7 minutos reloj por equipo · <b>Evaluación:</b> una nota grupal y una nota individual. Durante o al finalizar la exposición habrá <b>preguntas breves</b> para comprobar comprensión.';
    const prep=doc.createElement('div');
    prep.className='grid-2';
    prep.innerHTML='<div class="card"><div class="section-head"><div><p class="eyebrow">EN 5–7 MINUTOS</p><h3>Qué deberían poder mostrar</h3></div></div><ul class="clean-list"><li>Cuál era la necesidad del <strong>beneficiario</strong> y qué objetivo tuvo el sitio.</li><li>Cómo está organizado y cómo se recorre.</li><li>Qué decisiones importantes tomaron con <strong>HTML y CSS</strong>.</li><li>Mostrar ejemplos reales de código del propio proyecto y explicar qué hacen.</li><li>Contar al menos una dificultad que tuvieron y cómo la resolvieron.</li><li>Participación de <strong>ambos integrantes</strong>.</li></ul></div><div class="card"><div class="section-head"><div><p class="eyebrow">DOS NOTAS</p><h3>Qué se mira</h3></div></div><ul class="clean-list"><li><strong>Nota grupal:</strong> resultado del proyecto, coherencia de la propuesta, funcionamiento y calidad general de la defensa.</li><li><strong>Nota individual:</strong> comprensión del código, capacidad para explicar decisiones y respuestas a las preguntas.</li><li>No conviene dividir el proyecto en “mi parte / tu parte”: cualquiera puede ser consultado sobre distintas partes del sitio.</li></ul></div>';
    const anchor=dh || defense.firstElementChild;
    if(anchor){anchor.after(info);info.after(prep);} else {defense.prepend(prep);defense.prepend(info);}
  }

  q('footer').textContent='Proyecto Web 6F · Material de acompañamiento · Diseño Web 2026';
  const oldLoader=[...doc.querySelectorAll('script[src]')].find(x=>x.getAttribute('src')==='app-loader.js'); if(oldLoader) oldLoader.remove();
  const link=q('link[href="style.css"]'); if(link) link.setAttribute('href','../style.css');
  const app=doc.createElement('script'); app.src='app-6f.js'; doc.body.appendChild(app);
  let html='<!doctype html>\n'+doc.documentElement.outerHTML;
  html=html.split('UTN.BA').join('').split('UTN').join('');
  document.open(); document.write(html); document.close();
})().catch(err=>{
  console.error(err);
  document.body.innerHTML='<main style="font-family:Arial;padding:2rem"><h1>No se pudo cargar el sitio de 6F</h1><p>Recargá la página. Si el problema continúa, avisale al profesor.</p></main>';
});
