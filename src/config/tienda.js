// Reglas de la tiendita virtual: envío, categorías y formas de pago

export const ENVIO_GRATIS_DESDE = 300;
export const COSTO_ENVIO = 60;

export const calcularEnvio = (subtotal) =>
  subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;

// Categoría de cada producto según su id en la tabla productos
export const categorias = [
  { id: 'tropicales', nombre: 'Tropicales', productos: [1, 2, 5, 7, 8, 9] },
  { id: 'rojos', nombre: 'Frutos rojos', productos: [4, 6, 18] },
  { id: 'citricos', nombre: 'Cítricos', productos: [16, 17] },
  { id: 'clasicos', nombre: 'Clásicos', productos: [3, 10, 11, 12, 13, 19, 20] },
  { id: 'mixes', nombre: 'Mixes', productos: [14, 15] }
];

export const categoriaDe = (productoId) =>
  categorias.find(cat => cat.productos.includes(productoId)) || { id: 'otros', nombre: 'Otros' };

// Pagos simulados: la tiendita no pide ni guarda datos de tarjeta
export const metodosPago = [
  { id: 'contra-entrega', nombre: 'Pago contra entrega', detalle: 'Pagas en efectivo al recibir tu pedido.' },
  { id: 'transferencia', nombre: 'Transferencia bancaria', detalle: 'Te enviamos los datos de la cuenta por correo.' },
  { id: 'oxxo', nombre: 'Pago en OXXO', detalle: 'Recibes una referencia para pagar en tienda.' }
];
