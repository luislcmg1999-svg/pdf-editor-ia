# GUIA RAPIDA - Tres formas de obtener el .exe sin batallas

## OPCION A - Sin instalar NADA en tu PC (recomendada)
GitHub compila el .exe por ti en la nube. Gratis, ~10 minutos, solo navegador.

1. Crea cuenta gratis en https://github.com
2. Crea un repositorio nuevo (boton "New", nombre: editorpdf, publico, marca "Add a README").
3. Entra al repo -> boton "Add file" -> "Upload files".
4. Arrastra TODA la carpeta del proyecto (incluidas las carpetas app, build,
   .github y los archisons sueltos) a la zona de subida. Confirma con "Commit changes".
5. Ve a la pestana "Actions" (arriba del repo) -> "build-exe" -> "Run workflow" (dropdown) -> Run.
6. Espera 5-10 minutos a que el circulo amarillo se ponga verde.
7. Clic en el trabajo "build", baja a "Artifacts" y descarga "editor-pdf-exe".
8. Descomprime: ahi estan el instalador y el portable. Listo.

Si quieres cambiar algo despues: editas app/index.html desde la web de GitHub
(lapiz) y repites el paso 5.

## OPCION B - Node PORTABLE (sin instalador, sin administrador)
El error 2503 pasa porque el instalador .msi necesita permisos. La version ZIP no.

1. En https://nodejs.org baja la version "Windows Binary (.zip) 64 bits"
   (esta en "Other Downloads"). NO uses el .msi.
2. Extrae el ZIP en C:\  (quedara algo como C:\node-v20.18.0-win-x64; renombra a C:\node)
3. Abre cmd DENTRO de la carpeta pdf-editor-pc (barra de direcciones -> escribe cmd -> Enter)
   y ejecuta estos 3 comandos con la ruta completa:
     C:\node\npm.cmd install
     C:\node\npm.cmd run offline
     C:\node\npm.cmd run dist
4. Los .exe quedan en la carpeta dist.

## OPCION C - Visual Studio + C#
Se puede hacer una app C# con WebView2, pero: Visual Studio Community pesa
6-8 GB, tambien pide administrador y descarga mas cosas que Node. Es MAS
batalla, no menos. Solo te la recomiendo si ya lo tienes instalado.
Si es tu caso, dime y te paso el proyecto C# completo.

## Nota
Mientras tanto, puedes usar el editor YA MISMO: doble clic en app/index.html
y se abre en tu navegador con todas las funciones (solo necesita internet
para cargar las librerias la primera vez).
