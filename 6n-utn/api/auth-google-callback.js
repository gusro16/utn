const {setSession}=require('./_session');
const {emailToTeam}=require('./_teams');

function cookie(req,name){
  for(const part of String(req.headers.cookie||'').split(';')){
    const i=part.indexOf('=');
    if(i>0 && part.slice(0,i).trim()===name) return decodeURIComponent(part.slice(i+1).trim());
  }
  return '';
}
module.exports=async(req,res)=>{
  try{
    const {code,state,error}=req.query||{};
    if(error) throw new Error('google_'+error);
    if(!code||!state||state!==cookie(req,'utn6n_oauth_state')) throw new Error('invalid_state');
    const clientId=process.env.GOOGLE_CLIENT_ID;
    const clientSecret=process.env.GOOGLE_CLIENT_SECRET;
    if(!clientId||!clientSecret) throw new Error('oauth_not_configured');
    const host=req.headers['x-forwarded-host']||req.headers.host;
    const proto=(req.headers['x-forwarded-proto']||'https').split(',')[0];
    const redirect=proto+'://'+host+'/api/auth-google-callback';
    const tokenRes=await fetch('https://oauth2.googleapis.com/token',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({code,client_id:clientId,client_secret:clientSecret,redirect_uri:redirect,grant_type:'authorization_code'})
    });
    const token=await tokenRes.json();
    if(!token.id_token) throw new Error('no_id_token');
    const verifyRes=await fetch('https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(token.id_token));
    const profile=await verifyRes.json();
    const domain=process.env.ALLOWED_DOMAIN||'northfield.edu.ar';
    if(!verifyRes.ok||profile.aud!==clientId||profile.email_verified!=='true'||profile.hd!==domain) throw new Error('domain_not_allowed');
    const email=String(profile.email||'').toLowerCase();
    const teacherEmails=String(process.env.TEACHER_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
    let role='student',teamKey=emailToTeam[email]||null;
    if(teacherEmails.includes(email)){role='teacher';teamKey=null;}
    setSession(res,{email,name:profile.name||email,role,teamKey});
    res.setHeader('Set-Cookie',[
      res.getHeader('Set-Cookie'),
      'utn6n_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    ]);
    res.statusCode=302;
    res.setHeader('Location','/?auth=ok#situacion');
    res.end();
  }catch(e){
    res.statusCode=302;
    res.setHeader('Location','/?auth=error#situacion');
    res.end();
  }
};