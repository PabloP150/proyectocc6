import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Button } from '@mui/material';
import { Header, Navbar, Footer, ProductGrid } from '../Componentes';
import { useCart } from '../CartContext';

export default function Producto() {
  // Obtiene los parámetros de la URL
  const { categoria, pid } = useParams();
  
  // Estado para almacenar todos los productos
  const [allProducts, setAllProducts] = useState([]);
  
  // Estado para manejar errores
  const [error, setError] = useState(null);
  
  // Obtiene la función addToCart del contexto del carrito
  const { addToCart } = useCart();

  useEffect(() => {
    // Función para obtener los productos del servidor
    const fetchProducts = async () => {
      try {
        // Realiza una petición GET a la API
        const response = await axios.get('http://localhost:5000/api/productos');
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

  // Encuentra el producto específico basado en la categoría y el pid
  const producto = allProducts.find(
    product => product.categoria === categoria && product.pid === parseInt(pid)
  );

  // Obtiene productos relacionados (misma categoría, diferente pid)
  const relatedProducts = allProducts.filter(
    product => product.categoria === categoria && product.pid !== parseInt(pid)
  ).slice(0, 4); // Lim 4 productos relaciondos

  // Función para manejar la adición al carrito
  const handleAddToCart = () => {
    if (producto) {
      addToCart(producto);
    }
  };

  // Si hay un error, muestra un mensaje de error
  if (error) return <Typography color="error">{error}</Typography>;
  
  // Si no se encuentra el producto, muestra un mensaje
  if (!producto) return <Typography>Producto no encontrado</Typography>;

  return (
    <>
      <Header />
      <Navbar />
      <h2 style={{ marginTop: "1em", paddingLeft: "3em" }}>{producto.nombre}</h2>
      <Box sx={{ width: '100%', height: '70vh'}}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* Imagen del producto */}
          <Grid item xs={6} sx={{ flexGrow: 1, textAlign: 'center'}}>
            <img src={`http://localhost:3000${producto.imagen}`} alt={producto.nombre} style={{ marginLeft: "5vw", height: '35vh', width: '40vw', objectFit: 'contain' }} />
          </Grid>
          {/* Detalles del producto */}
          <Grid item xs={6}>
            <Box sx={{ width: 300, height: 250, padding: 2 }}>
              <Box sx={{ p: 2, mb: -2}}>
                <Typography variant="h6" fontWeight="bold">Description Del Producto</Typography>
                <Typography>{producto.descripcion}</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{"$" + producto.precio}</Typography>
              </Box>
              {/* Botón para añadir al carrito */}
              <Button variant="contained" color="success" onClick={handleAddToCart}>
                Add to cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* Sección de productos relacionados */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginTop: "-10em", marginBottom: "-20px", paddingLeft: "1.8em" }}>Componentes Relacionados</h2>
        <ProductGrid products={relatedProducts} />
      </Box>
      <Footer />
    </>
  );
}