const crypto=require('crypto');
module.exports=(req,res)=>{
  const clientId=process.env.GOOGLE_CLIENT_ID;
  if(!clientId){
    res.statusCode=302;
    res.setHeader('Location','/?auth=setup#situacion');
    return res.end();
  }
  const host=req.headers['x-forwarded-host']||req.headers.host;
  const proto=(req.headers['x-forwarded-proto']||'https').split(',')[0];
  const redirect=proto+'://'+host+'/api/auth-google-callback';
  const state=crypto.randomBytes(24).toString('hex');
  res.setHeader('Set-Cookie','utn6n_oauth_state='+state+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600');
  const p=new URLSearchParams({
    client_id:clientId,
    redirect_uri:redirect,
    response_type:'code',
    scope:'openid email profile',
    state,
    hd:process.env.ALLOWED_DOMAIN||'northfield.edu.ar',
    prompt:'select_account'
  });
  res.statusCode=302;
  res.setHeader('Location','https://accounts.google.com/o/oauth2/v2/auth?'+p.toString());
  res.end();
};