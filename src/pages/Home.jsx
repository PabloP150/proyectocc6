import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { Header, Navbar, ProductGrid, Footer } from '../Componentes';
import axios from 'axios';

export default function Home() {
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Función para obtener los productos del servidor
    const fetchProducts = async () => {
      try {
        // Realiza una petición GET a la API
        const response = await axios.get('http://localhost:3000/api/productos');
        // Actualiza el estado con los productos recibidos
        setProducts(response.data);
      } catch (error) {
        // En caso de error, lo muestra en la consola
        console.error('Error fetching products:', error);
      }
    };

    // Ejecuta la función para obtener los productos
    fetchProducts();
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Función para agrupar los productos por categoría
  const groupProductsByCategory = (products) => {
    return products.reduce((acc, product) => {
      // Si la categoría no existe en el acumulador, la crea
      if (!acc[product.categoria]) {
        acc[product.categoria] = [];
      }
      // Agrega el producto a su categoría correspondiente
      acc[product.categoria].push(product);
      return acc;
    }, {});
  };

  // Agrupa los productos por categoría
  const groupedProducts = groupProductsByCategory(products);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Navbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Itera sobre las categorías y sus productos */}
          {Object.entries(groupedProducts).map(([categoria, categoryProducts]) => (
            <Box key={categoria} sx={{ mb: 4 }}>
              {/* Renderiza un ProductGrid para cada categoría */}
              <ProductGrid categoria={categoria} products={categoryProducts} />
            </Box>
          ))}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
