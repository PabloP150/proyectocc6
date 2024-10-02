import React, { useState, useEffect } from 'react';
import { Header, Navbar, Footer } from "../Componentes";
import { Box, Typography, Button, Card, CardContent, IconButton, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import { CreditCard } from '@mui/icons-material';


export default function Checkout(props) {

  const CourierInfo = () => {
    const [postalCode, setPostalCode] = useState('');
    const [direction, setDirection] = useState('');
    const [selectedCourier, setSelectedCourier] = useState('');
    const [courierPrice, setCourierPrice] = useState('');

    const handleCourierChange = (event) => {
      setSelectedCourier(event.target.value);
    };

    const courierOptions = [
      { value: 'ugexpress', label: 'UGExpress' },
      { value: 'mcqueen', label: 'Entregas McQueen' },
      { value: 'alcexpress', label: 'ALC Express' },
    ];

    const getPrice = () => {
      
      switch (selectedCourier) {
        case 'ugexpress':
          return 10.99;
        case 'mcqueen':
          return 9.99;
        case 'alcexpress':
          return 8.99;
        default:
          return 0;
      }
    };

    useEffect(() => {
      setCourierPrice(`$${getPrice().toFixed(2)}`);
    }, [selectedCourier]);

    return (
      <Card
        variant="outlined"
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "20px 0",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          transition: "0.3s",
          borderRadius: "8px",
        }}
      >
        <div style={{
          backgroundColor: "#176B87",
          padding: "15px"
        }}>
          <Typography variant="h6" style={{ color: "white" }}>
            Shipping Information
          </Typography>
        </div>
        <CardContent style={{ padding: "20px" }}>
          <Typography variant="h6" style={{ marginBottom: "5px" }}>
            Select Courier:
          </Typography>
          <RadioGroup
            aria-label="courier"
            name="courier"
            value={selectedCourier}
            onChange={handleCourierChange}
            style={{ marginBottom: "20px" }}
          >
            {courierOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography>{option.label}</Typography>
                    {selectedCourier === option.value && (
                      <Typography>{courierPrice}</Typography>
                    )}
                  </Box>
                }
                style={{ marginBottom: "10px", width: "100%" }}
              />
            ))}
          </RadioGroup>

          <TextField
            label="Postal Code"
            variant="outlined"
            fullWidth
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />

          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            required
            rows={3}
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-evenly',
              alignItems: { xs: 'center', md: 'flex-start' },
              width: '95%',
              padding: '20px',
              gap: '20px',
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              id="btn"
            >
              <Link to="/checkout" style={{ textDecoration: "none", color: "inherit" }}>
                Verify
              </Link>
            </Button>

            <Box>
            <Typography variant="h6" style={{ color: "gray" }}>
              {selectedCourier ? `Courier cost: ${courierPrice}` : 'Please select a courier'}
            </Typography>
            <Typography variant="h6" style={{ color: "gray" }}>
              Total: ${selectedCourier ? (parseFloat(props.cost) + parseFloat(courierPrice.replace('$', ''))).toFixed(2) : parseFloat(props.cost).toFixed(2)}
            </Typography>
            </Box>

          </Box>
        </CardContent>
      </Card>
    );
  }

  const PaymentInfo = () => {
    const [cname, setCname] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("");

    const check = (e) => {
      e.preventDefault();
      setCname(e.target.nameCard.value);
      const card = e.target.cardNumber.value.length;
      const ccvv = e.target.cvv.value.length;

      if (card < 13 || card > 18) {
        alert("Ingrese una tarjeta válida entre 13 y 18 números");
      } else if (ccvv < 3 || ccvv > 4) {
        alert("Ingrese un CVV válido entre 3 y 4");
      } else {
        alert("Gracias por tu compra " + cname);
        e.target.reset();
      }
    };

    const paymentMethods = [
      { name: "visa", image: "/images/visa.png" },
      { name: "amex", image: "/images/amex.png" },
      { name: "master", image: "/images/mastercard.png" },
      { name: "cred", image: "/images/credomatic.png" },
    ];

    return (
      <Card
        variant="outlined"
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "20px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          borderRadius: "8px",
        }}
      >
        <div style={{
          backgroundColor: "#176B87",
          padding: "15px"
        }}>
          <Typography variant="h6" style={{ color: "white" }}>
            Payment Information
          </Typography>
        </div>
        <CardContent style={{ padding: "20px" }}>
          <form onSubmit={check}>
            <Typography variant="h6" style={{ marginBottom: "0.5em" }}>
              Payment Methods:
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              marginBottom="20px"
            >
              {paymentMethods.map((method) => (
                <Box
                  key={method.name}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  width="22%"
                  maxHeight="10vh"
                  marginRight="0.5em"
                  marginLeft="0.5em"
                  style={{
                    backgroundColor: "snow",
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
                    padding: '10px',
                    borderRadius: '4px'
                  }}
                >
                  <Button
                    variant={selectedPayment === method.name ? "contained" : "standard"}
                    onClick={() => setSelectedPayment(method.name)}
                    style={{
                      width: "100%",
                      height: "60px",
                      backgroundImage: `url(${method.image})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      marginBottom: "5px",
                    }}
                  />
                </Box>
              ))}
            </Box>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <IconButton aria-label="Credit Card">
                <CreditCard />
              </IconButton>
              <Typography variant="h6" style={{ marginLeft: "10px" }}>
                Card Details:
              </Typography>
            </div>

            <TextField
              id="nameCard"
              type="text"
              label="Name on Card"
              variant="outlined"
              required
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <TextField
              id="cardNumber"
              type="number"
              label="Card Number"
              variant="outlined"
              required
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <Box display="flex" style={{ marginBottom: "10px" }}>
              <TextField
                type="date"
                variant="outlined"
                required
                style={{ marginRight: "10px", width: "50%" }}
              />
              <TextField
                id="cvv"
                label="CVV"
                variant="outlined"
                required
                style={{ width: "50%" }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              id="btn"
            >
              <Link to="/checkout" style={{ textDecoration: "none", color: "inherit" }}>
                Confirm
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Header />
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-evenly',
          alignItems: { xs: 'center', md: 'flex-start' },
          width: '95%',
          padding: '20px',
          gap: '20px',
        }}
      >
        <CourierInfo />
        <PaymentInfo />
      </Box>
      <Footer />
    </Box>
  )
}