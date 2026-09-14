import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

export default function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, totalCarrito } = useContext(CartContext);
  const [datosUsuario, setDatosUsuario] = useState({ nombre: '', email: '' });
  const [compraExitosa, setCompraExitosa] = useState(false);

  const handleCambio = (e) => {
    setDatosUsuario({ ...datosUsuario, [e.target.name]: e.target.value });
  };

  const procesarCompra = (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    
    // Aquí es donde simulamos el envío de correos y guardado del pedido
    console.log("--- SIMULACIÓN DE COMPRA ---");
    console.log(`Enviando correo de orden a: admin@frutosochoa.com`);
    console.log(`Enviando recibo de compra al cliente: ${datosUsuario.email}`);
    console.log("Detalle del pedido:", carrito);
    console.log("Total:", totalCarrito);
    
    setCompraExitosa(true);
    vaciarCarrito();
  };

  if (compraExitosa) {
    return (
      <div className="carrito-container">
        <h2>¡Pedido realizado con éxito!</h2>
        <p>Gracias por tu compra, <strong>{datosUsuario.nombre}</strong>.</p>
        <p>Hemos simulado el envío de un correo con los detalles de tu pedido a: <strong>{datosUsuario.email}</strong></p>
        <p>El administrador de Frutos Ochoa también ha recibido tu orden para ser surtida.</p>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2>Tu Carrito de Compras</h2>
      
      {carrito.length === 0 ? (
        <p>No tienes productos en tu carrito.</p>
      ) : (
        <>
          <div className="lista-carrito">
            {carrito.map((item) => (
              <div key={item.id} className="item-carrito">
                <img src={item.imagen} alt={item.nombre} className="img-carrito-miniatura" />
                <div className="item-info">
                  <h4>{item.nombre}</h4>
                  <p>Precio: ${item.precio} | Cantidad: {item.cantidad}</p>
                  <p><strong>Subtotal: ${item.precio * item.cantidad}</strong></p>
                </div>
                <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)}>Quitar</button>
              </div>
            ))}
          </div>
          
          <div className="resumen-compra">
            <h3>Total a pagar: ${totalCarrito} MXN</h3>
            
            <form onSubmit={procesarCompra} className="formulario-checkout">
              <h4>Datos de Envío y Contacto</h4>
              <input 
                type="text" 
                name="nombre" 
                placeholder="Nombre Completo" 
                value={datosUsuario.nombre} 
                onChange={handleCambio} 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Correo Electrónico" 
                value={datosUsuario.email} 
                onChange={handleCambio} 
                required 
              />
              <button type="submit" className="btn-comprar">Confirmar y Simular Compra</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}