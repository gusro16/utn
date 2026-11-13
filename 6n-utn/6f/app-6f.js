(async()=>{
  const files=['../app-part-01.txt','../app-part-02.txt','../app-part-03.txt','../app-part-04.txt','../app-part-05.txt','../app-part-06.txt','../app-part-07.txt'];
  const parts=await Promise.all(files.map(f=>fetch(f).then(r=>{if(!r.ok) throw new Error('No se pudo cargar '+f); return r.text();})));
  let code=parts.join('');

  const route=`const DELIVERY = new Date('2026-11-13T23:59:59-03:00');
const routeSteps = [
  {date:'2026-10-05', label:'5/10', title:'Diagnóstico y orden', desc:'Confirmar el estado real de cada proyecto, ordenar archivos y verificar que la estructura general del sitio funcione.', tasks:['Abrir todas las páginas','Comprobar navegación básica','Confirmar CSS vinculado','Ordenar archivos y recursos']},
  {date:'2026-10-12', label:'12/10', title:'Feriado nacional', desc:'Día del Respeto a la Diversidad Cultural. No se cuenta como jornada de clase.', tasks:['No se planifica avance de clase para esta fecha.'], noClass:true},
  {date:'2026-10-16', label:'16/10', title:'Estructura y requisitos prioritarios', desc:'Cerrar estructura general, navegación y requisitos técnicos que todavía estén pendientes.', tasks:['Revisar condiciones del proyecto','Completar estructura y navegación','Resolver faltantes técnicos prioritarios','No incorporar código que no puedan explicar']},
  {date:'2026-10-19', label:'19/10', title:'Aplicación de contenidos', desc:'Transformar los contenidos vistos o pendientes en partes concretas del sitio.', tasks:['Avanzar formulario y tabla','Revisar enlaces, anclas y mailto','Incorporar multimedia cuando corresponda','Comprobar cada cambio en el navegador']},
  {date:'2026-10-23', label:'23/10', title:'CSS y organización visual', desc:'Mejorar composición, cajas, tipografías, menú y distribución sin perder control del contenido.', tasks:['Revisar margin y padding','Controlar cajas y desbordes','Revisar Float/Clear o Flex según el caso','Mejorar coherencia visual entre páginas']},
  {date:'2026-10-26', label:'26/10', title:'Beneficiario + benchmarking', desc:'Mirar el sitio desde la necesidad real del beneficiario y contrastarlo con referentes del mismo rubro.', tasks:['Revisar si la información responde al beneficiario','Comparar estructura y navegación con referentes','Detectar decisiones que puedan mejorarse','No copiar: justificar las decisiones propias']},
  {date:'2026-10-30', label:'30/10', title:'Revisión técnica + visual', desc:'Revisar el proyecto de manera integral: funcionamiento, composición visual, legibilidad e interfaz.', tasks:['Cerrar CBO y requisitos pendientes','Probar navegación y recursos','Revisar composición visual y coherencia','Corregir problemas detectados por la rúbrica']},
  {date:'2026-11-02', label:'2/11', title:'Analizador + rúbrica', desc:'Usar el analizador y la rúbrica como diagnóstico para encontrar faltantes concretos.', tasks:['Analizar la carpeta completa','Revisar advertencias una por una','Completar la autoevaluación','Priorizar errores importantes antes que detalles menores']},
  {date:'2026-11-06', label:'6/11', title:'Versión casi final', desc:'La última semana tendrá dos feriados; por eso el proyecto debería quedar prácticamente cerrado en esta instancia.', tasks:['Prueba completa del sitio','Revisar beneficiario y contenidos','Explicar decisiones técnicas y visuales','Preparar copia final y respaldo']},
  {date:'2026-11-09', label:'9/11', title:'Feriado nacional', desc:'Feriado nacional por la visita del papa León XIV.', tasks:['No se planifica avance de clase para esta fecha.'], noClass:true},
  {date:'2026-11-11', label:'11/11', title:'Feriado · Provincia de Buenos Aires', desc:'Feriado en todo el territorio de la Provincia de Buenos Aires por la visita del papa León XIV.', tasks:['No se planifica avance de clase para esta fecha.'], noClass:true},
  {date:'2026-11-13', label:'13/11', title:'Entrega final del sitio', desc:'Fecha límite de entrega del proyecto. El equipo debe llegar con la versión final revisada, probada y lista para compartir.', tasks:['Prueba final en otra computadora','Confirmar index.html en minúsculas','Revisar enlaces y multimedia','Verificar carpeta y respaldo','Entregar por Classroom'], final:true},
  {date:'2026-11-16', label:'16/11', title:'Defensa oral · jornada 1', desc:'Primera jornada de defensas orales por equipos. Cada equipo dispone de 5 a 7 minutos reloj para fundamentar el desarrollo y explicar el uso del código.', tasks:['Presentar brevemente el propósito y beneficiario','Mostrar el recorrido del sitio','Fundamentar decisiones de HTML y CSS','Participación de ambos integrantes','Responder preguntas del profesor'], oral:true},
  {date:'2026-11-20', label:'20/11', title:'Defensa oral · jornada 2', desc:'Segunda jornada de defensas orales por equipos. Se evalúa el proyecto como producción grupal y el dominio de cada integrante en forma individual.', tasks:['5 a 7 minutos por equipo','Explicar decisiones de construcción','Mostrar comprensión del código utilizado','Cada integrante debe poder responder','Habrá preguntas breves'], oral:true}
];`;
  code=code.replace(/const DELIVERY = new Date\('2026-10-22T12:00:00-03:00'\);\nconst routeSteps = \[[\s\S]*?\n\];/,route);

  const replacements=[
    ['Olvidar que UTN pide datos del alumno, colegio y año en el pie.','Olvidar los datos del alumno, colegio y año en el pie.'],
    ['Completar semántica para UTN','Completar semántica del proyecto'],
    ['incorporar las etiquetas semánticas que UTN también evalúa cuando corresponden.','incorporar las etiquetas semánticas que se evalúan cuando corresponden.'],
    ['UTN incluye etiquetas como nav, section, article, figure y aside.','La consigna incluye etiquetas como nav, section, article, figure y aside.'],
    ['UTN también pide anclas, enlace a un archivo (pdf/zip/doc) en nueva pestaña y mailto.','La consigna también incluye anclas, enlace a un archivo (pdf/zip/doc) en nueva pestaña y mailto.'],
    ['La rúbrica UTN','La rúbrica'],
    ['Display y position (Temario UTN)','Display y position (Temario)'],
    ['UTN también observa capacidad de argumentar y reflexionar sobre aciertos y dificultades del proceso.','La evaluación también observa capacidad de argumentar y reflexionar sobre aciertos y dificultades del proceso.'],
    ['Ahora UTN suma otras etiquetas semánticas según la función del contenido.','Ahora sumamos otras etiquetas semánticas según la función del contenido.'],
    ["l.status==='temario'?'TEMARIO UTN'","l.status==='temario'?'TEMARIO'"],
    ["l.status==='temario'?'TEMARIO UTN · CONSULTA RÁPIDA'","l.status==='temario'?'TEMARIO · CONSULTA RÁPIDA'"],
    ['UTN indica que la página inicial debe llamarse index.html, en minúsculas.','La página inicial debe llamarse index.html, en minúsculas.'],
    ['La rúbrica UTN reconoce elementos externos como YouTube o Spotify.','La rúbrica reconoce elementos externos como YouTube o Spotify.'],
    ['UTN no permite plantillas o librerías tipo Bootstrap para este proyecto.','La consigna no permite plantillas o librerías tipo Bootstrap para este proyecto.'],
    ['<b>No es una nota UTN.</b>','<b>No es una nota final.</b>'],
    ['utn6n_visual','web6f_visual'],
    ['utn6n_rubric','web6f_rubric'],
    ["s.noClass?'SIN CLASE'","s.noClass?'FERIADO / SIN CLASE'"],
    ['Proyecto Web 6N · ficha de estudio','Proyecto Web 6F · ficha de estudio']
  ];
  for(const [a,b] of replacements) code=code.split(a).join(b);
  code=code.split('UTN.BA').join('').split('UTN').join('').split('6N').join('6F');
  (0,eval)(code);

  try{
    const res=await fetch('entregas-6f.json',{cache:'no-store'});
    if(res.ok){
      const data=await res.json();
      const section=document.getElementById('entrega6f');
      if(section&&!document.getElementById('repoStatus6f')){
        const esc=(v)=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
        const equipos=Array.isArray(data.equipos)?data.equipos:[];
        const entregados=equipos.filter(e=>e.estado==='entregado');
        const pendientes=equipos.filter(e=>e.estado!=='entregado');
        const fechaCarga=(v)=>{const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);return m?m[3]+'/'+m[2]+'/'+m[1]+' '+m[4]+':'+m[5]:'';};
        const item=(e)=>'<li><strong>Equipo '+esc(e.equipo)+' · '+esc(e.integrantes)+'</strong><small>'+esc(e.proyecto)+(e.ultimaActualizacion?' · Última carga: '+esc(fechaCarga(e.ultimaActualizacion)):'')+'</small></li>';
        const total=data.totalEquipos||equipos.length;
        const panel=document.createElement('div');
        panel.id='repoStatus6f';
        panel.className='card';
        panel.innerHTML='<div class="section-head"><div><p class="eyebrow">ESTADO DEL REPOSITORIO</p><h3>Quiénes entregaron y quiénes faltan</h3></div><strong class="repo-status-count">'+entregados.length+' / '+total+'</strong></div><p class="repo-status-note">Se considera entrega registrada cuando la carpeta <strong>ACTUAL</strong> contiene archivos del proyecto y una constancia de actualización. Esto no significa que el trabajo esté completo o aprobado. <strong>El listado refleja el último control de Drive, no una consulta en tiempo real.</strong></p><div class="repo-status-grid"><div class="repo-status-col"><h4>✅ Entregaron</h4><ul>'+(entregados.length?entregados.map(item).join(''):'<li class="muted">Todavía no hay entregas registradas.</li>')+'</ul></div><div class="repo-status-col"><h4>⏳ Sin entrega registrada</h4><ul>'+(pendientes.length?pendientes.map(item).join(''):'<li class="complete">Todos los equipos entregaron.</li>')+'</ul></div></div><small class="repo-status-updated">Último control verificado en Drive: '+esc(data.fechaControl||data.actualizado||'Sin dato')+'</small>';

        const firstCard=section.querySelector('.card');
        if(firstCard) firstCard.after(panel); else section.append(panel);

        const style=document.createElement('style');
        style.textContent='#repoStatus6f{padding:24px 28px;margin-top:18px;border-left:5px solid #16a34a}#repoStatus6f .repo-status-count{font-size:1.35rem;color:#166534}#repoStatus6f .repo-status-note{margin:8px 0 16px;color:#475569}#repoStatus6f .repo-status-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}#repoStatus6f .repo-status-col{border:1px solid #dbe3ee;border-radius:14px;padding:16px 18px;background:#f8fafc}#repoStatus6f .repo-status-col h4{margin:0 0 12px}#repoStatus6f .repo-status-col ul{margin:0;padding-left:20px;display:grid;gap:9px}#repoStatus6f .repo-status-col li small{display:block;color:#64748b;margin-top:2px}#repoStatus6f .repo-status-updated{display:block;margin-top:12px;color:#64748b}#repoStatus6f .muted{color:#64748b}#repoStatus6f .complete{color:#166534;font-weight:800}@media(max-width:760px){#repoStatus6f .repo-status-grid{grid-template-columns:1fr}}';
        document.head.append(style);
      }
    }
  }catch(err){
    console.warn('No se pudo cargar el estado de entregas 6F',err);
  }
})().catch(err=>{
  console.error(err);
  document.body.innerHTML='<main style="font-family:Arial;padding:2rem"><h1>No se pudo cargar el asistente de 6F</h1><p>Recargá la página. Si el problema continúa, avisale al profesor.</p></main>';
});
