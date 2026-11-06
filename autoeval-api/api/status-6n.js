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

function cors(req, res) {
  const origin = req.headers.origin || '';
  if (origin === 'https://gusro16.github.io') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'Método no permitido' });

  try {
    const { blobs } = await list({ prefix: 'autoeval-6n/latest/' });
    const latestByTeam = new Map();

    for (const blob of blobs) {
      const result = await get(blob.pathname, { access: 'private' });
      if (!result || result.statusCode !== 200) continue;
      const text = await new Response(result.stream).text();
      const record = JSON.parse(text);
      if (!TEAMS.includes(record.equipo)) continue;

      const prev = latestByTeam.get(record.equipo);
      if (!prev || String(record.submittedAt || '') > String(prev.submittedAt || '')) {
        latestByTeam.set(record.equipo, {
          equipo: record.equipo,
          submittedAt: record.submittedAt || null
        });
      }
    }

    const entregaron = TEAMS
      .filter(team => latestByTeam.has(team))
      .map(team => latestByTeam.get(team));
    const faltan = TEAMS.filter(team => !latestByTeam.has(team));

    return res.status(200).json({
      ok: true,
      totalEquipos: TEAMS.length,
      totalEntregas: entregaron.length,
      entregaron,
      faltan,
      actualizado: new Date().toISOString()
    });
  } catch (error) {
    console.error('AUTOEVAL_6N_STATUS_ERROR', error);
    return res.status(500).json({ ok:false, error:'No se pudo consultar el estado' });
  }
}
