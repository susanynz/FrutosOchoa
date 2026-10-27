import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

const CLAVE_CARRITO = 'frutos-ochoa-carrito';

// Recupera el carrito guardado para que no se pierda al recargar la página
const leerCarritoGuardado = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(leerCarritoGuardado);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch {
      // Sin almacenamiento disponible el carrito solo vive mientras la página esté abierta
    }
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    // Verifica si el producto ya está en el carrito para sumar cantidad
    setCarrito(prev => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Suma o resta piezas; si llega a cero el producto sale del carrito
  const cambiarCantidad = (id, cambio) => {
    setCarrito(prev =>
      prev
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const cantidadEnCarrito = (id) => carrito.find((item) => item.id === id)?.cantidad || 0;

  // Calcula el total a pagar y el número de piezas
  const totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const totalArticulos = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        cambiarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        cantidadEnCarrito,
        totalCarrito,
        totalArticulos
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
