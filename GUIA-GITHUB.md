# Cómo obtener el .exe con GitHub (sin instalar nada en tu PC)

## Primera vez
1. Crea cuenta gratis en https://github.com
2. Botón verde **New** → nombre `editorpdf` → Public → **Create repository**.
3. En el repo: **Add file → Upload files**. Abre la carpeta del proyecto en tu PC,
   selecciona TODO su contenido (main.js, package.json, offline-setup.js, README.md,
   y las carpetas app, build y .github) y arrástralo a la página.
   - Si no ves la carpeta .github (Windows la oculta): Explorador → Vista → Mostrar → Elementos ocultos.
   - Verifica que en GitHub existe `.github/workflows/build.yml`.
4. **Commit changes**.

## Compilar
1. Pestaña **Actions** → si pide, **I understand my workflows, enable them**.
2. Clic en **build-exe** (izquierda) → **Run workflow** → **Run workflow**.
3. Espera ~5-10 min hasta ver el círculo verde ✔.
4. Entra a esa ejecución → abajo, **Artifacts** → descarga **editor-pdf-exe** (ZIP).
5. Descomprime: ahí están el instalador (Setup) y el portable (.exe suelto).

## Opción con Release (descarga directa, sin ZIP)
En el repo: **Releases → Create a new release** → en "Choose a tag" escribe `v1.0.0`
→ **Create new tag** → **Publish release**. La compilación arranca sola y, al terminar,
los .exe aparecen adjuntos en esa misma página de Releases.

## Actualizar la app
Edita el archivo en GitHub (lápiz) o vuelve a subirlo, y repite "Compilar".

## Si sale un aviso rojo en Windows
SmartScreen: "Más información → Ejecutar de todas formas". Es normal en apps sin firma digital.
