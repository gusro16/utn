const {getSession,json}=require('./_session');
const {teams}=require('./_teams');
module.exports=(req,res)=>{
  const s=getSession(req);
  if(!s) return json(res,401,{error:'unauthenticated'});
  if(s.role==='teacher'){
    return json(res,200,{role:'teacher',teams:Object.entries(teams).map(([key,value])=>({key,...value}))});
  }
  if(!s.teamKey) return json(res,403,{error:'account_not_mapped'});
  const team=teams[s.teamKey];
  if(!team) return json(res,403,{error:'team_not_found'});
  json(res,200,{role:'student',team:{key:s.teamKey,...team}});
};