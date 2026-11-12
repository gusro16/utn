const {getSession,json}=require('./_session');
module.exports=(req,res)=>{
  const s=getSession(req);
  if(!s) return json(res,200,{authenticated:false});
  json(res,200,{authenticated:true,user:{name:s.name,email:s.email,role:s.role,teamKey:s.teamKey}});
};