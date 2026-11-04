export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok:true, service:'utn-6n-autoeval', time:new Date().toISOString() });
}
