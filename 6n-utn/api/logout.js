const {clearSession,json}=require('./_session');
module.exports=(req,res)=>{clearSession(res);json(res,200,{ok:true});};