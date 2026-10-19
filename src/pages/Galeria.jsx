import { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

// Imágenes de la galería: banner principal + catálogo de productos
const fotos = [
  { src: '/img/reel/FrutosRojos.webp', titulo: 'Mix Frutos Rojos', categoria: 'Mezclas' },
  { src: '/img/reel/MangosSecos.webp', titulo: 'Mango deshidratado', categoria: 'Mezclas' },
  { src: '/img/reel/MixTropical.webp', titulo: 'Mix Tropical', categoria: 'Mezclas' },
  { src: '/img/catalogo/MangosSecos.webp', titulo: 'Mango', categoria: 'Tropicales' },
  { src: '/img/catalogo/Pina.webp', titulo: 'Piña', categoria: 'Tropicales' },
  { src: '/img/catalogo/Papaya.webp', titulo: 'Papaya', categoria: 'Tropicales' },
  { src: '/img/catalogo/Coco.webp', titulo: 'Coco', categoria: 'Tropicales' },
  { src: '/img/catalogo/Platanos.webp', titulo: 'Plátano', categoria: 'Tropicales' },
  { src: '/img/catalogo/Kiwi.webp', titulo: 'Kiwi', categoria: 'Tropicales' },
  { src: '/img/catalogo/Fresas.webp', titulo: 'Fresa', categoria: 'Frutos rojos' },
  { src: '/img/catalogo/Arendanos.webp', titulo: 'Arándanos', categoria: 'Frutos rojos' },
  { src: '/img/catalogo/Cereza.webp', titulo: 'Cereza', categoria: 'Frutos rojos' },
  { src: '/img/catalogo/MixFrutosRojos.webp', titulo: 'Mix Frutos Rojos', categoria: 'Mezclas' },
  { src: '/img/catalogo/MixTropical.webp', titulo: 'Mix Tropical', categoria: 'Mezclas' },
  { src: '/img/catalogo/ManzanaCanela.webp', titulo: 'Manzana con Canela', categoria: 'Clásicos' },
  { src: '/img/catalogo/Peras.webp', titulo: 'Pera', categoria: 'Clásicos' },
  { src: '/img/catalogo/Durazno.webp', titulo: 'Durazno', categoria: 'Clásicos' },
  { src: '/img/catalogo/Higo.webp', titulo: 'Higo', categoria: 'Clásicos' },
  { src: '/img/catalogo/CiruelaPasa.webp', titulo: 'Ciruela Pasa', categoria: 'Clásicos' },
  { src: '/img/catalogo/Pasas.webp', titulo: 'Pasas', categoria: 'Clásicos' },
  { src: '/img/catalogo/PasasRubias.webp', titulo: 'Pasas Rubias', categoria: 'Clásicos' },
  { src: '/img/catalogo/Naranjas.webp', titulo: 'Naranja', categoria: 'Cítricos' },
  { src: '/img/catalogo/Limon.webp', titulo: 'Limón', categoria: 'Cítricos' }
];

const categorias = ['Todas', ...new Set(fotos.map(f => f.categoria))];

export default function Galeria() {
  const [filtro, setFiltro] = useState('Todas');
  // Posición dentro de la lista filtrada de la foto abierta en grande (null = cerrada)
  const [abierta, setAbierta] = useState(null);

  const visibles = filtro === 'Todas' ? fotos : fotos.filter(f => f.categoria === filtro);

  const cerrar = useCallback(() => setAbierta(null), []);
  const mover = useCallback(
    paso => setAbierta(i => (i + paso + visibles.length) % visibles.length),
    [visibles.length]
  );

  // Teclado en el visor: Esc cierra, flechas cambian de foto
  useEffect(() => {
    if (abierta === null) return;
    const alPresionar = e => {
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', alPresionar);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', alPresionar);
      document.body.style.overflow = '';
    };
  }, [abierta, cerrar, mover]);

  const foto = abierta !== null ? visibles[abierta] : null;

  return (
    <div>
      {/* Video embebido */}
      <section className="faq-section video-section">
        <h2>Conoce Frutos Ochoa</h2>
        <p>Mira cómo seleccionamos y deshidratamos nuestras frutas para conservar su sabor y nutrientes.</p>
        <div className="video-contenedor">
          {/* #t=0.1 hace que el navegador muestre el primer cuadro como portada */}
          <video controls preload="metadata" playsInline>
            <source src="/video/frutos-ochoa.mp4#t=0.1" type="video/mp4" />
            Tu navegador no puede reproducir este video.
          </video>
        </div>
      </section>

      {/* Galería de imágenes con filtro por categoría y visor ampliado */}
      <section className="faq-section galeria-section">
        <h2>Galería de productos</h2>
        <div className="galeria-filtros" role="group" aria-label="Filtrar por categoría">
          {categorias.map(cat => (
            <button
              key={cat}
              className={cat === filtro ? 'activo' : ''}
              aria-pressed={cat === filtro}
              onClick={() => setFiltro(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="galeria-grid">
          {visibles.map((f, i) => (
            <button key={f.src} className="galeria-item" onClick={() => setAbierta(i)} aria-label={`Ver ${f.titulo} en grande`}>
              <img src={f.src} alt={f.titulo} loading="lazy" />
              <span>{f.titulo}</span>
            </button>
          ))}
        </div>
      </section>

      {foto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={foto.titulo} onClick={cerrar}>
          <button className="lightbox-cerrar" onClick={cerrar} aria-label="Cerrar">
            <FaTimes size={26} />
          </button>
          <button className="lightbox-flecha izquierda" onClick={e => { e.stopPropagation(); mover(-1); }} aria-label="Foto anterior">
            <FaChevronLeft size={30} />
          </button>
          <figure onClick={e => e.stopPropagation()}>
            <img src={foto.src} alt={foto.titulo} />
            <figcaption>
              {foto.titulo} <small>{abierta + 1} / {visibles.length}</small>
            </figcaption>
          </figure>
          <button className="lightbox-flecha derecha" onClick={e => { e.stopPropagation(); mover(1); }} aria-label="Foto siguiente">
            <FaChevronRight size={30} />
          </button>
        </div>
      )}
    </div>
  );
}
