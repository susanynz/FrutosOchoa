import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaSearch, FaWhatsapp } from 'react-icons/fa';
import { faqsLocales } from '../data/faqs';
import { enlaceWhatsApp } from '../config/contacto';

// Quita acentos y mayúsculas para que "envio" encuentre "envío"
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Faq() {
  const [faqs, setFaqs] = useState(faqsLocales);
  const [busqueda, setBusqueda] = useState('');
  const [abierta, setAbierta] = useState(null);

  // Petición asíncrona: trae las preguntas del servidor y agrega las que no estén en la lista local
  useEffect(() => {
    axios.get('https://api.npoint.io/f335415bfa75d1ceadb3/faq')
      .then(res => {
        const existentes = new Set(faqsLocales.map(f => normalizar(f.pregunta)));
        const nuevas = res.data
          .filter(f => !existentes.has(normalizar(f.pregunta)))
          .map(f => ({ ...f, id: `api-${f.id}` }));
        setFaqs([...faqsLocales, ...nuevas]);
      })
      .catch(err => console.error('Error cargando FAQs, se usan las locales:', err));
  }, []);

  const termino = normalizar(busqueda.trim());
  const resultados = faqs.filter(f =>
    normalizar(f.pregunta).includes(termino) || normalizar(f.respuesta).includes(termino)
  );

  const alternar = (id) => setAbierta(abierta === id ? null : id);

  return (
    <div className="faq-section">
      <h2>Preguntas Frecuentes</h2>

      <div className="faq-buscador">
        <FaSearch aria-hidden="true" />
        <input
          type="search"
          placeholder="Busca tu duda: envíos, pagos, pedidos..."
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setAbierta(null); }}
          aria-label="Buscar en preguntas frecuentes"
        />
      </div>

      {resultados.length > 0 ? (
        <div className="faq-lista">
          {resultados.map(faq => (
            <div key={faq.id} className={`faq-item ${abierta === faq.id ? 'abierta' : ''}`}>
              <button
                className="faq-pregunta"
                onClick={() => alternar(faq.id)}
                aria-expanded={abierta === faq.id}
              >
                <span>{faq.pregunta}</span>
                <FaChevronDown className="faq-icono" aria-hidden="true" />
              </button>
              {abierta === faq.id && <p className="faq-respuesta">{faq.respuesta}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="faq-vacio">No encontramos preguntas que coincidan con "{busqueda}".</p>
      )}

      <div className="faq-ayuda">
        <p>¿No encontraste tu respuesta?</p>
        <a href={enlaceWhatsApp('Hola, tengo una pregunta que no encontré en la sección de preguntas frecuentes.')} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          <FaWhatsapp /> Pregúntale a un asesor
        </a>
      </div>
    </div>
  );
}
