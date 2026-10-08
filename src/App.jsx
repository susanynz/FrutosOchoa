import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Contacto from './pages/Contacto';
import Nosotros from './pages/Nosotros';
import Carrito from './pages/Carrito';
import Opiniones from './pages/Opiniones';
import Faq from './pages/Faq';
import Chat from './components/Chat';
import ValoracionPagina from './components/ValoracionPagina';
import { FACEBOOK_URL, INSTAGRAM_URL, enlaceWhatsApp } from './config/contacto';
import './App.css';

// Redes sociales del footer; las URLs se editan en src/config/contacto.js
const redesSociales = [
  { nombre: 'Facebook', url: FACEBOOK_URL, icono: <FaFacebook size={24} /> },
  { nombre: 'Instagram', url: INSTAGRAM_URL, icono: <FaInstagram size={24} /> },
  { nombre: 'WhatsApp', url: enlaceWhatsApp(), icono: <FaWhatsapp size={24} /> }
];

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <CartProvider>
      <Router>
        <nav className="navbar">
          <div className="logo">
            <img src="/img/logo.png" alt="Logo Frutos Ochoa" />
            Frutos Ochoa
          </div>

          <div className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>

          <div className={`links ${menuAbierto ? 'active' : ''}`}>
            <Link to="/" onClick={cerrarMenu}>Inicio</Link>
            <Link to="/nosotros" onClick={cerrarMenu}>Quiénes Somos</Link>
            <Link to="/tienda" onClick={cerrarMenu}>Tienda</Link>
            <Link to="/faq" onClick={cerrarMenu}>Preguntas Frecuentes</Link>
            <Link to="/contacto" onClick={cerrarMenu}>Contacto</Link>
            <Link to="/opiniones" onClick={cerrarMenu}>Opiniones</Link>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/opiniones" element={<Opiniones />} />
          </Routes>

          {/* Valoración con estrellas al final de cada página */}
          <ValoracionPagina />
        </main>

        {/* Chat disponible en todas las páginas */}
        <Chat />

        <footer className="footer">
          <p className="social-titulo">Síguenos en redes sociales</p>
          <div className="social-links">
            {redesSociales.map(red => (
              <a
                key={red.nombre}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Frutos Ochoa en ${red.nombre}`}
                title={red.nombre}
              >
                {red.icono}
              </a>
            ))}
          </div>
          <p>© 2026 Frutos Deshidratados Ochoa. Todos los derechos reservados.</p>
        </footer>
      </Router>
    </CartProvider>
  );
}

export default App;
