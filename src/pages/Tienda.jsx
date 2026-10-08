import { useState, useEffect, useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { supabase } from '../supabaseClient'; // Importa el cliente que creaste
import ValoracionProducto from '../components/ValoracionProducto';

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

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [votos, setVotos] = useState({});
  const { agregarAlCarrito, carrito } = useContext(CartContext);

  // ?producto=ID llega desde el carrusel de destacados de Inicio
  const [searchParams] = useSearchParams();
  const productoElegido = Number(searchParams.get('producto')) || null;

  // Calcula el total de artículos en el carrito para mostrar en el botón
  const cantidadArticulos = carrito.reduce((total, item) => total + item.cantidad, 0);

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

  if (cargando) return <div>Cargando productos de la tienda...</div>;

  return (
    <div>
      <h2>Nuestros Productos</h2>
      <div className="grid-productos">
        {productos.map((prod) => (
          <div
            key={prod.id}
            id={`producto-${prod.id}`}
            className={`tarjeta ${prod.id === productoElegido ? 'tarjeta-elegida' : ''}`}
          >
            <img src={prod.imagen} alt={prod.nombre} />
            <h3>{prod.nombre}</h3>
            <p className="precio">${prod.precio} MXN</p>
            <ValoracionProducto producto={prod} resumen={votos[prod.id]} onVoto={registrarVoto} />
            <button
              className="btn-agregar"
              onClick={() => {
                agregarAlCarrito(prod);
                alert(`Agregaste: ${prod.nombre}. Puedes revisar tu carrito al final de la pagina para proceder al pago.`);
              }}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      {/* Contenedor centrado para el botón de proceder al checkout */}
      <div className="contenedor-proceder">
        <Link to="/carrito" className="btn-proceder-compra">
          <FaShoppingCart /> Proceder a comprar ({cantidadArticulos})
        </Link>
      </div>
    </div>
  );
}
