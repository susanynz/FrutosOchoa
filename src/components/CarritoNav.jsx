import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';

// Enlace al carrito del menú con el número de artículos; la insignia rebota cada vez que cambia
export default function CarritoNav({ onClick }) {
  const { totalArticulos } = useContext(CartContext);

  return (
    <Link to="/carrito" onClick={onClick} className="carrito-nav" aria-label={`Carrito, ${totalArticulos} artículos`}>
      <FaShoppingCart size={20} />
      <span className="solo-movil">Carrito</span>
      {totalArticulos > 0 && <span key={totalArticulos} className="carrito-insignia">{totalArticulos}</span>}
    </Link>
  );
}
