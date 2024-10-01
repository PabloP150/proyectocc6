import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function Register() {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    contraseña: ''
  });

  // Estado para almacenar mensajes de error
  const [error, setError] = useState('');
  
  // Hook para navegar programáticamente entre rutas
  const navigate = useNavigate();

  // Maneja los cambios en los campos de texto del formulario
  const inputChange = ({target}) => {
    const {name, value} = target;
    setFormData({...formData, [name]: value});
  }
    
  // Maneja el envío del formulario
  const onSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)
    setError(''); // Limpia errores anteriores
    axios.post('http://localhost:5000/api/register', formData)
      .then(({data}) => {
        alert('Registro exitoso. Por favor, inicia sesión.');
        navigate('/login'); // Redirige al usuario a la página de inicio de sesión
      })
      .catch((error) => {
        // Manejo de errores de la petición
        if (error.response) {
          setError(error.response.data || 'Error al registrar. Por favor, intenta de nuevo.');
        } else if (error.request) {
          setError('No se recibió respuesta del servidor. Por favor, intenta de nuevo.');
        } else {
          setError('Error al hacer la petición. Por favor, intenta de nuevo.');
        }
      });
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
        <Typography variant="h5" align="center">Registro</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre Completo"
            value={formData.nombre}
            onChange={inputChange}
            name="nombre"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Nombre de Usuario"
            value={formData.usuario}
            onChange={inputChange}
            name="usuario"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={formData.contraseña}
            onChange={inputChange}
            name="contraseña"
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </Box>
        </Box>
      </Paper>
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Container>
  );
}
