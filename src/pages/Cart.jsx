import React from 'react';
import { Header, Navbar, Footer } from "../Componentes";
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useCart } from '../CartContext';

export default function Cart() {
  const { cart, removeFromCart, counter } = useCart();

  const CartList = ({ cart }) => (
    <Box sx={{ width: '100%', maxWidth: 600, mr: 2 }}>
      {cart.map((item, index) => (
        <Paper key={index} elevation={3} sx={{ mb: 2, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <img src={`http://localhost:3000${item.imagen}`} alt={item.nombre} style={{ width: '100%', height: 'auto' }} />
            </Grid>
            <Grid item xs={7}>
              <Typography variant="subtitle1">{item.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.precio}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={() => removeFromCart(index)}>
                <Typography variant="body2" color="error">Remove</Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );

  return (
    <>
      <Header />
      <Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', width: '100%' }}>
          <Typography variant="h4" sx={{ mb: 3 }}>Cart ({counter}) Items</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <CartList cart={cart} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Order Summary</Typography>
                <Typography>
                  Total: ${cart.reduce((sum, item) => sum + parseFloat(item.precio), 0).toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Proceed to Checkout
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
