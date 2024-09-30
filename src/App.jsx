import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import Producto from './pages/Product';
import Cart from './pages/Cart.jsx';
import { CartProvider } from './CartContext';

export default function App() {
  return (
    // Envuelve toda la aplicación con el CartProvider para compartir el estado del carrito
    <CartProvider>
      {/* BrowserRouter permite la navegación entre páginas */}
      <BrowserRouter>
        {/* Routes define las rutas de la aplicación */}
        <Routes>
          {/* Ruta para la página principal */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta para las páginas de categoría
              :categoria es un parámetro dinámico que se pasa a la página Category */}
          <Route path="/categoria/:categoria" element={<Category />} />
          
          {/* Ruta para las páginas de producto individual
              :categoria y :pid son parámetros dinámicos que se pasan a la página Producto */}
          <Route path="/product/:categoria/:pid" element={<Producto />} />
          
          {/* Ruta para la página del carrito de compras */}
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}