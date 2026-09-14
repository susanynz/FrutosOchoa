import { useState } from 'react';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });

  // Manejo de eventos: actualiza el estado al teclear
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejo de eventos: previene recarga de página al enviar
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`¡Gracias ${form.nombre}! Hemos recibido tu mensaje sobre Frutos Ochoa.`);
    setForm({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="contacto-container">
      <h2>Contáctanos</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <input 
          type="text" 
          name="nombre" 
          placeholder="Tu Nombre" 
          value={form.nombre} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Tu Correo Electrónico" 
          value={form.email} 
          onChange={handleChange} 
          required 
        />
        <textarea 
          name="mensaje" 
          placeholder="¿En qué te podemos ayudar?" 
          rows="5"
          value={form.mensaje} 
          onChange={handleChange} 
          required 
        />
        <button type="submit" className="btn-enviar">Enviar Mensaje</button>
      </form>
    </div>
  );
}