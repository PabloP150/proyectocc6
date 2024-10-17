import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { Header, Navbar, ProductGridAll, Footer } from '../Componentes';

export default function Category() {
  // Obtiene el parámetro 'categoria' de la URL
  const { categoria } = useParams();
  
  // Estado para almacenar todos los productos
  const [allProducts, setAllProducts] = useState([]);
  
  // Estado para manejar errores
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener los productos del servidor
    const fetchProducts = async () => {
      try {
        // Realiza una petición GET a la API
        const response = await axios.get('http://localhost:3000/api/productos');
        // Actualiza el estado con los productos recibidos
        setAllProducts(response.data);
      } catch (err) {
        // En caso de error, lo muestra en la consola
        console.error('Error completo:', err);
        // Actualiza el estado de error con un mensaje descriptivo
        setError(`Error al cargar los productos: ${err.response?.data?.error || err.message}`);
      } 
    };
    // Ejecuta la función para obtener los productos
    fetchProducts();
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Filtra los productos por la categoría actual
  const filteredProducts = allProducts.filter(
    product => product.categoria === categoria
  );

  // Si hay un error, muestra un mensaje de error
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Header />
      <Navbar />
      <Box sx={{ padding: 3 }}>
        {filteredProducts.length > 0 ? (
          // Si hay productos en la categoría, muestra el grid de productos
          <ProductGridAll categoria={categoria} products={filteredProducts} />
        ) : (
          // Si no hay productos, muestra un mensaje
          <Typography>No se encontraron productos en esta categoría.</Typography>
        )}
      </Box>
      <Footer />
    </Box>
  );
}
