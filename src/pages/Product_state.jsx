import React, { useState, useEffect } from 'react';
import './OrderProgress.css';
import { Box, Typography } from '@mui/material';
import { Header, Navbar, Footer } from '../Componentes';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProductState() {
    const totalSteps = 5; 
    const [completedSteps, setCompletedSteps] = useState(1); 
    const [text, setText] = useState('entregada');
    const tag = text === 'entregada' ? 'tag' : 'tag_blue';
    const completionPercentage = (completedSteps / totalSteps) * 100; 
    const [selectedOption, setSelectedOption] = useState(null);
    const userId = localStorage.getItem("cid");
    const [data, setData] = useState([]);
    const [finalData, setFinalData] = useState('');
    const [couriers, setCouriers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const tempStatus = `http://localhost:8000/status`;
    
    const handleChange = async (e) => {
        setSelectedOption(e);
        await fetchData();
    };
    
    const fetchCourierData = async (orders) => {
        try {
            const couriersPromises = orders.map(async (order) => {
                const courierResponse = await axios.post('http://localhost:5000/api/courier', { coid: order.coid });
                
                return {
                    orderId: order.oid,
                    courierInfo: courierResponse.data
                };
            });

            const couriersData = await Promise.all(couriersPromises);
            setCouriers(couriersData);
        } catch (err) {
            console.error('Error obteniendo los datos del courier:', err);
        }
    };

    const fetchData = async () => {
        try {
          const response = await fetch(getCourierStatusUrl());
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const jsonData = await response.json();
          setFinalData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (finalData) {
            const status = parseInt(finalData.orden.status);
            setCompletedSteps(status);
        }
    }, [finalData]);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const formData = {
                    userId: userId, 
                    estado: 'f' 
                };

                const response = await axios.post('http://localhost:5000/api/orden', formData);

                if (response.data.orderData && Array.isArray(response.data.orderData)) {
                    const formattedData = response.data.orderData.map(orderId => {
                        return {
                            value: orderId.oid,
                            label: orderId.oid 
                        };
                    });
                    setData(formattedData);

                    await fetchCourierData(response.data.orderData);
                } else {
                    console.log('Respuesta inesperada de la API:', response.data);
                    setError('No se encontraron órdenes para este usuario');
                }
            } catch (err) {
                console.error('Error obteniendo las órdenes:', err);
                setError(`No se encontraron órdenes para este usuario`);
            }
        };
    
        fetchOrders();
    }, [userId]);
    
    const selectedCourierInfo = selectedOption 
        ? couriers.find(c => c.orderId === selectedOption.label) 
        : null;

    // Construir la URL de IP según el courier seleccionado
    const getCourierStatusUrl = () => {
        if (selectedCourierInfo) {
            const orderId = selectedCourierInfo.orderId;
            const courierInfo = selectedCourierInfo.courierInfo; 
            const base = courierInfo.ip; 
            const store = 'CPN%20Electronics'; 
            const format = 'json'; 
            
            // Añadir la carpeta si existe
            const folder = courierInfo.carpeta ? `/${courierInfo.carpeta}` : '';
            
            return `http://${base}${folder}/status?orden=${orderId}&tienda=${store}&formato=${format}`;
        }
        return '';
    };

    return (
        <>
            <Box>
                <Header />
                <Navbar />
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left', p: 3 }}>
                    <div style={{ width: '100%' }}>
                        <Typography variant="h4">Control de orden</Typography>

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

                        {/* Mostrar información del courier si está disponible 
                        {selectedCourierInfo && (
                            <div className="courier-info">
                                <Typography variant="h5">Información del Courier:</Typography>
                                <Typography variant="body1">Nombre: {selectedCourierInfo.courierInfo.nombre}</Typography>
                                <Typography variant="body1">IP: {selectedCourierInfo.courierInfo.ip}</Typography>
                                <Typography variant="body1">Carpeta: {selectedCourierInfo.courierInfo.carpeta || 'N/A'}</Typography>
                                <Typography variant="body1">URL de estado: <a href={getCourierStatusUrl()}>{getCourierStatusUrl()}</a></Typography>
                            </div>
                        )}*/}
                    </div>
                </Box>
                <Footer />
            </Box>
        </>
    );
}
