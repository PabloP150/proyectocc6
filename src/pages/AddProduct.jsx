import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    existencia: '',
    categoria: '',
    descripcion: '',
    imagen: ''
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
      const dataToSend = {
        ...formData,
        precio: parseInt(formData.precio, 10),
        existencia: parseInt(formData.existencia, 10)
      };
      const { data } = await axios.post('http://localhost:5000/api/addProduct', dataToSend);
      alert('Producto Registrado exitosamente.');
      navigate("/")
    } catch (error) {
      setError(error.response?.data?.message || 'Error al agregar el producto. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Agregar Nuevo Producto
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
                sx={{ backgroundColor: '#f9f9f9' }}
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
                label="Categoría"
                name="categoria"
                value={formData.categoria}
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
              <TextField
                fullWidth
                label="Imagen URL"
                name="imagen"
                value={formData.imagen}
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
                {loading ? 'Cargando...' : 'Agregar Producto'}
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
