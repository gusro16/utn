(async()=>{
  const res=await fetch('../index.html');
  if(!res.ok) throw new Error('No se pudo cargar la base del sitio');
  const raw=await res.text();
  const doc=new DOMParser().parseFromString(raw,'text/html');
  const q=(sel)=>doc.querySelector(sel);

  let seguimientoData=null;
  try{
    const seguimientoRes=await fetch('seguimiento-6f.json',{cache:'no-store'});
    if(seguimientoRes.ok) seguimientoData=await seguimientoRes.json();
  }catch(err){
    console.warn('No se pudo cargar el seguimiento de 6F',err);
  }

  q('title').textContent='6F · Ruta Proyecto Web';
  const meta=q('meta[name="description"]'); if(meta) meta.content='Centro de acompañamiento para el Proyecto Web de 6F.';
  q('.brand-mark').textContent='6F';
  const brand=q('.brand > div:nth-child(2)'); brand.innerHTML='<strong>Proyecto Web 6F</strong><span>Diseño Web · Centro de acompañamiento</span>';
  q('.topbar .eyebrow').textContent='DISEÑO WEB · 6F';

  // La entrega institucional de 6N no forma parte del sitio 6F.
  doc.querySelector('.nav-btn[data-view="entrega"]')?.remove();
  doc.querySelector('.quick[data-target="entrega"]')?.remove();
  doc.querySelector('#entrega')?.remove();
  doc.querySelector('#deliveryStyle')?.remove();
  doc.querySelector('#deliveryLogic')?.remove();

  // Repositorio oficial 6F conectado al Apps Script institucional.
  const REPO_URL='https://script.google.com/a/macros/northfield.edu.ar/s/AKfycbyRI-VhT1gd1q4C4vuag9_OzdUInk2q0i2G5FoJfBnxu9pMoMu7p3_VirSoosqJnog1Tg/exec';

  const navEntrega=doc.createElement('button');
  navEntrega.className='nav-btn';
  navEntrega.dataset.view='entrega6f';
  navEntrega.innerHTML='📁 <span>Repositorio</span>';
  const navDefensa=doc.querySelector('.nav-btn[data-view="defensa"]');
  if(navDefensa) navDefensa.before(navEntrega); else doc.querySelector('.nav').append(navEntrega);

  const entrega=doc.createElement('section');
  entrega.id='entrega6f';
  entrega.className='view';
  entrega.dataset.title='Repositorio oficial del proyecto';
  entrega.innerHTML=`
    <div class="content-header">
      <div>
        <p class="eyebrow">PROYECTO WEB · 6F</p>
        <h2>Mantené actualizado el proyecto de tu equipo</h2>
        <p>Este es el repositorio oficial de seguimiento. Subí la <strong>carpeta completa del proyecto</strong> cada vez que haya avances importantes.</p>
      </div>
    </div>
    <div class="card" style="padding:28px 30px;border-left:5px solid #2563eb">
      <h3 style="margin-top:0">📁 Repositorio oficial</h3>
      <p>Seleccioná tu equipo y actualizá la carpeta del proyecto. La versión más reciente queda en <strong>ACTUAL</strong> y el sistema conserva evidencia de versiones anteriores para poder seguir el proceso.</p>
      <a class="primary" href="${REPO_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:10px;margin:14px 0;padding:15px 22px;text-decoration:none;font-size:1.05rem">📤 Actualizar mi proyecto ↗</a>
      <p style="margin:4px 0 0;color:#475569"><strong>Importante:</strong> trabajá sobre la carpeta real del equipo y subí esa misma carpeta. No hace falta completar Trello o el Sheet para registrar el avance.</p>
    </div>
    <div class="card" style="padding:24px 28px;margin-top:18px">
      <h3 style="margin-top:0">✅ Antes de actualizar</h3>
      <ul class="clean-list">
        <li>Elegí correctamente tu <strong>equipo</strong>.</li>
        <li>Seleccioná la <strong>carpeta completa</strong> del proyecto.</li>
        <li>Revisá la lista de archivos antes de confirmar.</li>
        <li>Esperá a que aparezca el mensaje de actualización terminada.</li>
        <li>Si todavía falta <code>index.html</code> o algún requisito, podés actualizar igualmente: este repositorio también registra el <strong>proceso</strong>.</li>
      </ul>
    </div>
    <div class="card" style="padding:22px 26px;margin-top:18px;background:#f8fafc">
      <strong>¿Para qué sirve?</strong>
      <p style="margin:7px 0 0">Las revisiones de avance se harán sobre esta carpeta oficial. Así se puede comparar qué cambió entre una revisión y la siguiente y valorar correcciones, organización y progreso real.</p>
    </div>
  `;
  doc.querySelector('footer').before(entrega);

  const quickEntrega=doc.createElement('button');
  quickEntrega.className='quick card jump';
  quickEntrega.dataset.target='entrega6f';
  quickEntrega.innerHTML='<span>📁</span><strong>Mi repositorio</strong><small>Actualizar la carpeta oficial del proyecto</small>';
  const grid=q('#inicio .quick-grid');
  if(grid) grid.append(quickEntrega);


  // Seguimiento docente: corte parcial por equipo, actualizado desde un archivo separado.
  const navSeguimiento=doc.createElement('button');
  navSeguimiento.className='nav-btn';
  navSeguimiento.dataset.view='seguimiento6f';
  navSeguimiento.innerHTML='📝 <span>Seguimiento</span>';
  if(navDefensa) navDefensa.before(navSeguimiento); else doc.querySelector('.nav').append(navSeguimiento);

  const seguimiento=doc.createElement('section');
  seguimiento.id='seguimiento6f'; seguimiento.className='view'; seguimiento.dataset.title='Seguimiento docente del proyecto';
  const esc=(v)=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const equipos=Array.isArray(seguimientoData?.equipos)?seguimientoData.equipos:[];
  const opciones=equipos.map(e=>'<option value="'+esc(e.equipo)+'">Equipo '+esc(e.equipo)+' · '+esc(e.beneficiario)+'</option>').join('');
  const tarjetas=equipos.map(e=>{
    const estado=Number(e.nota)>=7?'Aprobado':'Por debajo de 7';
    return '<article class="card teacher-team-card" data-team="'+esc(e.equipo)+'">'+
      '<div class="teacher-summary"><div><p class="eyebrow">EQUIPO '+esc(e.equipo)+'</p><h3>'+esc(e.beneficiario)+'</h3><small>Revisión: '+esc(seguimientoData?.actualizado||'')+'</small><div class="teacher-evidence"><span><b>Entrega:</b> '+esc(e.estadoEntrega||'Sin dato')+'</span><span><b>Última actualización detectada:</b> '+esc(e.ultimaActualizacion||'Sin dato')+'</span></div></div><div class="teacher-score"><strong>'+Number(e.nota).toFixed(1)+'</strong><span>/ 10</span><small>'+estado+'</small></div></div>'+
      '<div class="teacher-rubric-grid">'+
        '<div><span>HTML</span><strong>'+esc(e.html)+'/10</strong><small>25%</small></div>'+
        '<div><span>CSS</span><strong>'+esc(e.css)+'/10</strong><small>25%</small></div>'+
        '<div><span>Funcionalidad</span><strong>'+esc(e.funcionalidad)+'/10</strong><small>20%</small></div>'+
        '<div><span>Organización</span><strong>'+esc(e.organizacion)+'/10</strong><small>15%</small></div>'+
        '<div><span>Avance</span><strong>'+esc(e.avance)+'/10</strong><small>15%</small></div>'+
      '</div>'+
      '<div class="teacher-feedback"><h4>Devolución</h4><p>'+esc(e.devolucion)+'</p><h4>Para la próxima revisión</h4><p>'+esc(e.prioridad)+'</p></div>'+
    '</article>';
  }).join('');
  seguimiento.innerHTML=
    '<div class="content-header"><div><p class="eyebrow">SEGUIMIENTO DOCENTE · 6F</p><h2>Revisá cómo viene tu proyecto</h2><p>La devolución se actualiza en las clases de lunes y viernes. Es una <strong>nota parcial y temporal</strong>: puede cambiar a medida que corrijan y avancen.</p></div></div>'+
    '<div class="card teacher-note"><strong>Entrega final: '+esc(seguimientoData?.entrega||'13/11/2026')+'</strong><p>No se muestran nombres de estudiantes. Elegí tu equipo para ver la última revisión.</p></div>'+
    '<div class="card teacher-controls"><label for="teacherTeam6f">Equipo</label><select id="teacherTeam6f"><option value="">Elegí tu equipo</option>'+opciones+'</select></div>'+
    '<div id="teacherEmpty6f" class="card teacher-empty">Elegí un equipo para ver su nota parcial, la rúbrica y la devolución.</div>'+tarjetas;
  doc.querySelector('footer').before(seguimiento);

  const seguimientoStyles=doc.createElement('style');
  seguimientoStyles.textContent=`
    #seguimiento6f .teacher-note{padding:18px 22px;border-left:5px solid #2563eb;margin-bottom:16px}
    #seguimiento6f .teacher-note p{margin:6px 0 0}
    #seguimiento6f .teacher-controls{padding:20px 22px;margin-bottom:16px;display:grid;gap:8px;max-width:560px}
    #seguimiento6f .teacher-controls label{font-weight:800}
    #seguimiento6f .teacher-controls select{width:100%;padding:12px 14px;border:1px solid #bac6d7;border-radius:10px;background:white;font:inherit}
    #seguimiento6f .teacher-empty{padding:22px;color:#475569}
    #seguimiento6f .teacher-team-card{display:none;padding:24px 26px}
    #seguimiento6f .teacher-team-card.active{display:block}
    #seguimiento6f .teacher-summary{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;border-bottom:1px solid #e2e8f0;padding-bottom:18px}
    #seguimiento6f .teacher-summary h3{margin:3px 0 4px}
    #seguimiento6f .teacher-evidence{display:grid;gap:4px;margin-top:10px;font-size:13px;color:#475569}
    #seguimiento6f .teacher-score{min-width:112px;text-align:center;border:1px solid #cbd5e1;border-radius:14px;padding:12px;background:#f8fafc}
    #seguimiento6f .teacher-score strong{display:block;font-size:30px;line-height:1}
    #seguimiento6f .teacher-score span,#seguimiento6f .teacher-score small{display:block;color:#64748b;margin-top:4px}
    #seguimiento6f .teacher-rubric-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin:18px 0}
    #seguimiento6f .teacher-rubric-grid>div{border:1px solid #dbe3ee;border-radius:12px;padding:13px;background:#f8fafc;display:grid;gap:4px}
    #seguimiento6f .teacher-rubric-grid span{font-size:13px;color:#475569}
    #seguimiento6f .teacher-rubric-grid strong{font-size:18px}
    #seguimiento6f .teacher-rubric-grid small{color:#64748b}
    #seguimiento6f .teacher-feedback{display:grid;gap:6px}
    #seguimiento6f .teacher-feedback h4{margin:10px 0 0}
    #seguimiento6f .teacher-feedback p{margin:0;line-height:1.55}
    @media(max-width:780px){#seguimiento6f .teacher-rubric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#seguimiento6f .teacher-summary{flex-direction:column}.teacher-score{align-self:flex-start}}
  `;
  doc.head.append(seguimientoStyles);

  const seguimientoLogic=doc.createElement('script');
  seguimientoLogic.textContent=`
    (()=>{const select=document.getElementById('teacherTeam6f'),empty=document.getElementById('teacherEmpty6f');if(!select)return;const cards=[...document.querySelectorAll('#seguimiento6f .teacher-team-card')];function show(){const value=select.value;cards.forEach(c=>c.classList.toggle('active',c.dataset.team===value));if(empty)empty.style.display=value?'none':'block';}select.addEventListener('change',show);show();})();
  `;
  doc.body.append(seguimientoLogic);

  const quickSeguimiento=doc.createElement('button');
  quickSeguimiento.className='quick card jump'; quickSeguimiento.dataset.target='seguimiento6f';
  quickSeguimiento.innerHTML='<span>📝</span><strong>Mi devolución</strong><small>Nota parcial, rúbrica y próximo paso</small>';
  if(grid) grid.append(quickSeguimiento);

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
