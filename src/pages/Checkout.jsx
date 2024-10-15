import React, { useState, useEffect, useCallback } from 'react';
import { Header, Navbar, Footer } from "../Componentes";
import { Box, Typography, Button, Card, CardContent, IconButton, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourierInfo = React.memo(({ setCourierInfo, courierDB }) => {

  const [areaCovered, setAreaCovered] = useState(false);
  const [verify, setVerify] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [courier, setCourier] = useState('');
  const [courierCost, setCourierCost] = useState(0);
  const [data, setData] = useState('');
  const location = useLocation();
  const { total: cartTotal } = location.state || { total: 0 };

  const couriers = courierDB[0] ? [
    { value: 0, coid: courierDB[0].coid, name: courierDB[0].nombre, ip: courierDB[0].ip, path: courierDB[0].carpeta, ext: courierDB[0].extension },
    { value: 1, coid: courierDB[1].coid, name: courierDB[1].nombre, ip: courierDB[1].ip, path: courierDB[1].carpeta, ext: courierDB[1].extension },
    { value: 2, coid: courierDB[2].coid, name: courierDB[2].nombre, ip: courierDB[2].ip, path: courierDB[2].carpeta, ext: courierDB[2].extension }
  ] : [
    { value: 0, name: 'loading...' },
    { value: 1, name: 'loading...' },
    { value: 2, name: 'loading...' }
  ];

  const format = "json";
  const consulta = `http://${courier.ip}${courier.path}/consulta${courier.ext}?destino=${postalCode}&formato=${format}`;
  const tempConsulta = `http://localhost:8000/consulta`;

  const fetchData = async () => {
    try {
      console.log(consulta);
      const response = await fetch(consulta);
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
      setCourierInfo(courier, isAreaCovered, postalCode, address, cartTotal + courierCost);
    }
  }, [data, setCourierInfo, courierCost]);

  const handleVerify = async () => {
    await fetchData();
    setVerify(true);
    setPostalCode(postalCode);
    setAddress(address);
    console.log("Solicitando consulta a: ", consulta);
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
          value={courier ? courier.value : null}
          onChange={(e) => {
            setCourier(couriers[e.target.value]);
            setCourierInfo(courier, false, postalCode, address, cartTotal + courierCost);
            setAreaCovered(false);
            setVerify(false);
          }}
          style={{ marginBottom: "1em" }}
        >
          {couriers.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={
                <Typography>{option.name}</Typography>
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
          type='number'
          label="Postal Code"
          variant="outlined"
          fullWidth
          required
          value={postalCode}
          onChange={(e) => {
            setPostalCode(e.target.value);
            setCourierInfo(courier, false, postalCode, address, cartTotal + courierCost);
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
            setCourierInfo(courier, false, postalCode, address, cartTotal + courierCost);
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

const PaymentInfo = React.memo(({ courierInfo, cardDB }) => {

  const [card, setCard] = useState({});
  const [cardName, setCardName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [date, setDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [data, setData] = useState('');
  const [check, setCheck] = useState(false);
  const [orderID, setOrderID] = useState(0);
  const cid = localStorage.getItem('cid');
  const navigate = useNavigate();

  const cards = cardDB[0] ? [
    { value: 0, name: cardDB[0].nombre, ip: cardDB[0].ip, path: cardDB[0].carpeta, ext: cardDB[0].extension, image: "/images/visa.png" },
    { value: 1, name: cardDB[1].nombre, ip: cardDB[1].ip, path: cardDB[1].carpeta, ext: cardDB[1].extension, image: "/images/amex.png" },
    { value: 2, name: cardDB[2].nombre, ip: cardDB[2].ip, path: cardDB[2].carpeta, ext: cardDB[2].extension, image: "/images/mastercard.png" },
    { value: 3, name: cardDB[3].nombre, ip: cardDB[3].ip, path: cardDB[3].carpeta, ext: cardDB[3].extension, image: "/images/credomatic.png" }
  ] :
    [];

  const courier = courierInfo.courier;
  const format = "json";
  const autorizacion = `http://${card.ip}${card.path}/autorizacion${card.ext}?tarjeta=${cardNum}&nombre=${cardName}&fecha_venc=${date}&num_seguridad=${cvv}&monto=${courierInfo.totalCost}&tienda=CPN%20Electronics&formato=${format}`;
  const tempAutorizacion = `http://localhost:8000/authorizacion`;

  const envio = `http://${courier.ip}${courier.path}/envio${courier.ext}?orden=${orderID}&destinatario=${cardName}&destino=${courierInfo.postalCode}&direccion=${courierInfo.address}&tienda=CPN%20Electronics&formato=${format}`;
  const tempEnvio = `http://localhost:8000/envio`;

  const solicitarAutorizacion = async () => {
    try {
      console.log("Solicitando autorizacion a: ", autorizacion);
      const response = await fetch(autorizacion);
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
      console.log("Solicitando envio a: ", envio);
      const response = await fetch(envio);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);

      // Insertar la orden en la base de datos
      const orderData = {
        cid: cid,
        coid: courier.coid,
        estado: 'f',
        precioTotal: courierInfo.totalCost
      };

      const orderResponse = await axios.post('http://localhost:5000/api/ordenNueva', orderData);
      setOrderID(orderResponse.data.orderId);

      console.log("Order Response:", orderResponse);
      if (orderResponse.status !== 201) {
        console.error('Error inserting order:', orderResponse.data);
        throw new Error('Error inserting order');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (data && data.autorizacion) {
      console.log(data);
      const status = data.autorizacion.status === 'APROBADO';
      if (status && courierInfo.validCourier && check) {
        solicitarEnvio();
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

  useEffect(() => {
    if (orderID > 0) {
      alert(`Payment approved for $${courierInfo.totalCost}!\nYour order number is: ${orderID}\nRerouting to package tracker...`);
      navigate('/tracker');
    }
  }, [orderID]);

  const handleCheck = async (e) => {
    setCheck(true);
    e.preventDefault();
    if (!card) {
      alert("Please choose a payment method");
      setCheck(false);
    } else if (cardNum.length !== 16) {
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

    setFormattedDate(formattedValue);
    setDate(value);
  };

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
            {cards.map((currCard) => (
              <Box
                key={currCard.name}
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
                  backgroundColor: card.name === currCard.name ? 'lightgray' : 'snow',
                  border: card.name === currCard.name ? '2px solid black' : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: '#E0E0E0'
                  }
                }}
              >
                <Button
                  variant={card.name === currCard.name ? "cover" : "standard"}
                  onClick={() => setCard(currCard)}
                  sx={{
                    width: "100%",
                    height: "60px",
                    backgroundImage: `url(${currCard.image})`,
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
              value={formattedDate}
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
    courier: {},
    validCourier: false,
    postalCode: '',
    address: '',
    totalCost: 0,
  });
  const [courierDB, setCourierDB] = useState([]); // Change to an array
  const [cardDB, setCardDB] = useState([]); // Change to an array

  const memoizedSetCourierInfo = useCallback((courier, validCourier, postalCode, address, totalCost) => {
    setCourierInfo({ courier, validCourier, postalCode, address, totalCost });
  }, []);

  // Fetch couriers and tarjetas on component mount
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/couriers');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCourierDB(data); // Store all couriers
        }
      } catch (error) {
        console.error('Error fetching couriers:', error);
      }
    };

    const fetchTarjetas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tarjetas');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCardDB(data); // Store all tarjetas
        }
      } catch (error) {
        console.error('Error fetching tarjetas:', error);
      }
    };

    fetchCouriers();
    fetchTarjetas();
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
        <PaymentInfo courierInfo={courierInfo} cardDB={cardDB} />
      </Box>
      <Footer />
    </Box>
  );
}