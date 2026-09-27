import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Arreglo de imágenes para el Reel
const imagenesReel = [
  '/img/reel/FrutosRojos.webp',
  '/img/reel/MangosSecos.webp',
  '/img/reel/MixTropical.webp'
];

export default function Home() {
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

      {/* Acceso a la sección de Preguntas Frecuentes */}
      <section className="faq-section faq-promo">
        <h2>¿Tienes dudas?</h2>
        <p>Encuentra respuestas sobre envíos, pagos, pedidos y nuestros productos.</p>
        <Link to="/faq" className="btn-proceder-compra">Ver preguntas frecuentes</Link>
      </section>
    </div>
  );
}
