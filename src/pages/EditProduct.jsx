import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditProduct() {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    existencia: '',
    descripcion: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputChange = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Obtener todos los productos
      const { data: products } = await axios.get('http://localhost:5000/api/productos');
      
      // Filtrar el producto por nombre
      const product = products.find(p => p.nombre === formData.nombre);
      
      if (!product) {
        setError('Producto no encontrado.');
        setLoading(false);
        return;
      }

      // Ahora, enviamos la solicitud para actualizar el producto
      const dataToSend = {
        pid: product.pid, // ID del producto
        nombre: formData.nombre,
        precio: parseInt(formData.precio, 10),
        existencia: parseInt(formData.existencia, 10),
        descripcion: formData.descripcion,
      };

      await axios.put('http://localhost:5000/api/updateProduct', dataToSend);
      alert('Producto editado exitosamente.');
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || 'Error al editar el producto. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductData = async () => {
    try {
      const { data: products } = await axios.get('http://localhost:5000/api/productos');
      const product = products.find(p => p.nombre === formData.nombre);
      if (product) {
        setFormData({
          nombre: product.nombre,
          precio: product.precio,
          existencia: product.existencia,
          descripcion: product.descripcion,
        });
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  useEffect(() => {
    if (formData.nombre) {
      fetchProductData();
    }
  }, [formData.nombre]);

  return (
    <Container maxWidth="sm" sx={{ padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Editar Producto
        </Typography>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={inputChange}
                margin="normal"
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Precio"
                name="precio"
                type="number"
                value={formData.precio}
                onChange={inputChange}
                margin="normal"
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cantidad"
                name="existencia"
                type="number"
                value={formData.existencia}
                onChange={inputChange}
                margin="normal"
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={inputChange}
                margin="normal"
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Editar Producto'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate('/')}
                fullWidth
                sx={{ mt: 2 }}
              >
                Volver
              </Button>
            </Grid>
          </Grid>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </form>
      </Paper>
    </Container>
  );
}
