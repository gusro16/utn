(async()=>{
  const files=['app-part-01.txt','app-part-02.txt','app-part-03.txt','app-part-04.txt','app-part-05.txt','app-part-06.txt','app-part-07.txt'];
  const parts=await Promise.all(files.map(f=>fetch(f).then(r=>{if(!r.ok) throw new Error('No se pudo cargar '+f); return r.text();})));
  (0,eval)(parts.join(''));
})().catch(err=>{console.error(err);document.body.innerHTML='<main style="font-family:Arial;padding:2rem"><h1>No se pudo cargar el asistente</h1><p>Recargá la página. Si el problema continúa, avisale al profesor.</p></main>';});
