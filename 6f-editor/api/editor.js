import {createHash,timingSafeEqual,randomUUID} from 'node:crypto';
import {get,put,list} from '@vercel/blob';
const ROOT='6f-2026/v1', LEASE=120000, MAX_TEXT=250000, MAX_BINARY=3500000;
const ALL=['01','02','03','04','05','06','07','08','09','10','11','12','14'];
const binaryExt=/\.(png|jpe?g|webp|gif|svg|pdf)$/i;
const validPath=(p)=>typeof p==='string'&&p.length<=220&&/\.(html?|css|js|mjs|json|txt|png|jpe?g|webp|gif|svg|pdf)$/i.test(p)&&!p.startsWith('/')&&!p.includes('\\')&&!/[\x00-\x1f\x7f]/.test(p)&&p.split('/').every(x=>x&&x!=='.'&&x!=='..'&&!x.startsWith('.'));
const errorConflict=(e)=>/Precondition|AlreadyExists|already exists|409|412/i.test(String(e?.name)+' '+String(e?.message));
function secureEqual(a,b){if(typeof a!=='string'||typeof b!=='string')return false;return timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest());}
function reply(res,n,data){res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');res.status(n).json(data);}
function codes(){try{return JSON.parse(process.env.EDITOR_TEAM_CODES||'{}')}catch{return{}}}
function auth(code,team){if(process.env.EDITOR_ADMIN_CODE&&secureEqual(code,process.env.EDITOR_ADMIN_CODE))return'docente';if(ALL.includes(team)&&codes()[team]&&secureEqual(code,codes()[team]))return'equipo';return null;}
const base=(t)=>ROOT+'/teams/'+t+'/';
const current=(t,f)=>base(t)+'current/'+f;
const lock=(t,f)=>base(t)+'locks/'+encodeURIComponent(f)+'.json';
const history=(t,f)=>base(t)+'history/'+encodeURIComponent(f)+'/';
async function read(path){const r=await get(path,{access:'private'});if(!r||r.statusCode!==200||!r.stream)return null;return {bytes:Buffer.from(await new Response(r.stream).arrayBuffer()),etag:r.blob.etag};}
async function pages(prefix,max=300){let cursor,out=[];do{const p=await list({prefix,limit:Math.min(100,max-out.length),cursor});out.push(...p.blobs);cursor=p.hasMore?p.cursor:null;}while(cursor&&out.length<max);return out;}
function bodyOf(req){if(typeof req.body==='string')return JSON.parse(req.body);return req.body||{};}
function mime(f){if(/\.html?$/i.test(f))return'text/html; charset=utf-8';if(/\.css$/i.test(f))return'text/css; charset=utf-8';if(/\.(js|mjs)$/i.test(f))return'text/javascript; charset=utf-8';if(/\.json$/i.test(f))return'application/json';if(/\.png$/i.test(f))return'image/png';if(/\.jpe?g$/i.test(f))return'image/jpeg';if(/\.webp$/i.test(f))return'image/webp';if(/\.gif$/i.test(f))return'image/gif';if(/\.svg$/i.test(f))return'image/svg+xml';if(/\.pdf$/i.test(f))return'application/pdf';return'text/plain; charset=utf-8';}
async function changeLock(t,f,action,b){
 const session=String(b.session||'');if(!/^[a-f0-9-]{32,40}$/i.test(session))return[400,{error:'Identificador de sesión no válido.'}];
 const path=lock(t,f),old=await read(path),value=old?JSON.parse(old.bytes.toString('utf8')):null,now=Date.now();
 if(value&&value.expires>now&&value.session!==session)return[423,{error:'Otro integrante está editando este archivo.',owner:value.owner,expires:value.expires}];
 if(action==='release'&&(!value||value.session!==session))return[409,{error:'El archivo ya no está bloqueado por esta sesión.'}];
 if(action==='renew'&&(!value||value.session!==session||value.expires<=now))return[423,{error:'Se venció tu turno de edición. Abrí el archivo otra vez.'}];
 const next={session:action==='release'?'released':session,owner:String(b.owner||'Integrante').slice(0,32),expires:action==='release'?0:now+LEASE,updatedAt:new Date().toISOString()};
 try{const opts={access:'private',contentType:'application/json'};if(old){opts.allowOverwrite=true;opts.ifMatch=old.etag;}
   await put(path,JSON.stringify(next),opts);return[200,{ok:true,expires:next.expires}];
 }catch(e){if(errorConflict(e))return[423,{error:'Otro integrante cambió el estado del archivo. Volvé a intentarlo.'}];throw e;}
}
async function ownsLease(t,f,session){const p=await read(lock(t,f));if(!p)return false;try{const l=JSON.parse(p.bytes.toString('utf8'));return l.session===session&&l.expires>Date.now();}catch{return false;}}
async function save(t,f,b){
 if(!await ownsLease(t,f,b.session))return[423,{error:'El bloqueo de edición venció o no te pertenece. Abrí el archivo nuevamente.'}];
 if(typeof b.content!=='string')return[400,{error:'Contenido de archivo inválido.'}];
 const binary=binaryExt.test(f);if(binary!==!!b.binary)return[400,{error:'Formato de archivo incorrecto.'}];
 const bytes=binary?Buffer.from(b.content,'base64'):Buffer.from(b.content,'utf8');
 if(bytes.length>(binary?MAX_BINARY:MAX_TEXT))return[413,{error:'El archivo excede el tamaño permitido.'}];
 const prev=await read(current(t,f)),etag=typeof b.etag==='string'?b.etag:null;
 if((prev&&etag!==prev.etag)||(!prev&&etag))return[409,{error:'El archivo cambió en el servidor. Tu borrador sigue en pantalla; no se sobrescribió.'}];
 if(prev){
   const archived={file:f,archivedAt:new Date().toISOString(),actor:String(b.owner||'Integrante').slice(0,32),previousEtag:prev.etag,binary,base64:prev.bytes.toString('base64')};
   await put(history(t,f)+Date.now()+'-'+randomUUID()+'.json',JSON.stringify(archived),{access:'private',contentType:'application/json',allowOverwrite:false});
 }
 try{const opts={access:'private',contentType:mime(f)};if(prev){opts.ifMatch=prev.etag;opts.allowOverwrite=true;}
    const saved=await put(current(t,f),bytes,opts);
    return[200,{ok:true,file:f,etag:saved.etag,savedAt:new Date().toISOString(),bytes:bytes.length}];
 }catch(e){if(errorConflict(e))return[409,{error:'Otro guardado llegó antes. Conservamos tu borrador; recargá la versión vigente.'}];throw e;}
}
export default async function handler(req,res){
 try{
   if(!process.env.BLOB_READ_WRITE_TOKEN||!process.env.EDITOR_TEAM_CODES||!process.env.EDITOR_ADMIN_CODE)return reply(res,503,{error:'Editor sin configurar. No se guardó nada.'});
   const action=String(req.query?.action||'').toLowerCase(),b=req.method==='POST'?bodyOf(req):{},team=String(b.team||req.query?.team||''),code=String(req.headers['x-team-code']||b.code||''),role=auth(code,team);
   if(action==='login'&&req.method==='POST'){if(!role)return reply(res,401,{error:'Código incorrecto.'});return reply(res,200,{ok:true,role,team:role==='docente'?(ALL.includes(team)?team:null):team,teams:role==='docente'?ALL:undefined});}
   if(!role||!ALL.includes(team))return reply(res,401,{error:'Acceso no autorizado.'});
   if(action==='files'&&req.method==='GET'){
     const prefix=base(team)+'current/',blobs=await pages(prefix);
     return reply(res,200,{ok:true,files:blobs.map(x=>({file:x.pathname.slice(prefix.length),size:x.size,updated:x.uploadedAt})).filter(x=>validPath(x.file))});
   }
   const file=String(b.file||req.query?.file||'');if(!validPath(file))return reply(res,400,{error:'Nombre de archivo inválido.'});
   if(action==='open'&&req.method==='GET'){const p=await read(current(team,file));if(!p)return reply(res,404,{error:'Archivo no encontrado.'});const binary=binaryExt.test(file);return reply(res,200,{ok:true,etag:p.etag,file,binary,content:binary?p.bytes.toString('base64'):p.bytes.toString('utf8')});}
   if(action==='history'&&req.method==='GET'){const prefix=history(team,file),versions=await pages(prefix,100);return reply(res,200,{ok:true,versions:versions.map(v=>({id:v.pathname.slice(prefix.length),date:v.uploadedAt})).sort((a,b)=>b.id.localeCompare(a.id))});}
   if(action==='revision'&&req.method==='GET'){const id=String(req.query?.id||'');if(!/^\d{13}-[0-9a-f-]{36}\.json$/.test(id))return reply(res,400,{error:'Revisión inválida.'});const v=await read(history(team,file)+id);if(!v)return reply(res,404,{error:'Revisión no encontrada.'});return reply(res,200,{ok:true,revision:JSON.parse(v.bytes.toString('utf8'))});}
   if(['claim','renew','release'].includes(action)&&req.method==='POST'){const [status,data]=await changeLock(team,file,action,b);return reply(res,status,data);}
   if(action==='save'&&req.method==='POST'){const [status,data]=await save(team,file,b);return reply(res,status,data);}
   return reply(res,405,{error:'Acción o método no disponible.'});
 }catch(e){console.error('6f-editor',e?.name,e?.message);return reply(res,500,{error:'Error de servidor. Conservá tu borrador y avisá al profesor.'});}
}
