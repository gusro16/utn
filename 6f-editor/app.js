(() => {
'use strict';
const $=id=>document.getElementById(id);
const projects={'01':'Vintage Market Tigre','02':'Dos Orejas','03':'El Bórdo','04':'Gelato Stelvio','05':'Casa Cúrcuma','06':'Dunge Didácticos','07':'La Casa del Perforista','08':'Alpa Multisport','09':'Golta Camisetas','10':'Cede World Padel','11':'Al Paso Mates','12':'ONG CEAPI','14':'Resto House'};
let team='', code='',role='',member='',files=[],current='',etag=null,locked=false,dirty=false,saving=false,saveTimer=null,session=crypto.randomUUID();
let cache=new Map(),previewPage='',lastSaved='',binary=false,toastTimer=null;
const textExt=/\.(html?|css|js|mjs|json|txt)$/i;
const validFile=p=>typeof p==='string'&&p.length<221&&/\.(html?|css|js|mjs|json|txt|png|jpe?g|webp|gif|svg|pdf)$/i.test(p)&&!p.includes('\\')&&!p.startsWith('/')&&p.split('/').every(s=>s&&s!=='.'&&s!=='..'&&!s.startsWith('.'));
const toBase64=bytes=>{let str='';for(let i=0;i<bytes.length;i+=32768)str+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(str)};
const fromBase64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
function notify(message,isError=false){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').className='toast'+(isError?' error':'');$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,6500);}
function state(message,kind=''){ $('saveStatus').textContent=message;$('saveStatus').style.color=kind==='error'?'#b91c1c':kind==='ok'?'#13804a':'';}
async function api(action,method='GET',payload={},overrides={}) {
  const params=new URLSearchParams({action,team:overrides.team||team,...(overrides.file?{file:overrides.file}:{}),...(overrides.id?{id:overrides.id}:{})});
  const options={method,headers:{'x-team-code':code,'Cache-Control':'no-store'}};
  if(method==='POST'){options.headers['Content-Type']='application/json'; options.body=JSON.stringify({team:overrides.team||team,...payload});}
  let res;
  try{res=await fetch('/api/editor?'+params,{...options,cache:'no-store'});}
  catch{throw Object.assign(new Error('No hay conexión con el servidor. No se guardó nada.'),{status:0});}
  let result;try{result=await res.json()}catch{result={error:'Respuesta no válida del servidor.'};}
  if(!res.ok)throw Object.assign(new Error(result.error||'Falló la operación.'),{status:res.status,details:result});
  return result;
}
function sortedFiles(){return files.map(f=>f.file).sort((a,b)=>a.localeCompare(b,'es',{numeric:true}));}
function isBinary(file){return !textExt.test(file);}
function mime(file){if(/\.png$/i.test(file))return'image/png';if(/\.jpe?g$/i.test(file))return'image/jpeg';if(/\.gif$/i.test(file))return'image/gif';if(/\.webp$/i.test(file))return'image/webp';if(/\.svg$/i.test(file))return'image/svg+xml';return'application/pdf';}
async function getFile(file,force=false){
 if(!force&&cache.has(file))return cache.get(file);
 const result=await api('open','GET',{}, {file});cache.set(file,result);return result;
}
function renderFiles(){
 $('fileList').replaceChildren();
 if(!files.length){const p=document.createElement('p');p.className='small muted';p.textContent='Todavía no hay archivos. Carguen la carpeta del proyecto o creen index.html.';$('fileList').append(p);}
 for(const file of sortedFiles()){
  const b=document.createElement('button');b.type='button';b.className='file-item'+(current===file?' active':'');b.textContent=(isBinary(file)?'▧ ':'⌘ ')+file;b.title=file;b.addEventListener('click',()=>openFile(file));$('fileList').append(b);
 }
 const htmls=sortedFiles().filter(f=>/\.html?$/i.test(f));
 const chosen=$('previewPage').value||previewPage;
 $('previewPage').replaceChildren();
 for(const f of htmls){const opt=document.createElement('option');opt.value=f;opt.textContent=f;$('previewPage').append(opt);}
 previewPage=htmls.includes(chosen)?chosen:htmls.includes('index.html')?'index.html':htmls[0]||'';
 $('previewPage').value=previewPage;
}
async function refreshFiles(){
 try{const r=await api('files');files=r.files||[];renderFiles();$('connection').textContent='Conectado';$('connection').classList.add('online');}
 catch(e){notify(e.message,true);$('connection').textContent='Sin conexión';$('connection').classList.remove('online');}
}
function editorEnabled(){
 $('code').disabled=!current||binary||!locked||role==='docente';
 $('save').disabled=$('code').disabled||!dirty;
 $('reload').disabled=!current;
}
async function release(){
 if(locked&&current&&role!=='docente'){
  try{await api('release','POST',{file:current,session,owner:member});}catch{}
 }
 locked=false;
}
async function openFile(file){
 if(!files.some(x=>x.file===file))return;
 if(dirty&&!(await saveCurrent())){notify('No se pudo guardar el borrador. Descargalo antes de cambiar de archivo.',true);return;}
 clearTimeout(saveTimer);
 if(current!==file)await release();
 current=file;etag=null;binary=isBinary(file);dirty=false;lastSaved='';$('currentFile').textContent=file;
 $('lockedNotice').hidden=true;state('Abriendo...');
 try{
  const r=await getFile(file,true);etag=r.etag;
  if(binary){$('code').value='Archivo adjunto: '+file+'\n\nUsá la vista previa para verlo o descargalo con el botón de arriba.';state('Recurso adjunto');}
  else{$('code').value=r.content;lastSaved=r.content;state('Última versión del servidor','ok');}
  if(!binary&&role!=='docente'){
   try{await api('claim','POST',{file,session,owner:member});locked=true;}
   catch(e){locked=false;$('lockedNotice').hidden=false;$('lockedNotice').textContent=(e.details?.owner?'Lo está editando '+e.details.owner+'. ':'')+'Se abrió en modo lectura. Podés trabajar en otro archivo y volver a intentarlo.';notify(e.message,true);}
  }
  if(role==='docente')state('Modo docente · lectura');
  if(/\.html?$/i.test(file)){previewPage=file;$('previewPage').value=file;}
  await showHistory();renderFiles();
 }catch(e){state(e.message,'error');notify(e.message,true);}
 editorEnabled();
}
function markDirty(){
 if(!current||!locked||binary)return;dirty=$('code').value!==lastSaved;state(dirty?'Cambios pendientes...':'Sin cambios');editorEnabled();
 clearTimeout(saveTimer);if(dirty)saveTimer=setTimeout(saveCurrent,3500);
}
async function saveCurrent(){
 clearTimeout(saveTimer);
 if(!current||!dirty)return true;
 if(!locked||role==='docente'){notify('No tenés el permiso de edición de este archivo.',true);return false;}
 if(saving)return false;
 saving=true;const file=current,snapshot=$('code').value,oldTag=etag;
 state('Guardando...');$('save').disabled=true;
 try{
  const r=await api('save','POST',{file,content:snapshot,binary:false,etag:oldTag,session,owner:member});
  etag=r.etag;lastSaved=snapshot;cache.set(file,{ok:true,file,etag:r.etag,content:snapshot,binary:false});
  dirty=$('code').value!==snapshot;state(dirty?'Nuevos cambios pendientes...':'Guardado en servidor · '+new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}),'ok');
  if(dirty)saveTimer=setTimeout(saveCurrent,1800);
  showHistory().catch(()=>{});return true;
 }catch(e){
  state(e.message,'error');notify(e.message,true);
  if(e.status===423){locked=false;$('lockedNotice').hidden=false;$('lockedNotice').textContent='Perdiste el turno de edición. Conservá tu borrador antes de recargar.';}
  return false;
 }finally{saving=false;editorEnabled();}
}
async function newFile(){
 const filename=prompt('Nombre del nuevo archivo (por ejemplo: contacto.html o css/estilos.css)');
 if(!filename)return;
 const f=filename.trim();
 if(!validFile(f)||!textExt.test(f)){notify('Usá un nombre válido terminado en .html, .css, .js, .json o .txt.',true);return;}
 if(files.some(x=>x.file===f)){notify('Ese archivo ya existe. Abrilo desde la lista.',true);return;}
 try{
  await api('claim','POST',{file:f,session,owner:member});
  try{await api('save','POST',{file:f,content:f.endsWith('.html')?'<!doctype html>\n<html lang="es">\n<head><meta charset="utf-8"><title>Mi página</title></head>\n<body>\n\n</body>\n</html>\n':'',binary:false,etag:null,session,owner:member});}
  finally{await api('release','POST',{file:f,session,owner:member}).catch(()=>{});}
  await refreshFiles();await openFile(f);notify('Archivo creado y guardado.');
 }catch(e){notify(e.message,true);}
}
async function importFiles(input,folderMode){
 if(role==='docente')return;
 const entries=[...input.files];input.value='';
 if(!entries.length)return;
 let done=0,skipped=0,failed=0;
 for(const blob of entries){
  const relative=(folderMode&&blob.webkitRelativePath)?blob.webkitRelativePath.split('/').slice(1).join('/'):blob.name;
  if(!validFile(relative)||relative==='_ACTUALIZACION.json'||files.some(x=>x.file===relative)){skipped++;continue;}
  try{
   const binary=isBinary(relative);
   if(blob.size>(binary?3_500_000:250_000)){skipped++;continue;}
   await api('claim','POST',{file:relative,session,owner:member});
   try{
    const content=binary?toBase64(new Uint8Array(await blob.arrayBuffer())):await blob.text();
    await api('save','POST',{file:relative,content,binary,etag:null,session,owner:member});done++;
    files.push({file:relative,size:blob.size});cache.delete(relative);
   }finally{await api('release','POST',{file:relative,session,owner:member}).catch(()=>{});}
  }catch(e){failed++;if(failed<=2)notify(relative+': '+e.message,true);}
 }
 await refreshFiles();notify('Importados: '+done+'. Ya existían o se omitieron: '+skipped+'. Errores: '+failed+'.',failed>0);
 if(!current&&files.length)await openFile(files.some(x=>x.file==='index.html')?'index.html':sortedFiles().find(f=>!isBinary(f))||sortedFiles()[0]);
}
async function showHistory(){
 $('historyList').replaceChildren();if(!current)return;
 try{
 const data=await api('history','GET',{}, {file:current});
 if(!data.versions?.length){$('historyList').textContent='Todavía no hay versiones anteriores de este archivo.';return;}
 for(const version of data.versions){
  const box=document.createElement('div');box.className='history-entry';
  const label=document.createElement('span');const date=version.date?new Date(version.date):new Date(Number(version.id.slice(0,13)));
  label.textContent=date.toLocaleString('es-AR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  const btn=document.createElement('button');btn.className='ghost';btn.textContent='Ver copia';btn.onclick=()=>viewRevision(version.id);
  box.append(label,btn);$('historyList').append(box);
 }
 }catch(e){$('historyList').textContent='No se pudo consultar el historial.';}
}
async function viewRevision(id){
 if(!current)return;
 try{
  const r=await api('revision','GET',{}, {file:current,id});const rev=r.revision;
  if(rev.binary){notify('Para recuperar este recurso, consultá al profesor. La copia existe en el servidor.');return;}
  const text=new TextDecoder().decode(fromBase64(rev.base64));
  if(role==='docente'||!locked){
    const blob=new Blob([text],{type:'text/plain'});downloadBlob(blob,'revision-'+current.replaceAll('/','-'));return;
  }
  if(!confirm('¿Querés cargar esta versión anterior en el editor? No se guardará hasta que uses Guardar.'))return;
  $('code').value=text;markDirty();notify('Versión anterior cargada como borrador. Podés guardarla o descargarla.');
 }catch(e){notify(e.message,true);}
}
function downloadBlob(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}
function crc32(bytes){
 let crc=0xffffffff;
 for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc&1)?(crc>>>1)^0xedb88320:crc>>>1;}
 return (crc^0xffffffff)>>>0;
}
function zipArchive(entries){
 const encoder=new TextEncoder(),chunks=[],central=[];let offset=0,centralSize=0;
 for(const {name,data} of entries){
  const filename=encoder.encode(name),size=data.length,checksum=crc32(data);
  if(size>0xffffffff||filename.length>65535)throw new Error('Uno de los archivos supera el tamaño de ZIP.');
  const local=new Uint8Array(30+filename.length),h=new DataView(local.buffer);
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);
  h.setUint16(12,0x0021,true);h.setUint32(14,checksum,true);h.setUint32(18,size,true);h.setUint32(22,size,true);
  h.setUint16(26,filename.length,true);local.set(filename,30);chunks.push(local,data);
  const entry=new Uint8Array(46+filename.length),c=new DataView(entry.buffer);
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);
  c.setUint16(14,0x0021,true);c.setUint32(16,checksum,true);c.setUint32(20,size,true);c.setUint32(24,size,true);
  c.setUint16(28,filename.length,true);c.setUint32(42,offset,true);entry.set(filename,46);
  central.push(entry);offset+=local.length+data.length;centralSize+=entry.length;
 }
 if(entries.length>65535||offset>0xffffffff||centralSize>0xffffffff)throw new Error('La carpeta es demasiado grande para exportarla.');
 const end=new Uint8Array(22),e=new DataView(end.buffer);
 e.setUint32(0,0x06054b50,true);e.setUint16(8,entries.length,true);e.setUint16(10,entries.length,true);
 e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);
 return new Blob([...chunks,...central,end],{type:'application/zip'});
}
async function exportZip(){
 const button=$('exportZip');if(!team||!files.length)return notify('Todavía no hay archivos para exportar.',true);
 if(dirty&&!(await saveCurrent()))return notify('Primero guardá o descargá el borrador pendiente.',true);
 button.disabled=true;button.textContent='Armando ZIP...';
 try{
  const contents=[];let total=0;
  for(const path of sortedFiles()){
   const v=await getFile(path);
   const bytes=v.binary?fromBase64(v.content):new TextEncoder().encode(v.content);
   total+=bytes.length;if(total>80_000_000)throw new Error('El proyecto supera 80 MB. Consultá al profesor.');
   contents.push({name:path,data:bytes});
  }
  const date=new Date().toISOString().slice(0,10);
  downloadBlob(zipArchive(contents),'6F-equipo-'+team+'-'+date+'.zip');
  notify('Proyecto completo descargado. Conservá este respaldo.');
 }catch(e){notify('No se pudo preparar el ZIP: '+e.message,true);}
 finally{button.disabled=false;button.textContent='Descargar proyecto ZIP';}
}
async function downloadFile(){
 if(!current)return;
 try{if(dirty&&!isBinary(current)){downloadBlob(new Blob([$('code').value],{type:'text/plain'}),current.split('/').pop());return;}
 const v=await getFile(current);downloadBlob(new Blob([v.binary?fromBase64(v.content):v.content],{type:v.binary?mime(current):'text/plain;charset=utf-8'}),current.split('/').pop());}
 catch(e){notify(e.message,true);}
}
function downloadDraft(){if(current&&!binary)downloadBlob(new Blob([$('code').value],{type:'text/plain;charset=utf-8'}),'borrador-'+current.replaceAll('/','-'));}
async function renderPreview(){
 const file=$('previewPage').value||previewPage;if(!file)return notify('Todavía no hay una página HTML.',true);
 try{
  $('showPreview').disabled=true;
  const docFile=file===current&&!binary?{content:$('code').value}:await getFile(file);
  const doc=new DOMParser().parseFromString(docFile.content,'text/html');
  const resolve=src=>{
   if(!src||/^(https?:|data:|mailto:|tel:|#|\/\/)/i.test(src))return null;
   try{return decodeURIComponent(new URL(src,'https://local.invalid/'+file).pathname.slice(1));}catch{return null;}
  };
  for(const link of [...doc.querySelectorAll('link[rel="stylesheet"][href]')]){
   const path=resolve(link.getAttribute('href'));if(path&&!isBinary(path)&&files.some(f=>f.file===path)){
    const css=path===current?{content:$('code').value}:await getFile(path);
    const el=doc.createElement('style');el.textContent=css.content;link.replaceWith(el);
   }
  }
  for(const script of [...doc.querySelectorAll('script[src]')]){
   const path=resolve(script.getAttribute('src'));if(path&&files.some(f=>f.file===path)&&!isBinary(path)){
    const js=path===current?{content:$('code').value}:await getFile(path);
    const el=doc.createElement('script');el.textContent=js.content;script.replaceWith(el);
   }
  }
  for(const img of [...doc.querySelectorAll('img[src]')]){
   const path=resolve(img.getAttribute('src'));if(path&&isBinary(path)&&files.some(f=>f.file===path)){
    const asset=await getFile(path);img.setAttribute('src','data:'+mime(path)+';base64,'+asset.content);
   }
  }
  const script=doc.createElement('script');
  script.textContent="document.addEventListener('click',function(e){const a=e.target.closest('a[href]');if(!a)return;const h=a.getAttribute('href');if(h&&!/^(https?:|#|mailto:|tel:|\\/\\/)/i.test(h)&&/\\.html?(?:#.*)?$/i.test(h)){e.preventDefault();parent.postMessage({kind:'6f-preview-nav',href:h},'*');}});";
  doc.body.append(script);
  $('previewFrame').srcdoc='<!doctype html>\n'+doc.documentElement.outerHTML;
  state(dirty?'Vista previa con cambios sin guardar.':'Vista previa actualizada.','ok');
 }catch(e){notify('Vista previa: '+e.message,true);}
 finally{$('showPreview').disabled=false;}
}
async function leaseHeartbeat(){
 if(!team||!current||!locked||role==='docente')return;
 try{await api('renew','POST',{file:current,session,owner:member});}
 catch(e){locked=false;editorEnabled();$('lockedNotice').hidden=false;$('lockedNotice').textContent='El bloqueo venció. Descargá tu borrador si hiciste cambios.';notify(e.message,true);}
}
async function login(e){
 e.preventDefault();const t=$('loginTeam').value,c=$('loginCode').value.trim(),n=$('loginName').value.trim();
 if(!t||!c||!n)return;
 team=t;code=c;member=n;
 try{
  const r=await api('login','POST',{code:c,team:t});role=r.role;
  $('loginView').hidden=true;$('workspace').hidden=false;$('logout').hidden=false;
  $('teamLabel').textContent='EQUIPO '+t+(role==='docente'?' · VISTA DOCENTE':'');
  $('projectName').textContent=projects[t]||'Proyecto web';
  $('workspaceInfo').textContent=role==='docente'?'Lectura y revisión. Los archivos no se pueden modificar desde la vista docente.':'Proyecto común: cada integrante edita archivos distintos o espera a que el otro termine.';
  if(role==='docente'){$('newFile').disabled=true;$('folderInput').disabled=true;$('filesInput').disabled=true;}
  await refreshFiles();
  const first=sortedFiles().includes('index.html')?'index.html':sortedFiles().find(f=>!isBinary(f));
  if(first)await openFile(first);
 }catch(err){notify(err.message,true);}
}
async function logout(){
 if(dirty&&!(await saveCurrent())){notify('Tenés cambios pendientes. Descargá tu borrador antes de salir.',true);return;}
 await release();code='';team='';current='';cache.clear();files=[];$('workspace').hidden=true;$('loginView').hidden=false;$('logout').hidden=true;$('loginCode').value='';$('connection').textContent='Sin conectar';$('connection').classList.remove('online');
}
window.addEventListener('message',async e=>{
 if(e.source!==$('previewFrame').contentWindow||e.data?.kind!=='6f-preview-nav')return;
 const v=String(e.data.href||'');const f=$('previewPage').value||previewPage;
 try{const path=decodeURIComponent(new URL(v,'https://local.invalid/'+f).pathname.slice(1));if(files.some(x=>x.file===path)&&/\.html?$/i.test(path)){$('previewPage').value=path;previewPage=path;await renderPreview();}}catch{}
});
$('loginForm').addEventListener('submit',login);$('logout').onclick=logout;
$('refreshFiles').onclick=refreshFiles;$('newFile').onclick=newFile;$('save').onclick=saveCurrent;
$('reload').onclick=async()=>{if(dirty&&!confirm('Hay cambios sin guardar. ¿Querés recargar y perder el borrador?'))return;const f=current;dirty=false;await openFile(f);};
$('code').addEventListener('input',markDirty);
$('code').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const x=$('code');x.setRangeText('  ',x.selectionStart,x.selectionEnd,'end');markDirty();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();saveCurrent();}});
$('folderInput').addEventListener('change',e=>importFiles(e.target,true));
$('filesInput').addEventListener('change',e=>importFiles(e.target,false));
$('showPreview').onclick=renderPreview;$('previewPage').onchange=e=>previewPage=e.target.value;
$('downloadCurrent').onclick=downloadFile;$('exportDraft').onclick=downloadDraft;$('exportZip').onclick=exportZip;
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
setInterval(leaseHeartbeat,40000);
setInterval(()=>{if(team)refreshFiles().catch(()=>{});},20000);
})();

