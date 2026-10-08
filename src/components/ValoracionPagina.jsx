import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../supabaseClient';

// Nombre legible de cada ruta; las rutas que no estén aquí no muestran la valoración
const PAGINAS = {
  '/': 'Inicio',
  '/nosotros': 'Quiénes Somos',
  '/tienda': 'Tienda',
  '/faq': 'Preguntas Frecuentes',
  '/contacto': 'Contacto',
  '/opiniones': 'Opiniones'
};

const ETIQUETAS = ['', 'Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'];
const CLAVE_LOCAL = 'valoraciones-paginas';

// Lee/guarda en el navegador qué páginas ya calificó el usuario (evita votos repetidos)
const leerLocales = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_LOCAL)) || {};
  } catch {
    return {};
  }
};

const guardarLocal = (pagina, estrellas) => {
  try {
    localStorage.setItem(CLAVE_LOCAL, JSON.stringify({ ...leerLocales(), [pagina]: estrellas }));
  } catch {
    // Si el navegador bloquea el almacenamiento, la valoración solo dura esta visita
  }
};

export default function ValoracionPagina() {
  const { pathname } = useLocation();
  const nombrePagina = PAGINAS[pathname];
  if (!nombrePagina) return null;

  // La key reinicia el estado cada vez que se cambia de página
  return <Valoracion key={pathname} pagina={pathname} nombrePagina={nombrePagina} />;
}

function Valoracion({ pagina, nombrePagina }) {
  const [miVoto, setMiVoto] = useState(() => leerLocales()[pagina] || 0);
  const [hover, setHover] = useState(0);
  const [resumen, setResumen] = useState(null); // { promedio, total }
  const [enviando, setEnviando] = useState(false);

  // Trae de Supabase el promedio de estrellas de esta página
  useEffect(() => {
    const cargarResumen = async () => {
      const { data, error } = await supabase
        .from('valoraciones_pagina')
        .select('estrellas')
        .eq('pagina', pagina);
      if (error || !data?.length) return; // Sin tabla o sin votos: no se muestra promedio
      const suma = data.reduce((total, v) => total + v.estrellas, 0);
      setResumen({ promedio: suma / data.length, total: data.length });
    };
    cargarResumen();
  }, [pagina]);

  const votar = async (estrellas) => {
    if (miVoto || enviando) return;
    setEnviando(true);
    const { error } = await supabase
      .from('valoraciones_pagina')
      .insert([{ pagina, estrellas }]);
    if (error) console.error('No se pudo guardar la valoración en Supabase:', error.message);

    guardarLocal(pagina, estrellas);
    setMiVoto(estrellas);
    if (!error) {
      setResumen(prev => {
        const total = (prev?.total || 0) + 1;
        const promedio = ((prev?.promedio || 0) * (total - 1) + estrellas) / total;
        return { promedio, total };
      });
    }
    setEnviando(false);
  };

  const activas = hover || miVoto;

  return (
    <section className="valoracion-pagina" aria-label="Valoración de la página">
      <p className="valoracion-pregunta">
        {miVoto ? '¡Gracias por tu valoración!' : `¿Qué te pareció la página de ${nombrePagina}?`}
      </p>

      <div className="valoracion-estrellas" role="radiogroup" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={miVoto === n}
            aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}: ${ETIQUETAS[n]}`}
            title={ETIQUETAS[n]}
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
        {activas ? ETIQUETAS[activas] : 'Selecciona de 1 a 5 estrellas'}
        {resumen && ` · Promedio ${resumen.promedio.toFixed(1)} de 5 (${resumen.total} ${resumen.total === 1 ? 'voto' : 'votos'})`}
      </p>
    </section>
  );
}
