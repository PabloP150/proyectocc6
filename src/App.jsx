import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import Producto from './pages/Product';
import Cart from './pages/Cart.jsx';
import { CartProvider } from './CartContext';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Tracker from './pages/Product_state.jsx';
import Register from './pages/Register'; // Añade esta línea
import AddProduct from './pages/AddProduct'; // Importa el nuevo componente
import DeleteProduct from './pages/DeleteProduct'; // Importa el nuevo componente
import EditProduct from './pages/EditProduct.jsx';

export default function App() {
  return (
    // Envuelve toda la aplicación con el CartProvider para compartir el estado del carrito entre componentes
    <CartProvider>
      {/* BrowserRouter permite la navegación entre páginas usando la barra de direcciones */}
      <BrowserRouter>
        {/* Routes define las rutas de la aplicación y los componentes que se renderizarán */}
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
          
          {/* Ruta para la página de inicio de sesión */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta para la página de registro */}
          <Route path="/register" element={<Register />} />

          {/* Ruta para la página de courier/pago */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Ruta para la página de Tracker */}
          <Route path="/tracker" element={<Tracker />} />

          {/* Ruta para agregar un nuevo producto */}
          <Route path="/add-product" element={<AddProduct />} />

          {/* Ruta para eliminar un producto */}
          <Route path="/delete-product" element={<DeleteProduct />} />

           {/* Ruta para editar un producto */}
           <Route path="/edit-product" element={<EditProduct />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
