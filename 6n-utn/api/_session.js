const crypto = require('crypto');

const COOKIE='utn6n_session';
const MAX_AGE=60*60*8;

function b64url(input){
  return Buffer.from(input).toString('base64url');
}
function sign(value){
  const secret=process.env.SESSION_SECRET||'';
  return crypto.createHmac('sha256',secret).update(value).digest('base64url');
}
function makeToken(payload){
  const body=b64url(JSON.stringify({...payload,exp:Date.now()+MAX_AGE*1000}));
  return body+'.'+sign(body);
}
function parseToken(token){
  if(!token||!token.includes('.')) return null;
  const [body,sig]=token.split('.');
  const expected=sign(body);
  const a=Buffer.from(sig||'');
  const b=Buffer.from(expected||'');
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return null;
  try{
    const payload=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));
    if(!payload.exp || Date.now()>payload.exp) return null;
    return payload;
  }catch{return null}
}
function parseCookies(req){
  const out={};
  String(req.headers.cookie||'').split(';').forEach(part=>{
    const i=part.indexOf('=');
    if(i>0) out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1).trim());
  });
  return out;
}
function getSession(req){
  return parseToken(parseCookies(req)[COOKIE]);
}
function setSession(res,payload){
  const token=makeToken(payload);
  res.setHeader('Set-Cookie',COOKIE+'='+encodeURIComponent(token)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+MAX_AGE);
}
function clearSession(res){
  res.setHeader('Set-Cookie',COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
}
function json(res,status,data){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(data));
}
module.exports={getSession,setSession,clearSession,json};
