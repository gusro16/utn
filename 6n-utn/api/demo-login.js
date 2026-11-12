const {setSession,json}=require('./_session');
const {teams}=require('./_teams');
module.exports=(req,res)=>{
  if(req.method!=='POST') return json(res,405,{error:'method_not_allowed'});
  const supplied=String(req.headers['x-demo-token']||'');
  if(!process.env.DEMO_AUTH_TOKEN||supplied!==process.env.DEMO_AUTH_TOKEN) return json(res,403,{error:'forbidden'});
  const teamKey=String(req.query?.team||'');
  const role=teamKey==='teacher'?'teacher':'student';
  if(role==='student'&&!teams[teamKey]) return json(res,400,{error:'invalid_team'});
  setSession(res,{email:'demo@northfield.edu.ar',name:role==='teacher'?'Profesor · modo prueba':'Alumno · modo prueba',role,teamKey:role==='student'?teamKey:null,demo:true});
  json(res,200,{ok:true,role,teamKey:role==='student'?teamKey:null});
};