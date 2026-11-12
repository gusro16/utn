const {teams}=require('./_teams');
const {json}=require('./_session');
module.exports=(req,res)=>{
  const supplied=String(req.headers['x-demo-token']||'');
  if(!process.env.DEMO_AUTH_TOKEN||supplied!==process.env.DEMO_AUTH_TOKEN) return json(res,403,{error:'forbidden'});
  json(res,200,{teams:Object.entries(teams).map(([key,t])=>({key,team:t.team})),teacher:true});
};