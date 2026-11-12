const {makeToken,parseToken,json}=require('./_session');
const {teams}=require('./_teams');

function visible(session){
  if(!session) return {error:'unauthenticated'};
  if(session.role==='teacher') return {role:'teacher',teams:Object.keys(teams)};
  if(!session.teamKey||!teams[session.teamKey]) return {error:'account_not_mapped'};
  return {role:'student',teamKey:session.teamKey,team:teams[session.teamKey]};
}
module.exports=(req,res)=>{
  const token=String(req.query?.token||'');
  if(!process.env.DEMO_AUTH_TOKEN||token!==process.env.DEMO_AUTH_TOKEN) return json(res,403,{error:'forbidden'});
  const a=parseToken(makeToken({role:'student',teamKey:'bonaventura-vidal',email:'a@northfield.edu.ar',name:'A'}));
  const b=parseToken(makeToken({role:'student',teamKey:'ruiz-barassi-anso',email:'b@northfield.edu.ar',name:'B'}));
  const t=parseToken(makeToken({role:'teacher',teamKey:null,email:'docente@northfield.edu.ar',name:'Docente'}));
  const va=visible(a), vb=visible(b), vt=visible(t);
  const ok=
    va.role==='student' && va.teamKey==='bonaventura-vidal' && !('teams' in va) &&
    vb.role==='student' && vb.teamKey==='ruiz-barassi-anso' && !('teams' in vb) &&
    vt.role==='teacher' && Array.isArray(vt.teams) && vt.teams.length===15 &&
    va.teamKey!==vb.teamKey;
  json(res,ok?200:500,{
    ok,
    checks:{
      signedSessionRoundtrip:Boolean(a&&b&&t),
      studentASeesOnlyOwn:va.role==='student'&&va.teamKey==='bonaventura-vidal'&&!('teams' in va),
      studentBSeesOnlyOwn:vb.role==='student'&&vb.teamKey==='ruiz-barassi-anso'&&!('teams' in vb),
      studentsSeparated:va.teamKey!==vb.teamKey,
      teacherSeesAll:vt.role==='teacher'&&Array.isArray(vt.teams)&&vt.teams.length===15
    }
  });
};