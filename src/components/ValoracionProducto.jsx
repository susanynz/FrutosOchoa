import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../supabaseClient';

const ETIQUETAS = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
const CLAVE_LOCAL = 'valoraciones-productos';

// Productos que el usuario ya calificó en este navegador (evita votos repetidos)
const leerVotosProductos = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_LOCAL)) || {};
  } catch {
    return {};
  }
};

const guardarLocal = (productoId, estrellas) => {
  try {
    localStorage.setItem(CLAVE_LOCAL, JSON.stringify({ ...leerVotosProductos(), [productoId]: estrellas }));
  } catch {
    // Si el navegador bloquea el almacenamiento, la valoración solo dura esta visita
  }
};

// Estrellas clicables de un producto.
// resumen = { promedio, total } con los votos de Supabase; si no hay votos se usa la valoración base.
export default function ValoracionProducto({ producto, resumen, onVoto }) {
  const [miVoto, setMiVoto] = useState(() => leerVotosProductos()[producto.id] || 0);
  const [hover, setHover] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const promedio = resumen ? resumen.promedio : producto.valoracion;
  const activas = hover || miVoto || Math.round(promedio);

  const votar = async (estrellas) => {
    if (miVoto || enviando) return;
    setEnviando(true);
    const { error } = await supabase
      .from('valoraciones_producto')
      .insert([{ producto_id: producto.id, estrellas }]);
    if (error) console.error('No se pudo guardar la valoración del producto:', error.message);

    guardarLocal(producto.id, estrellas);
    setMiVoto(estrellas);
    if (!error) onVoto?.(producto.id, estrellas);
    setEnviando(false);
  };

  return (
    <div className="valoracion">
      <div
        className="valoracion-estrellas estrellas-producto"
        role="radiogroup"
        aria-label={`Calificar ${producto.nombre}`}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={miVoto === n}
            aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}: ${ETIQUETAS[n]}`}
            title={miVoto ? `Tu calificación: ${miVoto}` : ETIQUETAS[n]}
            disabled={!!miVoto || enviando}
            className={n <= activas ? 'activa' : ''}
            onMouseEnter={() => !miVoto && setHover(n)}
            onClick={() => votar(n)}
          >
            <FaStar />
          </button>
        ))}
      </div>
      <p className="valoracion-detalle">
        {miVoto
          ? `¡Gracias! Le diste ${miVoto} ${miVoto === 1 ? 'estrella' : 'estrellas'}`
          : hover
            ? ETIQUETAS[hover]
            : resumen
              ? `${promedio.toFixed(1)} de 5 (${resumen.total} ${resumen.total === 1 ? 'voto' : 'votos'})`
              : 'Toca las estrellas para calificar'}
      </p>
    </div>
  );
}
