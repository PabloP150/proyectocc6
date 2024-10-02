import React, { useState, useEffect } from 'react';
import { Header, Navbar, Footer } from "../Componentes";
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useCart } from '../CartContext';

export default function Cart() {
  // Obtiene las funciones y el estado del carrito del contexto
  const { cart, removeFromCart, counter } = useCart();

  // Estado para almacenar el total del carrito
  const [total, setTotal] = useState(0);

  // Función para agrupar productos iguales en el carrito
  const groupedCart = cart.reduce((acc, item) => {
    const existingItem = acc.find(i => i.pid === item.pid);
    if (existingItem) {
      // Si el producto ya existe, incrementa la cantidad
      existingItem.quantity += 1;
    } else {
      // Si es un nuevo producto, agrégalo con cantidad 1
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  // Efecto para calcular el total cada vez que el carrito cambie
  useEffect(() => {
    const newTotal = groupedCart.reduce((sum, item) => sum + parseFloat(item.precio) * item.quantity, 0);
    setTotal(newTotal);
  }, [groupedCart]); // Dependencia en groupedCart para recalcular cuando cambie

  // Componente para mostrar la lista de productos en el carrito
  const CartList = ({ groupedCart }) => (
    <Box sx={{ width: '100%', maxWidth: 600, mr: 2 }}>
      {groupedCart.map((item, index) => (
        <Paper key={index} elevation={3} sx={{ mb: 2, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Imagen del producto */}
            <Grid item xs={3}>
              <img src={`http://localhost:3000${item.imagen}`} alt={item.nombre} style={{ width: '100%', height: 'auto' }} />
            </Grid>
            {/* Detalles del producto */}
            <Grid item xs={7}>
              <Typography variant="subtitle1">{item.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.precio} x {item.quantity}
              </Typography>
            </Grid>
            {/* Botón para eliminar el producto */}
            <Grid item xs={2}>
              <Button onClick={() => removeFromCart(index)}>
                <Typography variant="body2" color="error">Eliminar</Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Navbar />
      {/* Contenido principal del carrito */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', width: '100%' }}>
          {/* Título del carrito con contador de productos */}
          <Typography variant="h4" sx={{ mb: 3 }}>Carrito De Compras ({counter}) </Typography>
          <Grid container spacing={3}>
            {/* Lista de productos en el carrito */}
            <Grid item xs={12} md={8}>
              <CartList groupedCart={groupedCart} />
            </Grid>
            {/* Resumen del pedido */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Resumen Del Pedido</Typography>
                {/* Cálculo del total del pedido */}
                <Typography>
                  Total: ${total.toFixed(2)}
                </Typography>
                {/* Botón para proceder al checkout */}
                <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
                  Pasar Al Checkout
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}