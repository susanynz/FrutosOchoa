import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { supabase } from '../supabaseClient'; // Importa el cliente que creaste

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarAlCarrito, carrito } = useContext(CartContext);

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

  fetchProductos();
}, []);

  if (cargando) return <div>Cargando productos de la tienda...</div>;

  return (
    <div>
      <h2>Nuestros Productos</h2>
      <div className="grid-productos">
        {productos.map((prod) => (
          <div key={prod.id} className="tarjeta">
            <img src={prod.imagen} alt={prod.nombre} />
            <h3>{prod.nombre}</h3>
            <p className="precio">${prod.precio} MXN</p>
            <div className="valoracion">
              {[...Array(5)].map((star, i) => (
                <FaStar key={i} color={i < prod.valoracion ? "#F4A261" : "#E9ECEF"} />
              ))}
            </div>
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