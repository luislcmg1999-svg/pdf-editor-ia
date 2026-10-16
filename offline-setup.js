// Descarga pdf.js, pdf-lib, JSZip y las fuentes, e incrusta todo en app/index.html.
// Ejecutar UNA VEZ con internet:  npm run offline
// Despues, app/index.html funciona 100% sin internet (la IA sigue usando red por diseno).
const fs = require('fs'), path = require('path'), https = require('https');

const DL = {
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js': 'jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js': 'pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js': 'pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js': 'pdf-lib.min.js',
  'https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js': 'fontkit.umd.min.js',
  'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf': 'DejaVuSans.ttf',
  'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf': 'DejaVuSans-Bold.ttf',
};
function get(u, n = 0) {
  return new Promise((res, rej) => https.get(u, r => {
    if (r.statusCode >= 300 && r.statusCode < 400 && n < 5) return get(r.headers.location, n + 1).then(res, rej);
    if (r.statusCode !== 200) return rej(new Error('HTTP ' + r.statusCode + ' en ' + u));
    const ch = []; r.on('data', c => ch.push(c)); r.on('end', () => res(Buffer.concat(ch))); r.on('error', rej);
  }).on('error', rej));
}

(async () => {
  const dir = path.join(__dirname, 'app');
  const file = path.join(dir, 'index.html');
  if (!fs.existsSync(file + '.bak-online')) fs.copyFileSync(file, file + '.bak-online'); // copia de seguridad
  let html = fs.readFileSync(file, 'utf8');

  // 0) Normalizar finales de linea (si el archivo vino con CRLF de Windows)
  if (html.includes('\r')) { console.log('Detectados finales de linea CRLF; normalizando.'); html = html.replace(/\r\n?/g, '\n'); }

  const F = {};
  for (const [u, n] of Object.entries(DL)) { console.log('Descargando ' + n + ' ...'); F[n] = await get(u); }

  // 1) Quitar scripts CDN y ponerlos locales
  html = html.replace(/\s*<script src="https:\/\/cdnjs\.cloudflare\.com[^"]+"><\/script>/g, '');
  html = html.replace(/\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@pdf-lib\/fontkit[^"]+"><\/script>/g, '');
  fs.mkdirSync(path.join(dir, 'lib'), { recursive: true });
  for (const n of ['jszip.min.js', 'pdf.min.js', 'pdf-lib.min.js', 'fontkit.umd.min.js']) fs.writeFileSync(path.join(dir, 'lib', n), F[n]);
  const firstOpen = html.indexOf('<script>');
  if (firstOpen < 0) throw new Error('No encontre el primer <script> del archivo.');
  const libTags = '<script src="lib/jszip.min.js"></script>\n<script src="lib/pdf.min.js"></script>\n<script src="lib/pdf-lib.min.js"></script>\n<script src="lib/fontkit.umd.min.js"></script>\n';
  html = html.slice(0, firstOpen) + libTags + html.slice(firstOpen);

  // 2) Worker de pdf.js incrustado como blob, insertado de forma robusta
  const w = F['pdf.worker.min.js'].toString('utf8').replace(/<\/script/gi, '<\\/script');
  const anchor = "pdfjsLib.GlobalWorkerOptions.workerSrc='pdf.worker.min.js';";
  const idx = html.indexOf(anchor);
  if (idx < 0) throw new Error('No encontre el workerSrc (ya es offline?). Restaura index.html.bak-online');
  const openIdx = html.lastIndexOf('<script>', idx);
  if (openIdx < 0) throw new Error('No encontre la apertura del script principal.');
  html = html.slice(0, openIdx) + '<script id="pdfw" type="text/plain">' + w + '</script>\n' + html.slice(openIdx);
  html = html.replace(anchor, "pdfjsLib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob([document.getElementById('pdfw').textContent],{type:'text/javascript'}));");
  if (!html.includes('id="pdfw"')) throw new Error('FALLO: el bloque pdfw no quedo insertado.');

  // 3) Fuentes incrustadas como data URL
  html = html.replace(/const FONTURL='[^']+';/, "const FONTURL='data:font/ttf;base64," + F['DejaVuSans.ttf'].toString('base64') + "';");
  html = html.replace(/const FONTBOLD='[^']+';/, "const FONTBOLD='data:font/ttf;base64," + F['DejaVuSans-Bold.ttf'].toString('base64') + "';");
  if (!html.includes('data:font/ttf')) throw new Error('FALLO: las fuentes no quedaron incrustadas.');

  // 4) AUTOCHEQUEO: compilar cada bloque <script> inline antes de escribir
  const blocks = [...html.matchAll(/<script>\n([\s\S]*?)\n<\/script>/g)].map(m => m[1]);
  blocks.forEach((b, i) => { try { new Function(b); } catch (e) { throw new Error('Error de sintaxis en el bloque JS ' + (i + 1) + ': ' + e.message); } });

  fs.writeFileSync(file, html);
  console.log('LISTO y VERIFICADO: app/index.html es 100% offline (' + Math.round(Buffer.byteLength(html) / 1024 / 1024 * 10) / 10 + ' MB). ' + blocks.length + ' bloques JS compilados OK.');
})().catch(e => { console.error('FALLO:', e.message); process.exit(1); });
