import React, { useState } from 'react';
import './OrderProgress.css';
import { Box, Typography } from '@mui/material';
import { Header, Navbar, Footer } from '../Componentes';
import Select from 'react-select';

export default function ProductState() {
    const totalSteps = 5; 
    const completedSteps = 1;
    const [text, setText] = useState('entregada');
    const [ordenID, setOrdenID] = useState('0522023882gb22');
    const tag = text === 'entregada' ? 'tag' : 'tag_blue';
    const completionPercentage = (completedSteps / totalSteps) * 100; 
    const [selectedOption, setSelectedOption] = useState(null);

    // Data de prueba, estos datos serán dados por el fetch de la tabla
    const data = [
        { value: 1, label: "0522023882gb22" },
        { value: 2, label: "05200238823gb2" },
        { value: 3, label: "4523245882gb22" },
        { value: 4, label: "29230230dhi433" }
    ];

    const handleChange = e => {
        setSelectedOption(e);
    }

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
                                <p className={tag}>
                                    <Typography variant="body1">{text}</Typography>
                                </p>
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
