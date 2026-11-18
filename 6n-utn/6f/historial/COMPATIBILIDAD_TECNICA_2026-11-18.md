# 6.º F · Verificación técnica de apertura y compatibilidad (18/11/2026)

**Alcance:** 12 equipos sujetos a entrega de proyecto regular; equipo 12 (Renata / ONG CEAPI) EXCLUIDO por su instancia de recuperatorio UTN.

## Resultado y método

Con la cuenta docente `grosa@northfield.edu.ar`, se comprobó que los **11 equipos con proyecto recibido** tienen `index.html`, sus archivos HTML, hojas CSS y recursos identificables. La carpeta de Casa Cúrcuma (05) está vacía a este corte; esto no acredita ausencias en otras plataformas.

- Se leyeron **56 páginas HTML**, **34 hojas CSS** y **1 archivo JavaScript**: contenido legible y no se encontraron problemas de autorización de lectura con la cuenta docente.
- Se cotejaron los valores locales de `href`, `src` y `action` entre las páginas HTML y los archivos listados; se inspeccionaron referencias de imágenes de CSS.
- Las CSS tienen llaves `{}` balanceadas; ninguna depende de `127.0.0.1`, `localhost` o una ruta `file://` como enlace de recurso. Esto es una comprobación estática, **no un validador CSS exhaustivo**.
- Se descargaron y validaron con Pillow **9 imágenes de muestra** de 9 equipos (JPEG, PNG y WebP), todas se abrieron correctamente. NO se verificaron individualmente los bytes de todas las imágenes.
- Equipo 03: ZIP de 800.817 bytes abierto con `zipfile`, 24 entradas y `testzip()` sin errores; contiene carpetas anidadas y duplicados.
- Equipo 11: `script.js` accesible y con sintaxis validada por `node --check`.
- Esta revisión **no ejecuta y recorre el sitio renderizado en Chrome**; por lo tanto no garantiza visualización perfecta, funcionamiento dinámico, servicios externos, ni comportamiento en todos los dispositivos. Que el proyecto pueda evaluarse no significa que esté aprobado.

## Estado por equipo

| Equipo | Proyecto | Lectura HTML/CSS | Enlaces internos / recursos | Criterio técnico |
|---|---|---|---|---|
| 01 | Vintage Market Tigre | Accesible | Referencias locales coincidentes; CSS e imágenes presentes | Evaluable; video es una cuestión separada |
| 02 | Dos Orejas | Accesible | Referencias HTML a páginas/CSS/imágenes coincidentes | Evaluable |
| 03 | El Bórdo | Accesible | **precios.html** cita `unnamed.jpg` inexistente en ACTUAL; **horarios.html** cita `unnamed.webp` inexistente en ACTUAL | Evaluable con dos imágenes rotas; ZIP legible, anidado |
| 04 | Gelato Stelvio | Accesible | En `trello-pedidos.html`: `C_FrutillaReina.png ` con espacio al final. En `about-us.html`: `href="Mail:smncr@proton.me"` en vez de `mailto:` | Evaluable con dos enlaces/referencias a reparar |
| 05 | Casa Cúrcuma | Carpeta ACTUAL vacía | Sin código para revisar | No evaluable desde el repositorio al 18/11 |
| 06 | Dunge Didácticos | Accesible | HTML/CSS e imágenes coincidentes, incluso en subcarpetas `css/` e `imagenes/` | Evaluable; Classroom y video aparte |
| 07 | La Casa del Perforista | Accesible | Referencias locales coincidentes; `local.jpg` está presente para el CSS | Evaluable |
| 08 | Alpa Multisport | Accesible | Referencias HTML a CSS e imágenes coincidentes; carpeta `images/` presente | Evaluable; agregar `lang`/metadatos es mejora no bloqueante |
| 09 | Golta Camisetas | Accesible | Páginas/CSS/imágenes locales coincidentes; carpeta `imagenes/` presente | Evaluable |
| 10 | Cede World Padel | Accesible | Referencias locales coincidentes; `canchas.html` inicia con `<html>` antes de `<!DOCTYPE html>` (estructura inválida), y enlace de correo posiblemente inconsistente | Evaluable con errores HTML por corregir; imágenes externas pueden depender de Internet |
| 11 | Al Paso Mates | Accesible | Rutas locales HTML, CSS, imagen y `script.js` coincidentes; JS pasa validación de sintaxis | Evaluable |
| 14 | Resto House / Paz Bello | Accesible | Nueve archivos HTML/CSS en subcarpeta `Paz_Bello`; referencias locales coincidentes | Evaluable; confirmar cambio de nombre y recursos externos |

## Conclusión

**11 proyectos con archivos que permiten iniciar corrección técnica; 1 sin archivos de proyecto (05).** No se detectaron bloqueos generales por permisos docentes o formatos de archivos entre los 11 recibidos. Los errores puntuales de los equipos 03, 04 y 10 no impiden abrir y evaluar los demás elementos, pero sí afectan detalles de visualización/funcionamiento.

La **aprobación final** requiere evaluar el funcionamiento real en navegador, calidad del HTML/CSS, explicación del código y video de cada equipo; confirmar también el estado formal de la tarea en Classroom. Este registro complementa (no sustituye) los cortes históricos del 13, 16 y 18/11; no modifica entregas estudiantiles.
