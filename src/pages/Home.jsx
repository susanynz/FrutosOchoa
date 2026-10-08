import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Slides del banner principal: imagen + texto + botón
const slidesBanner = [
  {
    imagen: '/img/reel/FrutosRojos.webp',
    titulo: 'Mix Frutos Rojos',
    texto: 'Fresas, arándanos y cerezas deshidratadas, sin azúcar añadida.',
    enlace: '/tienda'
  },
  {
    imagen: '/img/reel/MangosSecos.webp',
    titulo: 'Mango Deshidratado',
    texto: 'El favorito de nuestros clientes: dulce natural en cada bocado.',
    enlace: '/tienda'
  },
  {
    imagen: '/img/reel/MixTropical.webp',
    titulo: 'Mix Tropical',
    texto: 'Piña, papaya, coco y mango para llevar a donde vayas.',
    enlace: '/tienda'
  }
];

// Productos del carrusel de destacados; el id es el mismo de la tabla productos
const destacados = [
  { id: 1, nombre: 'Mango', imagen: '/img/catalogo/MangosSecos.webp' },
  { id: 4, nombre: 'Fresa', imagen: '/img/catalogo/Fresas.webp' },
  { id: 9, nombre: 'Kiwi', imagen: '/img/catalogo/Kiwi.webp' },
  { id: 3, nombre: 'Manzana con Canela', imagen: '/img/catalogo/ManzanaCanela.webp' },
  { id: 6, nombre: 'Arándanos', imagen: '/img/catalogo/Arendanos.webp' },
  { id: 2, nombre: 'Piña', imagen: '/img/catalogo/Pina.webp' },
  { id: 11, nombre: 'Higo', imagen: '/img/catalogo/Higo.webp' },
  { id: 18, nombre: 'Cereza', imagen: '/img/catalogo/Cereza.webp' }
];

export default function Home() {
  return (
    <div>
      {/* Slider principal con efecto de desvanecido */}
      <section>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade, A11y]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          a11y={{ prevSlideMessage: 'Imagen anterior', nextSlideMessage: 'Imagen siguiente', paginationBulletMessage: 'Ir a la imagen {{index}}' }}
          className="slider-banner"
        >
          {slidesBanner.map((slide, index) => (
            <SwiperSlide key={slide.titulo}>
              <img src={slide.imagen} alt={slide.titulo} loading={index === 0 ? 'eager' : 'lazy'} />
              <div className="slide-texto">
                <h2>{slide.titulo}</h2>
                <p>{slide.texto}</p>
                <Link to={slide.enlace} className="btn-proceder-compra">Comprar ahora</Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Carrusel de productos destacados: muestra más tarjetas según el ancho de pantalla */}
      <section className="faq-section destacados">
        <h2>Productos destacados</h2>
        <Swiper
          modules={[Navigation, Autoplay, A11y]}
          spaceBetween={20}
          slidesPerView={1.3}
          loop
          navigation
          autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }}
          className="slider-destacados"
        >
          {destacados.map(prod => (
            <SwiperSlide key={prod.id}>
              <Link to={`/tienda?producto=${prod.id}`} className="destacado-card">
                <img src={prod.imagen} alt={prod.nombre} loading="lazy" />
                <span>{prod.nombre}</span>
              </Link>
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
