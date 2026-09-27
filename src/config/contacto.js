// Datos de contacto y redes sociales del negocio.
// Cambia estos valores por los reales; todo el sitio los toma de aquí.
export const WHATSAPP_NUMERO = '5210000000000'; // Formato internacional sin "+", espacios ni guiones
export const FACEBOOK_URL = 'https://www.facebook.com/frutosochoa';
export const INSTAGRAM_URL = 'https://www.instagram.com/frutosochoa';

// Genera el enlace de WhatsApp con un mensaje ya escrito
export const enlaceWhatsApp = (mensaje = 'Hola, quiero información sobre sus frutos deshidratados.') =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
