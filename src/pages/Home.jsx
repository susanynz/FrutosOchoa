import { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Chat from '../components/Chat';

// Arreglo de imágenes para el Reel
const imagenesReel = [
  '/img/reel/FrutosRojos.webp',
  '/img/reel/MangosSecos.webp',
  '/img/reel/MixTropical.webp'
];

export default function Home() {
  const [faqs, setFaqs] = useState([]);

  // Petición asíncrona para traer las Preguntas Frecuentes del servidor simulado
  useEffect(() => {
    axios.get('https://api.npoint.io/f335415bfa75d1ceadb3/faq')
      .then(res => setFaqs(res.data))
      .catch(err => console.error("Error cargando FAQs:", err));
  }, []);

  return (
    <div>
      <section>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          className="swiper"
        >
          {/* Mapeo dinámico de imágenes */}
          {imagenesReel.map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt={`Promoción ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="faq-section">
        <h2>Preguntas Frecuentes</h2>
        <div>
          {faqs.length > 0 ? (
            faqs.map(faq => (
              <div key={faq.id} className="faq-item">
                <h4>{faq.pregunta}</h4>
                <p>{faq.respuesta}</p>
              </div>
            ))
          ) : (
            <p>Cargando preguntas frecuentes...</p>
          )}
        </div>
      </section>

      {/* Componente de Chat */}
      <Chat />
    </div>
  );
}