import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCommentDots, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { enlaceWhatsApp } from '../config/contacto';

// Quita acentos y mayúsculas para comparar palabras clave
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Reglas del bot: si el mensaje contiene alguna palabra clave, responde con ese texto.
// El orden importa: gana la primera que coincida, por eso las más específicas van primero
// y el saludo va al final ("hola, ¿hacen envíos?" responde sobre envíos).
const reglas = [
  {
    claves: ['envio', 'enviar', 'envian', 'foraneo', 'llega', 'entrega', 'paqueteria', 'domicilio'],
    respuesta: 'Hacemos envíos a todo México. Tu pedido llega en 3 a 7 días hábiles, según tu ciudad.'
  },
  {
    claves: ['pago', 'pagar', 'tarjeta', 'transferencia', 'deposito', 'efectivo'],
    respuesta: 'Aceptamos transferencia bancaria, depósito y pago con tarjeta.'
  },
  {
    claves: ['mayoreo', 'mayorista', 'evento', 'volumen', 'negocio'],
    respuesta: 'Sí vendemos por mayoreo y para eventos. Un asesor te puede dar una cotización por WhatsApp.',
    whatsapp: true
  },
  {
    claves: ['pedido', 'comprar', 'compra', 'ordenar', 'carrito'],
    respuesta: 'Para comprar, agrega tus productos desde la Tienda, revisa tu carrito y completa tus datos.',
    enlace: { texto: 'Ver mi carrito', ruta: '/carrito' }
  },
  {
    claves: ['precio', 'cuesta', 'costo', 'cuanto', 'vale', 'catalogo', 'producto'],
    respuesta: 'Todos nuestros frutos vienen en presentación de 100 g. Puedes ver el precio de cada uno en la Tienda.',
    enlace: { texto: 'Ir a la Tienda', ruta: '/tienda' }
  },
  {
    claves: ['horario', 'abren', 'cierran', 'atienden'],
    respuesta: 'Atendemos de lunes a viernes, de 8:00 am a 4:00 pm.'
  },
  {
    claves: ['tienda fisica', 'sucursal', 'direccion', 'ubicacion', 'donde estan'],
    respuesta: 'Por ahora somos una tienda 100% en línea, sin tienda física.'
  },
  {
    claves: ['azucar', 'conservador', 'natural', 'saludable', 'ingrediente'],
    respuesta: 'Nuestros frutos no llevan azúcar añadida ni conservadores: solo fruta deshidratada con su dulzor natural.'
  },
  {
    claves: ['asesor', 'humano', 'persona', 'whatsapp', 'hablar', 'ayuda'],
    respuesta: 'Con gusto te comunico con un asesor por WhatsApp.',
    whatsapp: true
  },
  {
    claves: ['gracias', 'adios', 'bye', 'hasta luego'],
    respuesta: '¡Gracias a ti! Que disfrutes tus frutos Ochoa 🍓'
  },
  {
    claves: ['hola', 'buenas', 'buenos dias', 'que tal'],
    respuesta: '¡Hola! 😊 Puedo ayudarte con precios, envíos, pagos, pedidos u horarios. ¿Qué necesitas?'
  }
];

const sinCoincidencia = {
  respuesta: 'No estoy seguro de haber entendido 🤔. Puedes revisar las preguntas frecuentes o hablar con un asesor.',
  enlace: { texto: 'Ver preguntas frecuentes', ruta: '/faq' },
  whatsapp: true
};

// Busca la primera regla cuya palabra clave aparezca en el mensaje
const responder = (mensaje) => {
  const texto = normalizar(mensaje);
  return reglas.find(regla => regla.claves.some(clave => texto.includes(clave))) || sinCoincidencia;
};

const sugerencias = ['Precios', 'Envíos', 'Formas de pago', 'Hablar con un asesor'];

export default function Chat() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { texto: '¡Hola! Soy el asistente de Frutos Ochoa. ¿En qué te puedo ayudar?', autor: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const finRef = useRef(null);

  // Baja automáticamente al último mensaje
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, escribiendo, abierto]);

  const enviar = (texto) => {
    if (!texto.trim() || escribiendo) return;

    setMensajes(prev => [...prev, { texto, autor: 'user' }]);
    setInput('');
    setEscribiendo(true);

    // Programa asíncrona: simula que el bot está "escribiendo" y responde tras 1 segundo
    setTimeout(() => {
      const { respuesta, enlace, whatsapp } = responder(texto);
      setMensajes(prev => [...prev, { texto: respuesta, autor: 'bot', enlace, whatsapp }]);
      setEscribiendo(false);
    }, 1000);
  };

  const enviarMensaje = (e) => {
    e.preventDefault();
    enviar(input);
  };

  return (
    <div className="chat-container">
      {abierto && (
        <div className="chat-box">
          <div className="chat-header">
            <span>Asistente Frutos Ochoa</span>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar chat"><FaTimes /></button>
          </div>

          <div className="chat-messages">
            {mensajes.map((msg, idx) => (
              <div key={idx} className={`mensaje ${msg.autor}`}>
                {msg.texto}
                {msg.enlace && (
                  <Link to={msg.enlace.ruta} className="chat-accion" onClick={() => setAbierto(false)}>
                    {msg.enlace.texto}
                  </Link>
                )}
                {msg.whatsapp && (
                  <a href={enlaceWhatsApp()} target="_blank" rel="noopener noreferrer" className="chat-accion chat-whatsapp">
                    <FaWhatsapp /> Hablar con un asesor
                  </a>
                )}
              </div>
            ))}
            {escribiendo && <div className="mensaje bot escribiendo">Escribiendo...</div>}
            <div ref={finRef} />
          </div>

          <div className="chat-sugerencias">
            {sugerencias.map(s => (
              <button key={s} onClick={() => enviar(s)} disabled={escribiendo}>{s}</button>
            ))}
          </div>

          <form onSubmit={enviarMensaje} className="chat-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe aquí..."
              aria-label="Escribe tu mensaje"
            />
            <button type="submit" disabled={escribiendo}>Enviar</button>
          </form>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setAbierto(!abierto)}>
        {abierto ? <><FaTimes /> Cerrar</> : <><FaCommentDots /> Chat de ayuda</>}
      </button>
    </div>
  );
}
