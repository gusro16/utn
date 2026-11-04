import { put } from '@vercel/blob';

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
  'De Benedictis'
];

function cors(req, res) {
  const origin = req.headers.origin || '';
  if (origin === 'https://gusro16.github.io') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Autoeval-Test,Authorization');
  res.setHeader('Cache-Control', 'no-store');
}

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function bad(res, status, error) {
  return res.status(status).json({ ok: false, error });
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return bad(res, 405, 'Método no permitido');

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { equipo, rubrica, visual, origen } = body;

    if (!TEAMS.includes(equipo)) return bad(res, 400, 'Equipo inválido');
    if (!rubrica || typeof rubrica !== 'object' || Array.isArray(rubrica)) {
      return bad(res, 400, 'Rúbrica inválida');
    }

    const entries = Object.entries(rubrica);
    if (entries.length !== 24) return bad(res, 400, 'La rúbrica debe tener 24 criterios respondidos');
    if (entries.some(([, value]) => !Number.isInteger(value) || value < 0 || value > 3)) {
      return bad(res, 400, 'Hay respuestas de rúbrica inválidas');
    }

    const visualSafe = Array.isArray(visual) ? visual.slice(0, 12).map(Boolean) : [];
    const submittedAt = new Date().toISOString();
    const record = {
      version: 1,
      equipo,
      rubrica,
      visual: visualSafe,
      origen: origen || '6N Proyecto Web 2026',
      submittedAt
    };

    const isTest = req.headers['x-autoeval-test'] &&
      req.headers['x-autoeval-test'] === process.env.REPORT_SECRET;

    const slug = slugify(equipo);
    const json = JSON.stringify(record, null, 2);

    if (isTest) {
      const pathname = `autoeval-6n/test/${Date.now()}-${slug}.json`;
      await put(pathname, json, {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false
      });
      return res.status(200).json({ ok: true, test: true, equipo, submittedAt });
    }

    const latestPath = `autoeval-6n/latest/${slug}.json`;
    const historyPath = `autoeval-6n/history/${submittedAt.replace(/[:.]/g, '-')}-${slug}.json`;

    const [latest] = await Promise.all([
      put(latestPath, json, {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true
      }),
      put(historyPath, json, {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false
      })
    ]);

    const receipt = String(latest.etag || '').replace(/"/g, '').slice(-10) || String(Date.now()).slice(-10);
    console.log('AUTOEVAL_6N_SAVED', equipo, submittedAt, receipt);
    return res.status(200).json({ ok: true, equipo, submittedAt, receipt });
  } catch (error) {
    console.error('AUTOEVAL_6N_ERROR', error);
    return bad(res, 500, 'No se pudo guardar la autoevaluación. Probá nuevamente.');
  }
}
