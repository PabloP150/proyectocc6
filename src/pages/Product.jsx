import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Grid, Button } from '@mui/material';
import { Header, Navbar, Footer, ProductGrid } from '../Componentes';
import { useCart } from '../CartContext';

export default function Producto() {
  const { categoria, pid } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/productos');
        setAllProducts(response.data);
      } catch (err) {
        console.error('Error completo:', err);
        setError(`Error al cargar los productos: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const producto = allProducts.find(
    product => product.categoria.toLowerCase() === categoria.toLowerCase() && product.pid === parseInt(pid)
  );

  const relatedProducts = allProducts.filter(
    product => product.categoria.toLowerCase() === categoria.toLowerCase() && product.pid !== parseInt(pid)
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (producto) {
      addToCart(producto);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!producto) return <Typography>Producto no encontrado</Typography>;

  return (
    <>
      <Header />
      <Navbar />
      <h2 style={{ marginTop: "1em", paddingLeft: "3em" }}>{producto.nombre}</h2>
      <Box sx={{ width: '100%', height: '70vh'}}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} sx={{ flexGrow: 1, textAlign: 'center'}}>
            <img src={`http://localhost:5000${producto.imagen}`} alt={producto.nombre} style={{ marginLeft: "5vw", height: '35vh', width: '40vw', objectFit: 'contain' }} />
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ width: 300, height: 250, padding: 2 }}>
              <Box sx={{ p: 2, mb: -2}}>
                <Typography variant="h6" fontWeight="bold">Description Del Producto</Typography>
                <Typography>{producto.descripcion}</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{"$" + producto.precio}</Typography>
              </Box>
              <Button variant="contained" color="success" onClick={handleAddToCart}>
                Add to cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginTop: "-10em", marginBottom: "-20px", paddingLeft: "1.8em" }}>Componentes Relacionados</h2>
        <ProductGrid products={relatedProducts} />
      </Box>
      <Footer />
    </>
  );
}
