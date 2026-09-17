# Un jardín para Milagros

Una experiencia web 3D interactiva, nocturna, elegante y respetuosa diseñada para celebrar momentos especiales, comenzando con una felicitación por su **ascenso laboral**, y preparada para crecer orgánicamente con el tiempo.

Desarrollada con **Three.js**, **GSAP**, **Vite** y **CSS moderno**, 100% responsive para teléfonos móviles y compatible para su publicación directa en **GitHub Pages**.

---

## Dirección Artística y Tono

- **Estética**: Nocturna, botánica, cinematográfica, refinada, sobria y cálida.
- **Paleta**: Verde bosque profundo (`#0c1410`), negro cálido nocturno (`#070a09`), marfil suave, crema y toques sutiles de dorado champán (`#c8a96e`).
- **Filosofía**: Transmitir atención a los detalles, interés genuino y respeto, celebrando sus logros sin apresurar etapas ni usar clichés empalagosos.

---

## Características Principales

1. **Pantalla de Entrada e Inicio Cinemático**:
   - Mensaje de bienvenida minimalista y respetuoso.
   - Recorrido suave de cámara por el sendero iluminado con frases discretas de transición.
2. **La Flor del Ascenso**:
   - Flor especial con pétalos marfil/champán y luz cálida dedicada.
   - Tarjeta modal con la dedicatoria completa celebrando su nuevo puesto de trabajo y reconociendo su esfuerzo.
3. **La Banca de los Mensajes**:
   - Sección *"Para cuando quieras detenerte un momento"*, mostrando notas de una en una con controles elegantes de navegación.
4. **Fuente de los Pequeños Detalles**:
   - Estanque interactivo con agua animada que ofrece pensamientos serenos al tocarla.
5. **Galería de Momentos**:
   - Sección preparada con un texto poético que espera futuras fotografías.
6. **Espacios por Florecer (Empty Plots)**:
   - Parcelas en el jardín con piedras y pequeños brotes que transmiten que apenas es el comienzo.
7. **Farol de Sorpresas ("Algo nuevo para ti")**:
   - Lámpara especial que se ilumina automáticamente cuando actives una sorpresa en el archivo de datos.
8. **Camino Secreto**:
   - Sendero secundario cerrado preparado para futuras secciones especiales.
9. **Contador Discreto**:
   - Indicador en la barra superior: *Detalles guardados · 01*, que se actualiza dinámicamente con cada nuevo elemento.
10. **Atmósfera Sonora Voluntaria**:
    - Control de audio discreto (inicia en silencio) que genera una suave resonancia ambiental nocturna o reproduce tu propio archivo MP3.
11. **Modo Accesibilidad 2D**:
    - Vista de lectura completa para dispositivos de bajos recursos o preferencias de movimiento reducido.

---

## Cómo Probar en Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre en tu navegador la URL que indique Vite (por defecto `http://localhost:5173`).

---

## Cómo Publicar en GitHub Pages

El proyecto ya está configurado con rutas relativas (`base: './'`) en `vite.config.js` para que funcione perfectamente en GitHub Pages.

### Opción A: Despliegue con GitHub Actions (Recomendada)
1. Sube este repositorio a GitHub.
2. En tu repositorio, ve a **Settings** > **Pages**.
3. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
4. El flujo de trabajo en `.github/workflows/deploy.yml` compilará y desplegará la web de forma automática.

### Opción B: Construir y subir la carpeta `dist`
1. Ejecuta en tu terminal:
   ```bash
   npm run build
   ```
2. La carpeta `dist/` contendrá todos los archivos estáticos listos para desplegarse.

---

## Cómo Añadir Nuevos Detalles (`src/data/milagros.js`)

Todo el contenido del jardín es editable desde el archivo central:
[`src/data/milagros.js`](./src/data/milagros.js)
