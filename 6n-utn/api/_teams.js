const PROJECT_BASE='https://gusro16.github.io/utn/6n-utn/proyectos-6n/';

const teams = {
  'paterno-tinnirello': {team:'Paterno / Tinnirello',members:'Andrés Paterno · Lucila Tinnirello',proc1:5,proc2:5,utn:82,state:'approved',badge:'Aprobado · sin pendientes',slug:'paterno-tinnirello',rubric:'https://drive.google.com/file/d/1-tbyIc-FQXfceSSGhAs69R1FOIKCxUi3/view',status:'El sitio presentado y el coloquio de UTN fueron aprobados satisfactoriamente (82/100). Con ese desempeño, queda acreditado el proyecto y se da por cerrada esta instancia.',action:'No tienen que hacer nuevas correcciones, entregar otro ZIP ni grabar videos. El trabajo de Programación Web queda cerrado, sin PIE por este proyecto.'},
  'serio-ledesma': {team:'Serio / Ledesma',members:'Dominique Serio · Catalina Ledesma',proc1:7,proc2:6,utn:62,state:'improve',badge:'UTN aprobado · mejora pendiente',slug:'serio-ledesma',rubric:'https://drive.google.com/file/d/1hmyiWwTX5r5b5Z0sSfuEP1vxJbti1_Ak/view',status:'Aprobaron UTN con 62/100. La nota es ajustada; van a poder reforzar la evaluación escolar corrigiendo los puntos que señaló la rúbrica y explicándolos.',action:'Abrir la devolución del equipo, corregir HTML y CSS indicados y entregar ZIP actualizado, una captura y un video breve de pantalla en el que ambas expliquen los cambios.'},
  'tartufoli-converso': {team:'Tartufoli / Converso',members:'Faustina Tartufoli · Valentín Converso',proc1:9,proc2:8,utn:74,state:'approved',badge:'Aprobado · sin pendientes',slug:'tartufoli-converso',rubric:'https://drive.google.com/file/d/1FOiWS3KqKxDNrN02xwWTp16DORXo0T9b/view',status:'El sitio y el coloquio de UTN fueron aprobados (74/100). Además, tuvieron muy buenas notas de proceso (9 y 8), así que la evaluación del proyecto queda completa.',action:'No tienen que entregar más archivos, hacer correcciones adicionales ni grabar videos. El trabajo de Programación Web queda cerrado, sin PIE por este proyecto.'},
  'lagrotta-arcas': {team:'Lagrotta / Arcas',members:'Antonella Lagrotta · Aryana Arcas',proc1:5,proc2:5,utn:68,state:'improve',badge:'UTN aprobado · mejora pendiente',slug:'lagrotta-arcas',rubric:'https://drive.google.com/file/d/1KJGxrcrqjnnqBKiBAI4j623wB3vfJhle/view',status:'Aprobaron UTN con 68/100. Como las notas de proceso son 5 y 5, necesitan mostrar correcciones puntuales y explicar cómo funcionan.',action:'Abrir la devolución del equipo y mejorar pie de página y navegación. Entregar ZIP actualizado, una captura y un video breve de pantalla con explicación de ambas integrantes.'},
  'benetti-pagura': {team:'Benetti / Pagura',members:'Azul Benetti · Renzo Pagura',proc1:4,proc2:4,utn:73,state:'improve',badge:'UTN aprobado · mejora pendiente',slug:'benetti-pagura',rubric:'https://drive.google.com/file/d/1hFVzfV75RhM51HqRDDO8735DFgwFvY40/view',status:'Aprobaron UTN con 73/100, pero las dos notas de proceso son 4. Esta instancia de mejora permite completar evidencias de comprensión y reforzar la evaluación escolar.',action:'Abrir la devolución del equipo: corregir el audio y los puntos seleccionados. Entregar ZIP, una captura y un video de pantalla en el que los dos expliquen sus cambios.'},
  'pace-lopez-letizia': {team:'Pace / López Letizia',members:'Lautaro Pace · Josefina López Letizia',proc1:4,proc2:4,utn:63,state:'improve',badge:'UTN aprobado · mejora pendiente',slug:'pace-lopez-letizia',rubric:'https://drive.google.com/file/d/1xBRDDRTWlRkg9CyMA_fw3vlHd_p9j1gW/view',status:'Aprobaron UTN con 63/100. Como las dos notas de proceso son 4, todavía necesitan mostrar algunas correcciones y explicar qué modificaron para completar la evaluación de la materia.',action:'Abrir la devolución del equipo y resolver los puntos indicados. Entregar ZIP actualizado, una captura y un video corto de pantalla en el que ambos expliquen qué cambiaron y por qué.'},
  'ruiz-barassi-anso': {team:'Ruiz Barassi / Ansó',members:'Catalina Ruiz Barassi · Camila Ansó',proc1:9,proc2:8,utn:40,state:'recovery',badge:'Recuperatorio UTN',slug:'ruiz-barassi-anso',rubric:'https://drive.google.com/file/d/1Li-8tOmcLig3sjToZTyHkp9m4uwRXQ1B/view',status:'De acuerdo con la decisión de Coordinación y Dirección, deben presentarse al recuperatorio UTN. La materia continúa abierta hasta completar esa instancia.',action:'Revisen la rúbrica y la devolución del equipo. Corrijan los puntos señalados, prueben el sitio y prepárense para explicar qué cambiaron y por qué.'},
  'bonaventura-vidal': {team:'Bonaventura / Vidal',members:'Martín Bonaventura · Joaquín Vidal',proc1:7,proc2:6,utn:50,state:'recovery',badge:'Recuperatorio UTN',slug:'bonaventura-vidal',rubric:'https://drive.google.com/file/d/1PAl2sdXv_wxHjhZryMG0W7E36Qv8NA9q/view',status:'De acuerdo con la decisión de Coordinación y Dirección, deben presentarse al recuperatorio UTN. La materia continúa abierta hasta completar esa instancia.',action:'Revisen la rúbrica y la devolución del equipo. Corrijan los puntos señalados, prueben el sitio y prepárense para explicar qué cambiaron y por qué.'},
  'spollansky-figueira': {team:'Spollansky / Figueira',members:'Joaquina Spollansky · Iara Figueira',proc1:10,proc2:8,utn:null,state:'recovery',badge:'Recuperatorio · sitio y coloquio',slug:null,rubric:null,status:'No se presentaron a la primera instancia de UTN y avisaron previamente porque participaron en un evento. Eligieron completar la evaluación directamente en el recuperatorio; no tienen nota UTN de esa instancia.',action:'Deben entregar el sitio web completo y presentarse al coloquio en el recuperatorio UTN. Preparen el proyecto para navegarlo y explicar cómo funciona. Se mantiene el registro de su buen proceso (10 y 8).'},
  'giavedoni': {team:'Giavedoni',members:'Rodolfo Giavedoni',proc1:4,proc2:4,utn:53,state:'recovery',badge:'Recuperatorio UTN',slug:'giavedoni',rubric:'https://drive.google.com/file/d/11sXzfRTRtWzvxYWtxVynOgROTkTXUMv8/view',status:'La materia sigue abierta. Tenés que rendir el recuperatorio UTN y mostrar que entendés realmente el sitio que presentaste.',action:'Quiero que uses la rúbrica como guía, corrijas de a poco y anotes qué cambiaste. Después practicá explicar esas mejoras directamente sobre el código.'},
  'de-benedictis': {team:'De Benedictis',members:'Rocco De Benedictis',proc1:4,proc2:4,utn:53,state:'recovery',badge:'Recuperatorio UTN',slug:'de-benedictis',rubric:'https://drive.google.com/file/d/1a_NltaZjNxJSo4s2XPFEw6jlGGPk-g3v/view',status:'La materia sigue abierta. Tenés que rendir el recuperatorio UTN y poder sostener una defensa clara del proyecto.',action:'Primero corregí los faltantes y enlaces que quedaron señalados. Anotá cada mejora y preparate para explicar la estructura, la navegación y las decisiones de código que tomaste.'},
  'sosa-bolli': {team:'Sosa / Bolli',members:'Juan Bautista Sosa · Ramiro Bolli',proc1:4,proc2:4,utn:null,state:'recovery',badge:'Recuperatorio · sitio y coloquio',slug:'sosa-bolli',rubric:'https://drive.google.com/file/d/1FuQn7HX667bhb8ufw13OkDIKDkJ_NdL6/view',status:'UTN los calificó por error: no se presentaron a la instancia original. El puntaje que apareció en la rúbrica no corresponde a una evaluación rendida y NO es una aprobación válida.',action:'Deben volver a entregar el sitio web completo y presentarse al coloquio durante el recuperatorio UTN. Revisen antes que todas las páginas, enlaces y recursos funcionen; cada integrante tiene que explicar su código.'},
  'resumil-medrano': {team:'Resumil / Medrano',members:'Catalina Resumil · Delfina Medrano',proc1:4,proc2:4,utn:47,state:'newsite',badge:'Nuevo sitio + recuperatorio',slug:'resumil-medrano',rubric:'https://drive.google.com/file/d/1ehBubf0zORsv59k87vigNPcV84E3pQdT/view',status:'UTN marcó que el trabajo no cumple los lineamientos porque coincide con otro template. En este caso no alcanza con retocar el sitio anterior: hay que hacerlo de nuevo.',action:'Quiero que armen un sitio nuevo, propio y simple, que cumpla con lo que pide UTN. Vayan dejando registro de lo que hacen porque después lo tienen que poder explicar en la defensa.'},
  'veleche-bedascarrasbure': {team:'Veleche / Bedascarrasbure',members:'Inés Veleche · Charo Bedascarrasbure',proc1:4,proc2:4,utn:47,state:'newsite',badge:'Nuevo sitio + recuperatorio',slug:'veleche-bedascarrasbure',rubric:'https://drive.google.com/file/d/1Gb5GPw38IDJIeU6JyC_hlPgjlYk-7pQV/view',status:'UTN marcó que el trabajo coincide con otro template y por eso no cumple los lineamientos. Para la segunda instancia van a tener que presentar un trabajo nuevo.',action:'Armen un sitio nuevo, sencillo pero propio. Quiero que puedan explicar cada parte que usen, así que vayan anotando las decisiones mientras trabajan.'},
  'castellano-tagliatti': {team:'Castellano / Tagliatti',members:'Zoe Castellano · Giulia Tagliatti',proc1:4,proc2:4,utn:35,state:'newsite',badge:'Nuevo trabajo + recuperatorio',slug:'castellano-tagliatti',rubric:'https://drive.google.com/file/d/1V-3s2zfTZLFYmlEFq8j3AaROWRtJdqjL/view',status:'UTN dejó una observación porque en el coloquio no pudieron demostrar suficiente comprensión del código y apareció la duda sobre el uso de IA. Por eso la materia sigue abierta.',action:'Necesito que preparen un trabajo nuevo que realmente puedan construir, modificar y explicar ustedes. En la defensa cada una tiene que poder mostrar qué hace el HTML y el CSS que está usando.'}
};

