import { useState, useEffect, useContext, useRef } from 'react';
import { FaShoppingCart, FaSearch, FaMinus, FaPlus, FaTruck } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { supabase } from '../supabaseClient'; // Importa el cliente que creaste
import ValoracionProducto from '../components/ValoracionProducto';
import { categorias, categoriaDe, ENVIO_GRATIS_DESDE } from '../config/tienda';

// Agrupa los votos de Supabase por producto: { [id]: { promedio, total } }
const resumirVotos = (votos) => {
  const resumen = {};
  votos.forEach(({ producto_id, estrellas }) => {
    const r = resumen[producto_id] || { suma: 0, total: 0 };
    resumen[producto_id] = { suma: r.suma + estrellas, total: r.total + 1 };
  });
  Object.values(resumen).forEach(r => { r.promedio = r.suma / r.total; });
  return resumen;
};

const ordenamientos = {
  destacados: () => 0,
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es')
};

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [votos, setVotos] = useState({});
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [orden, setOrden] = useState('destacados');
  const [aviso, setAviso] = useState(null);
  const temporizadorAviso = useRef(null);
  const { agregarAlCarrito, cambiarCantidad, cantidadEnCarrito, totalArticulos, totalCarrito } = useContext(CartContext);

  // ?producto=ID llega desde el carrusel de destacados de Inicio
  const [searchParams] = useSearchParams();
  const productoElegido = Number(searchParams.get('producto')) || null;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Usamos el cliente de Supabase en lugar de axios
        const { data, error } = await supabase
          .from('productos') // El nombre exacto de tu tabla en Supabase
          .select('*');     // Traer todas las columnas

        if (error) throw error; // Si hay error, lo atrapa el catch

        setProductos(data);
      } catch (error) {
        console.error("Error al cargar el catálogo desde Supabase:", error.message);
      } finally {
        setCargando(false);
      }
    };

    // Votos de los clientes; si la tabla aún no existe se usa la valoración base de cada producto
    const fetchVotos = async () => {
      const { data, error } = await supabase.from('valoraciones_producto').select('producto_id, estrellas');
      if (!error && data) setVotos(resumirVotos(data));
    };

    fetchProductos();
    fetchVotos();
    return () => clearTimeout(temporizadorAviso.current);
  }, []);

  // Cuando el catálogo ya cargó, baja hasta el producto elegido en Inicio
  useEffect(() => {
    if (cargando || !productoElegido) return;
    document.getElementById(`producto-${productoElegido}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [cargando, productoElegido]);

  // Suma el voto recién hecho al promedio que se muestra
  const registrarVoto = (id, estrellas) => {
    setVotos(prev => {
      const r = prev[id] || { suma: 0, total: 0 };
      const suma = r.suma + estrellas;
      const total = r.total + 1;
      return { ...prev, [id]: { suma, total, promedio: suma / total } };
    });
  };

  // Aviso flotante que reemplaza al alert() y se oculta solo
  const mostrarAviso = (texto) => {
    clearTimeout(temporizadorAviso.current);
    setAviso({ texto, clave: Date.now() });
    temporizadorAviso.current = setTimeout(() => setAviso(null), 2200);
  };

  const agregar = (prod) => {
    agregarAlCarrito(prod);
    mostrarAviso(`Agregaste ${prod.nombre} a tu carrito`);
  };

  const texto = busqueda.trim().toLowerCase();
  const productosVisibles = productos
    .filter(prod => categoria === 'todas' || categoriaDe(prod.id).id === categoria)
    .filter(prod => prod.nombre.toLowerCase().includes(texto))
    .sort(ordenamientos[orden]);

  const faltaParaEnvioGratis = ENVIO_GRATIS_DESDE - totalCarrito;

  if (cargando) return <div>Cargando productos de la tienda...</div>;

  return (
    <div>
      {/* Encabezado de la tiendita con la mascota animada */}
      <section className="tienda-banner">
        <img src="/animaciones/mascota-mango.svg" alt="Mango, la mascota de Frutos Ochoa, saludando" width="160" height="160" />
        <div>
          <h2>Tiendita Ochoa</h2>
          <p>Elige tus frutos favoritos, ajusta las cantidades y paga al recibir, por transferencia o en OXXO.</p>
          <p className="tienda-banner-envio"><FaTruck /> Envío gratis en compras desde ${ENVIO_GRATIS_DESDE} MXN</p>
        </div>
      </section>

      {/* Buscador, filtro por categoría y orden */}
      <div className="tienda-controles">
        <label className="faq-buscador tienda-buscador">
          <FaSearch />
          <input
            type="search"
            placeholder="Buscar fruta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar productos"
          />
        </label>
        <select value={orden} onChange={(e) => setOrden(e.target.value)} className="tienda-orden" aria-label="Ordenar productos">
          <option value="destacados">Destacados</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre (A-Z)</option>
        </select>
      </div>

      <div className="galeria-filtros">
        <button className={categoria === 'todas' ? 'activo' : ''} onClick={() => setCategoria('todas')}>Todas</button>
        {categorias.map(cat => (
          <button key={cat.id} className={categoria === cat.id ? 'activo' : ''} onClick={() => setCategoria(cat.id)}>
            {cat.nombre}
          </button>
        ))}
      </div>

      <p className="tienda-resultados">{productosVisibles.length} productos</p>

      {productosVisibles.length === 0 && (
        <p className="tienda-vacia">No encontramos productos con esa búsqueda. Prueba con otra fruta o categoría.</p>
      )}

      <div className="grid-productos">
        {productosVisibles.map((prod, index) => {
          const cantidad = cantidadEnCarrito(prod.id);
          return (
            <div
              key={prod.id}
              id={`producto-${prod.id}`}
              className={`tarjeta tarjeta-animada ${prod.id === productoElegido ? 'tarjeta-elegida' : ''}`}
              style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
            >
              <span className="etiqueta-categoria">{categoriaDe(prod.id).nombre}</span>
              <img src={prod.imagen} alt={prod.nombre} loading="lazy" />
              <h3>{prod.nombre}</h3>
              <p className="precio">${prod.precio} MXN</p>
              <ValoracionProducto producto={prod} resumen={votos[prod.id]} onVoto={registrarVoto} />
              {cantidad === 0 ? (
                <button className="btn-agregar" onClick={() => agregar(prod)}>
                  Agregar al carrito
                </button>
              ) : (
                <div className="selector-cantidad" aria-label={`Cantidad de ${prod.nombre}`}>
                  <button onClick={() => cambiarCantidad(prod.id, -1)} aria-label="Quitar uno"><FaMinus /></button>
                  <span>{cantidad} en el carrito</span>
                  <button onClick={() => agregar(prod)} aria-label="Agregar uno"><FaPlus /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barra fija con el resumen del carrito mientras se compra */}
      {totalArticulos > 0 && (
        <div className="barra-compra">
          <div>
            <strong>{totalArticulos} {totalArticulos === 1 ? 'artículo' : 'artículos'} · ${totalCarrito} MXN</strong>
            <small>
              {faltaParaEnvioGratis > 0
                ? `Te faltan $${faltaParaEnvioGratis} para el envío gratis`
                : '¡Tu pedido tiene envío gratis!'}
            </small>
          </div>
          <Link to="/carrito" className="btn-proceder-compra">
            <FaShoppingCart /> Ver carrito y pagar
          </Link>
        </div>
      )}

      {aviso && (
        <div key={aviso.clave} className="aviso-carrito" role="status">
          <FaShoppingCart /> {aviso.texto}
        </div>
      )}
    </div>
  );
}
