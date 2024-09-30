import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Header, Navbar, ProductGrid, Footer } from '../Componentes';

export default function Category() {
  const { categoria } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const filteredProducts = allProducts.filter(
    product => product.categoria.toLowerCase() === categoria.toLowerCase()
  );

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Header />
      <Navbar />
      <Box sx={{ padding: 3 }}>
        {filteredProducts.length > 0 ? (
          <ProductGrid categoria={categoria} products={filteredProducts} />
        ) : (
          <Typography>No se encontraron productos en esta categoría.</Typography>
        )}
      </Box>
      <Footer />
    </Box>
  );
}