module.exports=async(req,res)=>{
  try{
    const clientId=process.env.GOOGLE_CLIENT_ID;
    const clientSecret=process.env.GOOGLE_CLIENT_SECRET;
    const host=req.headers['x-forwarded-host']||req.headers.host;
    const proto=(req.headers['x-forwarded-proto']||'https').split(',')[0];
    const redirect=proto+'://'+host+'/api/auth-google-callback';
    const r=await fetch('https://oauth2.googleapis.com/token',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({
        code:'health-check-invalid-code',
        client_id:clientId,
        client_secret:clientSecret,
        redirect_uri:redirect,
        grant_type:'authorization_code'
      })
    });
    const j=await r.json();
    const ok=j.error==='invalid_grant';
    res.statusCode=ok?200:500;
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({ok,googleError:j.error||null}));
  }catch(e){
    res.statusCode=500;
    res.end(JSON.stringify({ok:false,error:'health_failed'}));
  }
};