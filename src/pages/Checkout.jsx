import React, { useState, useEffect, useCallback } from 'react';
import { Header, Navbar, Footer } from "../Componentes";
import { Box, Typography, Button, Card, CardContent, IconButton, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const CourierInfo = React.memo(({ setCourierInfo, courierDB }) => {

  const [areaCovered, setAreaCovered] = useState(false);
  const [verify, setVerify] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('');
  const [courierCost, setCourierCost] = useState(0);
  const [data, setData] = useState('');
  const location = useLocation();
  const { total: cartTotal } = location.state || { total: 0 };

  const format = "json";
  const tempConsulta = `http://localhost:8000/consulta`;
  const consulta = `http://${courierDB.ip}${courierDB.path}/consulta${courierDB.ext}?destino=${postalCode}&formato=${format}`;


  const courierOptions = [
    { value: 'ugexpress', label: 'UGExpress' },
    { value: 'mcqueen', label: 'Entregas McQueen' },
    { value: 'alcexpress', label: 'ALC Express' },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch(tempConsulta);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (data) {
      const cost = parseFloat(data.consultaprecio.costo);
      if (!isNaN(cost)) {
        setCourierCost(cost);
      } else {
        console.error('Invalid cost value:', data.consultaprecio.costo);
      }
      const isAreaCovered = data.consultaprecio.cobertura === 'TRUE';
      setAreaCovered(isAreaCovered);
      setCourierInfo(isAreaCovered, postalCode, address, cartTotal + courierCost);
    }
  }, [data, setCourierInfo, courierCost]);

  const handleVerify = async () => {
    await fetchData();
    setVerify(true);
    setPostalCode(postalCode);
    setAddress(address);
  };

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
          onChange={(e) => {
            setSelectedCourier(e.target.value);
            setCourierInfo(false, postalCode, address, cartTotal + courierCost);
            setAreaCovered(false);
            setVerify(false);
          }}
          style={{ marginBottom: "1em" }}
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

        {data && !areaCovered && verify && (
          <Typography variant="body1" color='red'>Area not covered</Typography>
        )}
        {data && areaCovered && verify && (
          <Typography variant="body1" color='green'>Area covered!</Typography>
        )}
        <TextField
          label="Postal Code"
          variant="outlined"
          fullWidth
          required
          value={postalCode}
          onChange={(e) => {
            setPostalCode(e.target.value);
            setCourierInfo(false, postalCode, address, cartTotal + courierCost);
            setAreaCovered(false);
            setVerify(false);
          }}
          style={{ marginTop: "0.5em", marginBottom: "10px", width: "100%" }}
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
          onChange={(e) => {
            setAddress(e.target.value);
            setCourierInfo(false, postalCode, address, cartTotal + courierCost);
            setAreaCovered(false);
            setVerify(false);
          }}
          style={{ marginBottom: "10px", width: "100%" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleVerify}
          fullWidth
        >
          Verify
        </Button>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            width: '95%',
            gap: '20px',
            marginTop: '0.5em'
          }}
        >
          <Typography variant="h6" style={{ color: "gray" }}>
            Order cost: ${cartTotal.toFixed(2)}
          </Typography>
          <Box>
            <Typography variant="h6" style={{ color: "red" }}>
              Courier cost: ${courierCost ? courierCost.toFixed(2) : '0.00'}
            </Typography>
          </Box>
          <Typography variant="h6" style={{ color: "black" }}>
            Total: ${(courierCost + cartTotal).toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});

