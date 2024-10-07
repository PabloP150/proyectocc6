import React, { useState, useEffect } from 'react';
import './OrderProgress.css';
import { Box, Typography } from '@mui/material';
import { Header, Navbar, Footer } from '../Componentes';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProductState() {
    const totalSteps = 5; 
    const completedSteps = 1; 
    const [text, setText] = useState('entregada');
    const tag = text === 'entregada' ? 'tag' : 'tag_blue';
    const completionPercentage = (completedSteps / totalSteps) * 100; 
    const [selectedOption, setSelectedOption] = useState(null);
    const userId = localStorage.getItem("userId");
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleChange = e => {
        setSelectedOption(e);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Datos para enviar en la petición POST
                const formData = {
                    userId: userId, 
                    estado: 'f' 
                };
    
                // Realiza una petición POST a la API para obtener las órdenes del usuario
                const response = await axios.post('http://localhost:5000/api/orden', formData);
                
                console.log('Órdenes recibidas:', response.data);
                
                // Accede a orderIds y formatea los datos
                const formattedData = response.data.orderIds.map(oid => ({
                    value: oid,
                    label: oid
                }));
        
                setData(formattedData);
            } catch (err) {
                console.error('Error obteniendo las órdenes:', err);
                setError(`Error al cargar las órdenes: ${err.response?.data?.error || err.message}`);
            }
        };
    
        fetchOrders();
    }, [userId]);
    

    return (
        <>
            <Box>
                <Header />
                <Navbar />
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left', p: 3 }}>
                    <div style={{ width: '100%' }}>
                        <Typography variant="h4">Control de orden</Typography>
                        {error && <Typography color="error">{error}</Typography>} {/* Muestra el error si existe */}
                        <div className="select-container">
                            <Select
                                placeholder="Select Option"
                                value={selectedOption} 
                                options={data} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="order-progress">
                            <div className="order-header">
                                <div>
                                    <Typography variant="h4">Order 1</Typography>
                                    <Typography variant="body1">
                                        Order Number: {selectedOption ? selectedOption.label : 'N/A'}
                                    </Typography>
                                </div>
                                <div className={tag}>
                                    <Typography variant="body1">{text}</Typography>
                                </div>
                            </div>

                            <div className="steps">
                                <div className="progress-line-bg"></div>
                                <div className="progress-line-fill" style={{ width: `${completionPercentage}%` }}></div>

                                <div className={`step ${completedSteps >= 1 ? 'completed' : ''}`}>
                                    <div className="circle"></div>
                                    <Typography variant="body1">orden nueva</Typography>
                                </div>

                                <div className={`step ${completedSteps >= 2 ? 'completed' : ''}`}>
                                    <div className="circle"></div>
                                    <Typography variant="body1">surtiendose</Typography>
                                </div>

                                <div className={`step ${completedSteps >= 3 ? 'completed' : ''}`}>
                                    <div className="circle"></div>
                                    <Typography variant="body1">empacandose</Typography>
                                </div>

                                <div className={`step ${completedSteps >= 4 ? 'completed' : ''}`}>
                                    <div className="circle"></div>
                                    <Typography variant="body1">en ruta</Typography>
                                </div>

                                <div className={`step ${completedSteps >= 5 ? 'completed' : ''}`}>
                                    <div className="circle"></div>
                                    <Typography variant="body1">entregada</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
                <Footer />
            </Box>
        </>
    );
}
