# Editor PDF Pro → EXE para Windows (interfaz estilo Office) (100% OFFLINE + IA)

App de escritorio con Electron. Edita PDF sin que NADA salga de tu PC.
La IA (Kimi/Moonshot por defecto, u OpenAI/Claude/Gemini/DeepSeek/local) es lo
único que usa internet, porque necesita hablar con su servidor.

## PASO 1 — Requisitos
- Node.js 18+ (LTS): https://nodejs.org
- Internet solo para este paso y el PASO 2. Después, todo funciona sin red.

## PASO 2 — Volverlo offline (una sola vez, con internet)
En una terminal dentro de esta carpeta:
    npm install
    npm run offline

Esto descarga pdf.js, pdf-lib, JSZip y las fuentes, y las incrusta en
app/index.html. Verás: "LISTO: app/index.html es ahora 100% offline".
(Si algo falla, tu versión original queda en app/index.html.bak-online)

## PASO 3 — Crear el .exe
    npm run dist

En dist/ obtienes:
- Editor PDF local Setup 1.0.0.exe   → instalador
- Editor PDF local 1.0.0.exe (portable) → un solo archivo, sin instalar

Instalas el Setup, y desde entonces la app abre y guarda PDF sin internet.
Los "Ajustes de IA" vienen con Kimi (Moonshot AI) seleccionado por defecto:
pide tu clave en https://platform.moonshot.ai (la clave se guarda solo en tu PC,
en localStorage de la app). Puedes cambiar de proveedor/modelo en "Ajustes de IA".

## Probar sin empaquetar
    npm start

## Notas
- F5 recarga, F12 herramientas de desarrollador.
- Cambia "author" y "appId" en package.json si vas a distribuirla.
- Si editas el HTML a mano, repite el PASO 2 para que siga siendo offline.

## Editar texto existente (nuevo)
Editar → **Editar texto**, clic sobre una palabra/línea del PDF, escribe y pulsa Enter.
- Copia el tamaño, el color y el estilo (negrita/cursiva/serif/mono) del texto original.
- No hay que instalar tipografías: usa las fuentes estándar de PDF (Helvetica, Times, Courier) integradas.
- Tapa el texto viejo con el color de fondo detectado. "Borrar" quita ambos de golpe; Ctrl+Z también.