const PaymentInfo = React.memo(({ courierInfo, cardDB, courierDB }) => {

  const [selectedPayment, setSelectedPayment] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [date, setDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [data, setData] = useState('');
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();

  const format = "json";
  const autorizacion = `http://${cardDB.ip}${cardDB.path}/autorizacion${cardDB.ext}?tarjeta=${cardNum}&nombre=${cardName}&fecha_venc=${date}&num_seguridad=${cvv}&monto=${courierInfo.totalCost}&tienda=CPN%20Electronics&formato=${format}`;
  const tempAutorizacion = `http://localhost:8000/authorizacion`;

  const orderID = '12345'
  const envio = `http://${courierDB.ip}${courierDB.path}/envio${courierDB.ext}?orden=${orderID}&destinario=${cardName}&destino=${courierInfo.postalCode}&direccion=${courierInfo.address}&tienda=CPN%20Electronics&formato=${format}`;

  const solicitarAutorizacion = async () => {
    try {
      const response = await fetch(tempAutorizacion);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const solicitarEnvio = async () => {
    try {
      const response = await fetch(envio);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (data) {
      const status = data.autorizacion.status === 'APROBADO';
      if (status && courierInfo.validCourier && check) {
        console.log(envio);
        solicitarEnvio();
        alert("Payment approved!\nRerouting to package tracker...");
        navigate('/tracker');
      } else {
        if (!courierInfo.validCourier && check) {
          alert("Please verify the courier information.");
        } else if (courierInfo.validCourier && check) {
          alert("Card Declined!\nPlease contact your bank.");
        }
      }
      setCheck(false);
    }
  }, [data, courierInfo, check]);

  const handleCheck = async (e) => {
    setCheck(true);
    e.preventDefault();

    console.log(cardName);
    console.log(cardNum);
    console.log(date);
    console.log(cvv);
    console.log(courierInfo);
    console.log("price: ", courierInfo.totalCost);
    console.log(autorizacion);

    if (!selectedPayment) {
      alert("Please choose a payment method");
      setCheck(false);
    } else if (cardNum.length !== 1) {
      alert("Please enter a valid 16 digit card number");
      setCheck(false);
      return;
    } else if (cvv.length < 3 || cvv.length > 4) {
      alert("Please enter a valid CVV 3-4 digit code");
      setCheck(false);
      return;
    } else {
      await solicitarAutorizacion();
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length > 4) {
      formattedValue = `${value.slice(0, 4)}/${value.slice(4, 6)}`;
    } else {
      formattedValue = value;
    }

    setDate(formattedValue);
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
        <form onSubmit={handleCheck}>
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
                  margin: '10px',
                  borderRadius: '4px',
                  backgroundColor: selectedPayment === method.name ? 'lightgray' : 'snow',
                  border: selectedPayment === method.name ? '2px solid black' : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: '#E0E0E0'
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
            type="text"
            label="Cardholder Name"
            variant="outlined"
            required
            onChange={(e) => setCardName(e.target.value)}
            sx={{ marginTop: "0.5em", marginBottom: "10px", width: "100%" }}
          />
          <TextField
            type="number"
            label="Card Number"
            variant="outlined"
            required
            onChange={(e) => setCardNum(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />
          <Box display="flex" style={{ marginBottom: "10px" }}>
            <TextField
              label="Expiration Date"
              variant="outlined"
              value={date}
              required
              onChange={handleDateChange}
              placeholder="YYYY/MM"
              inputProps={{
                maxLength: 7
              }}
              sx={{ marginRight: '0.5em', width: '50%' }}
            />
            <TextField
              type="number"
              label="CVV"
              variant="outlined"
              required
              onChange={(e) => setCvv(e.target.value)}
              style={{ marginLeft: '0.5em', width: "50%" }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            id="btn"
            fullWidth
          >
            Pay
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});

export default function Checkout() {
  const [courierInfo, setCourierInfo] = useState({
    validCourier: false,
    postalCode: '',
    address: '',
    totalCost: 0,
  });
  const [courierDB, setCourierDB] = useState({
    ip: "192.168.0.100",
    path: '',
    ext: '.php'
  });
  const [cardDB, setCardDB] = useState({
    ip: "192.168.0.100",
    path: '',
    ext: '.php'
  });

  const memoizedSetCourierInfo = useCallback((validCourier, postalCode, address, totalCost) => {
    setCourierInfo({ validCourier, postalCode, address, totalCost });
  }, []);

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
        <CourierInfo setCourierInfo={memoizedSetCourierInfo} courierDB={courierDB} />
        <PaymentInfo courierInfo={courierInfo} cardDB={cardDB} courierDB={courierDB} />
      </Box>
      <Footer />
    </Box>
  )
}