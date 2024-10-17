// src/pages/DeleteProduct.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DeleteProduct() {
  const [nombre, setNombre] = useState('');
  const [message, setMessage] = useState('');
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Obtener todos los productos al cargar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleDelete = async () => {
    // Filtrar el producto por nombre
    const producto = productos.find(prod => prod.nombre === nombre);
    if (!producto) {
      setMessage('Producto no encontrado');
      return;
    }

    try {
      const response = await axios.delete('http://localhost:3000/api/deleteProduct', {
        data: { nombre: producto.nombre } // Enviar el nombre en el cuerpo de la solicitud
      });
      setMessage(response.data);
      setNombre('');
      
      // Mostrar alerta de éxito
      alert('Producto eliminado exitosamente');
    } catch (error) {
      setMessage('Error al eliminar el producto: ' + error.message);
    }
  };

  return (
    <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Eliminar Producto
          </Typography>
          <TextField
            label="Nombre del Producto"
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="error" onClick={handleDelete} fullWidth>
            Eliminar
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/')} fullWidth sx={{ mt: 2 }}>
            Volver
          </Button>
          {message && <Typography sx={{ mt: 2, textAlign: 'center' }}>{message}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
}
