import { list, get } from '@vercel/blob';

const TEAMS = [
  'Paterno / Tinnirello',
  'Serio / Ledesma',
  'Tartufoli / Converso',
  'Lagrotta / Arcas',
  'Resumil / Medrano',
  'Bonaventura / Vidal',
  'Veleche / Bedascarrasbure',
  'Castellano / Tagliatti',
  'Benetti / Pagura',
  'Pace / López Letizia',
  'Di Filippo / Martínez Merino',
  'Ruiz Barassi / Ansó',
  'Sosa / Bolli',
  'Giavedoni',
  'De Benedictis',
  'Spollansky / Figueira'
];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'Método no permitido' });

  const auth = req.headers.authorization || '';
  if (!process.env.REPORT_SECRET || auth !== `Bearer ${process.env.REPORT_SECRET}`) {
    return res.status(401).json({ ok:false, error:'No autorizado' });
  }

  try {
    const { blobs } = await list({ prefix: 'autoeval-6n/latest/' });
    const entregas = [];

    for (const blob of blobs) {
      const result = await get(blob.pathname, { access: 'private' });
      if (!result || result.statusCode !== 200) continue;
      const text = await new Response(result.stream).text();
      const record = JSON.parse(text);
      entregas.push({
        equipo: record.equipo,
        submittedAt: record.submittedAt,
        rubricaRespondida: Object.keys(record.rubrica || {}).length,
        checklistVisual: Array.isArray(record.visual) ? record.visual.filter(Boolean).length : 0
      });
    }

    entregas.sort((a,b) => a.equipo.localeCompare(b.equipo, 'es'));
    const enviados = new Set(entregas.map(x => x.equipo));
    const faltan = TEAMS.filter(t => !enviados.has(t));

    return res.status(200).json({
      ok:true,
      totalEquipos:TEAMS.length,
      totalEntregas:entregas.length,
      entregas,
      faltan
    });
  } catch (error) {
    console.error('AUTOEVAL_6N_REPORT_ERROR', error);
    return res.status(500).json({ ok:false, error:'No se pudo generar el informe' });
  }
}
