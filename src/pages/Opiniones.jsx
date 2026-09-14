import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Opiniones = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState({ nombre: '', texto: '' });
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para ocultar/mostrar

  useEffect(() => {
    const cargarComentarios = async () => {
      let { data } = await supabase.from('opiniones').select('*');
      if (data) setComentarios(data);
    };
    cargarComentarios();
  }, []);

  const enviarComentario = async (e) => {
    e.preventDefault();
    
    // Validación de campos vacíos
    if (!nuevoComentario.nombre.trim() || !nuevoComentario.texto.trim()) {
      alert("Por favor, completa todos los campos antes de enviar.");
      return;
    }

    const { error } = await supabase.from('opiniones').insert([
      { nombre: nuevoComentario.nombre, comentario: nuevoComentario.texto }
    ]);

    if (error) {
      alert("Error al enviar: " + error.message);
    } else {
      alert("¡Gracias por tu opinión!");
      window.location.reload(); 
    }
  };

  return (
    <div className="contacto-container">
      <h2>Opiniones de nuestros clientes</h2>

      {/* Botón para activar el formulario */}
      {!mostrarFormulario && (
        <button 
          className="btn-enviar" 
          onClick={() => setMostrarFormulario(true)}
          style={{ marginBottom: '20px' }}
        >
          Agregar comentario
        </button>
      )}

      {/* Formulario condicional */}
      {mostrarFormulario && (
        <form onSubmit={enviarComentario} className="formulario">
          <input 
            type="text"
            placeholder="Tu nombre" 
            required
            onChange={(e) => setNuevoComentario({...nuevoComentario, nombre: e.target.value})} 
          />
          <textarea 
            placeholder="Escribe tu opinión aquí..." 
            rows="5"
            required
            onChange={(e) => setNuevoComentario({...nuevoComentario, texto: e.target.value})} 
          />
          <button type="submit" className="btn-enviar">Publicar opinión</button>
          <button 
            type="button" 
            className="btn-eliminar" 
            onClick={() => setMostrarFormulario(false)}
            style={{ marginTop: '10px' }}
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Lista de opiniones */}
      <div className="lista-opiniones" style={{ marginTop: '2rem' }}>
        <h3>Lo que dicen nuestros clientes:</h3>
        {comentarios.map(c => (
          <div key={c.id} className="opinion-card">
            <p><strong>{c.nombre}</strong></p>
            <p>{c.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opiniones;