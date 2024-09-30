import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { Header, Navbar, ProductGrid, Footer } from '../Componentes';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const groupProductsByCategory = (products) => {
    return products.reduce((acc, product) => {
      if (!acc[product.categoria]) {
        acc[product.categoria] = [];
      }
      acc[product.categoria].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupProductsByCategory(products);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Header />
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {Object.entries(groupedProducts).map(([categoria, categoryProducts]) => (
          <Box key={categoria} sx={{ mb: 4 }}>
            <ProductGrid categoria={categoria} products={categoryProducts} />
          </Box>
        ))}
      </Container>
      </Box>
      <Footer />
    </>
  );
}
