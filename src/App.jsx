import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Contacto from './pages/Contacto';
import Nosotros from './pages/Nosotros';
import Carrito from './pages/Carrito';
import Opiniones from './pages/Opiniones'; // 1. IMPORTACIÓN AÑADIDA
import './App.css';

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
            <Link to="/contacto" onClick={cerrarMenu}>Contacto</Link>
            <Link to="/opiniones" onClick={cerrarMenu}>Opiniones</Link> {/* 2. LINK AÑADIDO */}
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/opiniones" element={<Opiniones />} /> {/* 3. RUTA AÑADIDA */}
          </Routes>
        </main>

        <footer className="footer">
          <div className="social-links">
            <a href="#"><FaFacebook size={24} /></a>
            <a href="#"><FaInstagram size={24} /></a>
            <a href="#"><FaWhatsapp size={24} /></a>
          </div>
          <p>© 2026 Frutos Deshidratados Ochoa. Todos los derechos reservados.</p>
        </footer>
      </Router>
    </CartProvider>
  );
}

export default App;