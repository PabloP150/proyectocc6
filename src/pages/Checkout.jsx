import React, { useState, useEffect } from 'react';
import { Header, Navbar, Footer } from "../Componentes";
import { Box, Typography, Button, Card, CardContent, IconButton, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';


export default function Checkout(props) {

  const CourierInfo = () => {
    const [postalCode, setPostalCode] = useState('');
    const [address, setAddress] = useState('');
    const [selectedCourier, setSelectedCourier] = useState('');
    const [courierName, setCourierName] = useState('');
    const [courierCost, setCourierCost] = useState(0);
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);
    const [areaCovered, setAreaCovered] = useState(true);
    const courierIP = "192.168.0.100";
    const courierExt = "php";
    const format = "json";
    
    const location = useLocation();
    const { total: cartTotal } = location.state || { total: 0 };
    
    const courierOptions = [
      { value: 'ugexpress', label: 'UGExpress' },
      { value: 'mcqueen', label: 'Entregas McQueen' },
      { value: 'alcexpress', label: 'ALC Express' },
    ];

    const fetchData = async () => {
      try {
        const response = await fetch(`http://${courierIP}/consulta.${courierExt}?destino=${postalCode}&formato=${format}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    const handleCourierChange = (event) => {
      const selectedValue = event.target.value;
      setSelectedCourier(selectedValue);
      const selectedOption = courierOptions.find(option => option.value === selectedValue);
      setCourierName(selectedOption ? selectedOption.label : '');
    };

    const getTotal = () => {
      return (courierCost + cartTotal).toFixed(2);
    };

    const handleVerify = () => {
      fetchData();
      setPostalCode(postalCode);
      setAddress(address);

      if (data) {
        if (data.consultaprecio.cobertura === 'TRUE') {
          setAreaCovered(true);
          setCourierCost(parseFloat(data.consultaprecio.costo));
        } else {
          setAreaCovered(false);
        }
      }
    };

    useEffect(() => {
      if (data) {
        console.log('Data:', data.consultaprecio);
        if (data.consultaprecio.cobertura === "FALSE") {
          setAreaCovered(false);
        }
      }
    }, [data]);

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
            Courier Information
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
                    <Typography>{option.label}</Typography>
                }
                style={{ marginBottom: "10px", width: "100%" }}
              />
            ))}
          </RadioGroup>

          {!areaCovered && (
            <Typography variant="body1" color='red'>Area not covered</Typography>
          )}
          {(areaCovered && !loading) &&(
            <Typography variant="body1" color='green'>Area covered!</Typography>
          )}
          <TextField
            label="Postal Code"
            variant="outlined"
            fullWidth
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />
          <Typography
            variant="body1"
            style={{
              color: "red",
              marginBottom: "10px",
              display: areaCovered ? "none" : "block"
            }}
          >
          </Typography>

          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
              width: '95%',
              gap: '20px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerify}
            >
              Verify
            </Button>

            <Box>
              <Typography variant="h6" style={{ color: "gray" }}>
                Courier cost: ${courierCost.toFixed(2)}
              </Typography>
              <Typography variant="h6" style={{ color: "gray" }}>
                Total: ${getTotal()}
              </Typography>
            </Box>
          </Box>
          {postalCode && address && (
            <Box mt={2}>
              <Typography variant="body1">Verified Postal Code: {postalCode}</Typography>
              <Typography variant="body1">Verified Address: {address}</Typography>
            </Box>
          )}
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

      if (card != 16) {
        alert("Enter a valid 16 digit card number");
      } else if (ccvv < 3 || ccvv > 4) {
        alert("Enter a valid cvv 3-4 digit code");
      } else {
        alert("Thank you for you purchase, " + cname);
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
                  sx={{
                    backgroundColor: "snow",
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: selectedPayment === method.name ? "darkgray" : "transparent",
                      '&:hover': {
                        backgroundColor: selectedPayment === method.name ? "darkgray" : "rgba(23, 107, 135, 0.04)",
                      }
                  }}
                >
                  <Button
                    variant={selectedPayment === method.name ? "cover" : "standard"}
                    onClick={() => setSelectedPayment(method.name)}
                    sx={{
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
              label="Cardholder Name"
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
              Confirm Purchase
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