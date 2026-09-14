import { useState } from 'react';

export default function Chat() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { texto: "¡Hola! ¿Buscas información sobre nuestros frutos deshidratados?", autor: "bot" }
  ]);
  const [input, setInput] = useState("");

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Almacena el mensaje del usuario
    const nuevosMensajes = [...mensajes, { texto: input, autor: "user" }];
    setMensajes(nuevosMensajes);
    setInput("");

    // Programa asíncrona: simula que el bot está "escribiendo" y responde tras 1 segundo
    setTimeout(() => {
      setMensajes(prev => [...prev, { 
        texto: "Gracias por tu mensaje. Un asesor revisará tu pedido pronto.", 
        autor: "bot" 
      }]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <button className="chat-toggle" onClick={() => setAbierto(!abierto)}>
        {abierto ? 'Cerrar Chat' : 'Chat de ayuda'}
      </button>
      
      {abierto && (
        <div className="chat-box">
          <div className="chat-messages">
            {mensajes.map((msg, idx) => (
              <div key={idx} className={`mensaje ${msg.autor}`}>
                {msg.texto}
              </div>
            ))}
          </div>
          <form onSubmit={enviarMensaje} className="chat-form">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Escribe aquí..."
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}