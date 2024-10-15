import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Container, Avatar, Link as MuiLink } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function Login() {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        usuario: '',
        contraseña: ''
    });
    // Estado para manejar los mensajes de error
    const [error, setError] = useState('');
    // Hook para navegar programáticamente
    const navigate = useNavigate();

    // Función para manejar los cambios en los campos de entrada del formulario
    const inputChange = ({ target }) => {
        const { name, value } = target;
        setFormData({ ...formData, [name]: value });
    }

    // Función para manejar el envío del formulario
    const onSubmit = (e) => {
        e.preventDefault(); // Previene la recarga de la página
        axios.post('http://localhost:5000/api/login', formData)
            .then(response => {
                console.log(response);
                if (response && response.data) {
                    // Almacenamiento de datos del usuario en localStorage
                    localStorage.setItem('cid', response.data.id);
                    localStorage.setItem('username', response.data.usuario);
                    navigate('/'); // Navega al inicio después del login
                } else {
                    throw new Error('Respuesta vacía del servidor');
                }
            })
            .catch(error => {
                // Manejo de errores de la petición
                if (error.response) {
                    setError(error.response.data || 'Error desconocido durante el inicio de sesión');
                } else if (error.request) {
                    setError('No se recibió respuesta del servidor. Por favor, intenta de nuevo.');
                } else {
                    setError('Error al hacer la petición. Por favor, intenta de nuevo.');
                }
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Iniciar Sesión
                </Typography>
                <Box component="form" sx={{ mt: 1 }} onSubmit={onSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="usuario"
                        label="Nombre de Usuario"
                        name="usuario"
                        autoComplete="username"
                        autoFocus
                        value={formData.usuario}
                        onChange={inputChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="contraseña"
                        label="Contraseña"
                        type="password"
                        id="contraseña"
                        autoComplete="current-password"
                        value={formData.contraseña}
                        onChange={inputChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Iniciar Sesión
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                        <MuiLink component={RouterLink} to="/register" variant="body2">
                            {"¿No tienes una cuenta? Regístrate"}
                        </MuiLink>
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