// Guías de revisión para estudiantes. Se muestran solo al equipo autenticado.
const reviewDocs={
  "ruiz-barassi-anso": "https://docs.google.com/document/d/1XR3TdgZ0gBDfzFXSrNXrCDKN8mhcgneJ9p_OEPvm-OA/edit",
  "bonaventura-vidal": "https://docs.google.com/document/d/1ZN7K2mpn9FPXRCJdOjZ90gLSl056RchcwJHdEkp9C6A/edit",
  "giavedoni": "https://docs.google.com/document/d/1LVRFpEuqb-10cvsQ6HvZh70hCKw3Ue7akz_8u6Nstwc/edit",
  "de-benedictis": "https://docs.google.com/document/d/1QWgMAD7cBPTsuMzV7_pzqYU1CzeIp551UXbI4TjXiRU/edit",
  "resumil-medrano": "https://docs.google.com/document/d/1DRXDUXAEBBhgYHcukeJUhOTHEyvjjWDXwraH9TIhAmU/edit",
  "veleche-bedascarrasbure": "https://docs.google.com/document/d/176nEVm_DPPR0bErlOKco14cYCrsW434rl2nRuWhOn4A/edit",
  "castellano-tagliatti": "https://docs.google.com/document/d/1lk8dCdxmIQJDgGkr3zimsyldR9XS_NZwmi57GKoqqR8/edit",
  "pace-lopez-letizia": "https://docs.google.com/document/d/10AdwFE3-MdRnf8Y7cJGFTAr8T6zaEU3W9Ip2aIRN5XM/edit",
  "benetti-pagura": "https://docs.google.com/document/d/1t73Akju7BPHSX2eze5CnRkyySzn1FjzioFkrE9WB030/edit",
  "lagrotta-arcas": "https://docs.google.com/document/d/1O_UPfPe0NUwq1Bj01OWAHufoca9mhr_amaD7mx-cVww/edit",
  "serio-ledesma": "https://docs.google.com/document/d/1Xj0JtddfGLqTHfcHOwBQgB0Hds08pdiy8ClMtbpsaWM/edit"
};
for (const [teamKey, reviewUrl] of Object.entries(reviewDocs)) {
  if (teams[teamKey]) teams[teamKey].review = reviewUrl;
}

