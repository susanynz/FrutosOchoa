import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { calcularEnvio, metodosPago, ENVIO_GRATIS_DESDE } from '../config/tienda';

const datosIniciales = { nombre: '', email: '', telefono: '', direccion: '', ciudad: '', pago: metodosPago[0].id };

// Folio corto para identificar el pedido simulado, p. ej. FO-482913
const generarFolio = () => `FO-${String(Date.now()).slice(-6)}`;

export default function Carrito() {
  const { carrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito, totalCarrito, totalArticulos } = useContext(CartContext);
  const [datosUsuario, setDatosUsuario] = useState(datosIniciales);
  const [pedido, setPedido] = useState(null);

  const envio = calcularEnvio(totalCarrito);
  const total = totalCarrito + envio;

  const handleCambio = (e) => {
    setDatosUsuario({ ...datosUsuario, [e.target.name]: e.target.value });
  };

  const procesarCompra = (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const nuevoPedido = {
      folio: generarFolio(),
      fecha: new Date().toLocaleString('es-MX'),
      cliente: datosUsuario,
      productos: carrito,
      subtotal: totalCarrito,
      envio,
      total,
      metodoPago: metodosPago.find(m => m.id === datosUsuario.pago)
    };

    // Aquí es donde simulamos el envío de correos y guardado del pedido
    console.log("--- SIMULACIÓN DE COMPRA ---");
    console.log(`Enviando correo de orden a: admin@frutosochoa.com`);
    console.log(`Enviando recibo de compra al cliente: ${datosUsuario.email}`);
    console.log("Detalle del pedido:", nuevoPedido);

    setPedido(nuevoPedido);
    vaciarCarrito();
  };

  if (pedido) {
    return (
      <div className="carrito-container ticket">
        <FaCheckCircle className="ticket-icono" />
        <h2>¡Pedido realizado con éxito!</h2>
        <p>Gracias por tu compra, <strong>{pedido.cliente.nombre}</strong>. Tu número de pedido es <strong>{pedido.folio}</strong>.</p>

        <div className="ticket-detalle">
          <p className="ticket-fecha">{pedido.fecha}</p>
          {pedido.productos.map(item => (
            <div key={item.id} className="ticket-linea">
              <span>{item.cantidad} × {item.nombre}</span>
              <span>${item.precio * item.cantidad}</span>
            </div>
          ))}
          <div className="ticket-linea"><span>Subtotal</span><span>${pedido.subtotal}</span></div>
          <div className="ticket-linea"><span>Envío</span><span>{pedido.envio === 0 ? 'Gratis' : `$${pedido.envio}`}</span></div>
          <div className="ticket-linea ticket-total"><span>Total</span><span>${pedido.total} MXN</span></div>
        </div>

        <p><strong>Forma de pago:</strong> {pedido.metodoPago.nombre}. {pedido.metodoPago.detalle}</p>
        <p><strong>Envío a:</strong> {pedido.cliente.direccion}, {pedido.cliente.ciudad}</p>
        <p>Hemos simulado el envío de un correo con los detalles de tu pedido a: <strong>{pedido.cliente.email}</strong>. El administrador de Frutos Ochoa también ha recibido tu orden para ser surtida.</p>
        <Link to="/tienda" className="btn-proceder-compra">Seguir comprando</Link>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2>Tu Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <img src="/animaciones/mascota-mango.svg" alt="Mango, la mascota de Frutos Ochoa" width="140" height="140" />
          <p>No tienes productos en tu carrito.</p>
          <Link to="/tienda" className="btn-proceder-compra">Ir a la tiendita</Link>
        </div>
      ) : (
        <>
          <div className="lista-carrito">
            {carrito.map((item) => (
              <div key={item.id} className="item-carrito">
                <img src={item.imagen} alt={item.nombre} className="img-carrito-miniatura" />
                <div className="item-info">
                  <h4>{item.nombre}</h4>
                  <p>Precio: ${item.precio} MXN</p>
                  <div className="selector-cantidad selector-compacto">
                    <button onClick={() => cambiarCantidad(item.id, -1)} aria-label="Quitar uno"><FaMinus /></button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => cambiarCantidad(item.id, 1)} aria-label="Agregar uno"><FaPlus /></button>
                  </div>
                  <p><strong>Subtotal: ${item.precio * item.cantidad}</strong></p>
                </div>
                <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)} aria-label={`Quitar ${item.nombre}`}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="carrito-acciones">
            <Link to="/tienda">← Seguir comprando</Link>
            <button className="btn-vaciar" onClick={vaciarCarrito}>Vaciar carrito</button>
          </div>

          <div className="resumen-compra">
            <div className="ticket-linea"><span>Productos ({totalArticulos})</span><span>${totalCarrito}</span></div>
            <div className="ticket-linea">
              <span>Envío</span>
              <span>{envio === 0 ? 'Gratis' : `$${envio}`}</span>
            </div>
            {envio > 0 && (
              <p className="aviso-envio">Agrega ${ENVIO_GRATIS_DESDE - totalCarrito} más y tu envío es gratis.</p>
            )}
            <h3 className="ticket-linea ticket-total"><span>Total a pagar</span><span>${total} MXN</span></h3>

            <form onSubmit={procesarCompra} className="formulario-checkout">
              <h4>Datos de Envío y Contacto</h4>
              <input type="text" name="nombre" placeholder="Nombre Completo" value={datosUsuario.nombre} onChange={handleCambio} required />
              <input type="email" name="email" placeholder="Correo Electrónico" value={datosUsuario.email} onChange={handleCambio} required />
              <input type="tel" name="telefono" placeholder="Teléfono (10 dígitos)" pattern="[0-9]{10}" value={datosUsuario.telefono} onChange={handleCambio} required />
              <input type="text" name="direccion" placeholder="Calle, número y colonia" value={datosUsuario.direccion} onChange={handleCambio} required />
              <input type="text" name="ciudad" placeholder="Ciudad y estado" value={datosUsuario.ciudad} onChange={handleCambio} required />

              <fieldset className="metodos-pago">
                <legend>Forma de pago</legend>
                {metodosPago.map(metodo => (
                  <label key={metodo.id} className={datosUsuario.pago === metodo.id ? 'activo' : ''}>
                    <input type="radio" name="pago" value={metodo.id} checked={datosUsuario.pago === metodo.id} onChange={handleCambio} />
                    <span>
                      <strong>{metodo.nombre}</strong>
                      <small>{metodo.detalle}</small>
                    </span>
                  </label>
                ))}
              </fieldset>

              <button type="submit" className="btn-comprar">Confirmar pedido por ${total} MXN</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
