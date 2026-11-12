(()=> {
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

function card(t){
  const utn=t.utn==null?'Pendiente / no válido':t.utn+'/100';
  const site=t.site?'<a class="primary" href="'+esc(t.site)+'" target="_blank" rel="noopener">🌐 Ver sitio presentado</a>':'';
  const rubric=t.rubric?'<a href="'+esc(t.rubric)+'" target="_blank" rel="noopener">📊 Ver rúbrica UTN</a>':'';
  return '<article class="sit-team" data-state="'+esc(t.state)+'">'+
    '<div class="sit-team-top"><div><h3>'+esc(t.team)+'</h3><div class="sit-members">'+esc(t.members)+'</div></div><span class="sit-badge '+esc(t.state)+'">'+esc(t.badge)+'</span></div>'+
    '<div class="sit-scores"><div class="sit-score"><small>Proceso · desarrollo</small><strong>'+esc(t.proc1)+'</strong></div><div class="sit-score"><small>Proceso · avance</small><strong>'+esc(t.proc2)+'</strong></div><div class="sit-score"><small>UTN</small><strong>'+esc(utn)+'</strong></div></div>'+
    '<div class="sit-status"><b>Cómo están hoy</b>'+esc(t.status)+'</div>'+
    '<div class="sit-action"><b>Qué les pido ahora</b>'+esc(t.action)+'</div>'+
    (t.state==='approved'?'':'<div class="sit-evidence"><b>Mientras trabajan:</b> anoten qué cambiaron, en qué archivo o parte del sitio y por qué. Eso después les va a servir para preparar la defensa sin tener que memorizar nada.</div>')+
    '<div class="sit-links">'+site+rubric+'</div>'+
  '</article>';
}

function loginView(message=''){
  const grid=$('#situacion6nGrid');
  if(!grid)return;
  grid.innerHTML='<div class="sit-login card">'+
    '<div class="sit-login-icon">🔐</div>'+
    '<p class="eyebrow">ACCESO PRIVADO</p>'+
    '<h3>Entrá con tu cuenta institucional</h3>'+
    '<p>Quiero que cada equipo vea únicamente su propia devolución, sus notas y la rúbrica que le corresponde.</p>'+
    (message?'<div class="sit-login-msg">'+esc(message)+'</div>':'')+
    '<a class="primary sit-google-btn" href="/api/auth-google-start">Ingresar con Google</a>'+
    '<small>Usá la cuenta institucional del colegio. Si tu cuenta todavía no está asociada a un equipo, avisame.</small>'+
  '</div>';
  $$('.sit-filter').forEach(x=>x.style.display='none');
  const count=$('#situacionCount'); if(count) count.textContent='Acceso privado';
}

function studentView(user,team){
  const grid=$('#situacion6nGrid'); if(!grid)return;
  grid.innerHTML='<div class="sit-userbar card"><div><small>Ingresaste como</small><strong>'+esc(user.name||user.email)+'</strong><span>'+esc(user.email||'')+'</span></div><button id="sitLogout">Cerrar sesión</button></div>'+card(team);
  $$('.sit-filter').forEach(x=>x.style.display='none');
  const count=$('#situacionCount'); if(count) count.textContent='Tu equipo';
  $('#sitLogout')?.addEventListener('click',logout);
}

function teacherView(user,teams){
  const grid=$('#situacion6nGrid'); if(!grid)return;
  grid.innerHTML='<div class="sit-userbar card"><div><small>Vista docente</small><strong>'+esc(user.name||user.email)+'</strong><span>'+esc(user.email||'')+'</span></div><button id="sitLogout">Cerrar sesión</button></div>'+
    '<div id="sitTeacherCards">'+teams.map(card).join('')+'</div>';
  const cards=$('#sitTeacherCards');
  if(cards){cards.className='sit-grid';}
  $$('.sit-filter').forEach(x=>x.style.display='flex');
  const count=$('#situacionCount'); if(count) count.textContent=teams.length+' equipos';
  $('#sitLogout')?.addEventListener('click',logout);
  $$('[data-sit-filter]').forEach(btn=>btn.onclick=()=>{
    $$('[data-sit-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.sitFilter;
    cards.innerHTML=teams.filter(t=>f==='all'||t.state===f).map(card).join('');
  });
}

async function logout(){
  await fetch('/api/logout',{method:'POST'}).catch(()=>{});
  location.href='/?logout=1#situacion';
}

async function loadPrivate(){
  const params=new URLSearchParams(location.search);
  const auth=params.get('auth');
  if(auth==='error') loginView('No pude validar esa cuenta. Probá otra vez con la cuenta institucional.');
  else if(auth==='setup') loginView('El acceso con Google todavía no está conectado en esta versión de prueba.');
  else loginView();

  const session=await fetch('/api/session',{cache:'no-store'}).then(r=>r.json()).catch(()=>({authenticated:false}));
  if(!session.authenticated) return;
  const data=await fetch('/api/team',{cache:'no-store'}).then(async r=>({ok:r.ok,status:r.status,body:await r.json()})).catch(()=>null);
  if(!data) return loginView('No pude cargar tu información. Recargá la página.');
  if(!data.ok){
    if(data.status===403) return loginView('Tu cuenta ingresó correctamente, pero todavía no está asociada a un equipo. Avisame y lo corrijo.');
    return loginView('No pude cargar tu información. Volvé a ingresar.');
  }
  if(data.body.role==='teacher') teacherView(session.user,data.body.teams||[]);
  else studentView(session.user,data.body.team);
}

async function initDemo(){
  const params=new URLSearchParams(location.search);
  const token=params.get('token');
  if(params.get('modo')!=='prueba'||!token) return false;
  const area=document.createElement('div');
  area.className='sit-demo card';
  area.innerHTML='<p class="eyebrow">MODO PRUEBA · SOLO DOCENTE</p><h3>Probá cómo entra cada equipo</h3><p>Esto simula la identidad institucional. Sirve únicamente para comprobar que un equipo no pueda ver la información de otro.</p><div class="sit-demo-row"><select id="sitDemoSelect"><option>Cargando equipos…</option></select><button id="sitDemoEnter">Entrar como</button></div>';
  const section=$('#situacion .sit-head');
  section?.insertAdjacentElement('afterend',area);
  const response=await fetch('/api/demo-teams',{headers:{'x-demo-token':token},cache:'no-store'});
  if(!response.ok){area.remove(); return false;}
  const data=await response.json();
  const select=$('#sitDemoSelect');
  select.innerHTML='<option value="teacher">Profesor · ver todos</option>'+data.teams.map(x=>'<option value="'+esc(x.key)+'">'+esc(x.team)+'</option>').join('');
  $('#sitDemoEnter').onclick=async()=>{
    const team=select.value;
    const r=await fetch('/api/demo-login?team='+encodeURIComponent(team),{method:'POST',headers:{'x-demo-token':token}});
    if(r.ok){location.hash='situacion';await loadPrivate();}
  };
  return true;
}

async function init(){
  const grid=$('#situacion6nGrid'); if(!grid)return;
  await initDemo();
  await loadPrivate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();