for (const t of Object.values(teams)) {
  t.site = t.slug ? PROJECT_BASE + t.slug + '/' : null;
}

const emailToTeam = {
  'apaterno@northfield.edu.ar':'paterno-tinnirello',
  'ltinnirellolucila@northfield.edu.ar':'paterno-tinnirello',

  'dserio@northfield.edu.ar':'serio-ledesma',
  'ledesmacatalina@northfield.edu.ar':'serio-ledesma',

  'tartufolirubifaustina@northfield.edu.ar':'tartufoli-converso',
  'vconverso@northfield.edu.ar':'tartufoli-converso',

  'antonella.lagrottarochi@northfield.edu.ar':'lagrotta-arcas',
  'aarcas@northfield.edu.ar':'lagrotta-arcas',

  'cresumil@northfield.edu.ar':'resumil-medrano',
  'dmedrano@northfield.edu.ar':'resumil-medrano',

  'mbonaventura@northfield.edu.ar':'bonaventura-vidal',
  'jvidal@northfield.edu.ar':'bonaventura-vidal',

  'iveleche@northfield.edu.ar':'veleche-bedascarrasbure',
  'cbedascarrasbure@northfield.edu.ar':'veleche-bedascarrasbure',

  'castellanozoe@northfield.edu.ar':'castellano-tagliatti',
  'gtagliatti@northfield.edu.ar':'castellano-tagliatti',

  'abenetti@northfield.edu.ar':'benetti-pagura',
  'rpagura@northfield.edu.ar':'benetti-pagura',

  'lpace@northfield.edu.ar':'pace-lopez-letizia',
  'jolopez@northfield.edu.ar':'pace-lopez-letizia',

  'cruizbarassi@northfield.edu.ar':'ruiz-barassi-anso',
  'canso@northfield.edu.ar':'ruiz-barassi-anso',

  'jsosa@northfield.edu.ar':'sosa-bolli',
  'rbolli@northfield.edu.ar':'sosa-bolli',

  'rgiavedoni@northfield.edu.ar':'giavedoni',
  'rdebenedictis@northfield.edu.ar':'de-benedictis',

  'jspollansky@northfield.edu.ar':'spollansky-figueira',
  'ifigueira@northfield.edu.ar':'spollansky-figueira'
};

module.exports = { teams, emailToTeam };
