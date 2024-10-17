import React from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Paper,
  Button,
  Menu,
  MenuItem,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { CreditCard, Facebook, Instagram, ShoppingCart } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useState } from "react";

export function Header() {
  return (
    <Box
      height={"30vh"}
      width={"100%"}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      sx={{
        backgroundImage: `url('/images/header.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          color: "white",
          textShadow: "1px 1px 10px rgba(0,0,0,0.7)",
        }}
      >
        CPN Electronics
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          color: "white",
          textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
        }}
      >
        For all your computer needs!
      </Typography>
    </Box>
  );
}

export function Navbar() {
  // Utiliza el contexto del carrito para obtener el contador de artículos
  const { counter } = useCart();
  // Hook para la navegación programática
  const navigate = useNavigate();
  // Obtiene el nombre de usuario del almacenamiento local
  const username = localStorage.getItem("username");

  // Estado para el menú desplegable
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Limpia el almacenamiento local
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    // Redirige al usuario a la página principal
    navigate("/"); // Cambiado de '/login' a '/'
    setAnchorEl(null);
  };

  const handleTracker = () => {
    navigate("/tracker");
    setAnchorEl(null);
  };

  const handleAddProduct = () => {
    navigate("/add-product");
    setAnchorEl(null);
  };

  const handleDeleteProduct = () => {
    navigate("/delete-product");
    setAnchorEl(null);
  };

  const handleEditProduct = () => {
    navigate("/edit-product");
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#176B87" }}>
      <Toolbar>
        {/* Enlaces de navegación para diferentes secciones del sitio */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            to="/categoria/gpus"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            GPUs
          </Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            to="/categoria/cpus"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            CPUs
          </Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            to="/categoria/motherboards"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Motherboards
          </Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            to="/categoria/ram"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            RAM
          </Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            to="/categoria/storage"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Storage
          </Link>
        </Typography>
        {/* Condición para mostrar información de usuario o botón de inicio de sesión */}
        {username ? (
          <>
            <Button
              color="inherit"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              {/* nombre de usuario */}
              {username}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleTracker}>Track Package</MenuItem>
              <MenuItem onClick={handleAddProduct}>Add Product</MenuItem>
              <MenuItem onClick={handleDeleteProduct}>Delete Product</MenuItem>
              <MenuItem onClick={handleEditProduct}>Edit Product</MenuItem>
              <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Iniciar Sesión
          </Button>
        )}
        {/* Icono del carrito de compras con contador */}
        <Link to="/cart" style={{ textDecoration: "none", color: "inherit" }}>
          <IconButton color="inherit">
            <ShoppingCart />
            <Typography variant="body1" style={{ marginLeft: "5px" }}>
              ({counter})
            </Typography>
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

// Componente que renderiza una lista de categorías de productos
export function CategoryList() {
  return (
    // Crea una lista de navegación con el componente
    <List component="nav" aria-label="product categories">
      {/* Itera sobre un array de categorías predefinidas */}
      {["GPUs", "CPUs", "Motherboards", "RAM", "Storage"].map((categoria) => (
        // Crea un elemento de lista para cada categoría
        // La prop 'key' es necesaria para React cuando se renderizan listas
        <ListItem button key={categoria}>
          {/* Renderiza el texto de la categoría */}
          <ListItemText primary={categoria} />
        </ListItem>
      ))}
    </List>
  );
}

export function ProductGrid({ categoria, products }) {
  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textTransform: "uppercase",
          mb: 2,
          fontWeight: "bold",
          borderBottom: "1px solid #ccc",
          paddingTop: 4,
        }}
      >
        {categoria}
      </Typography>
      <Grid container spacing={2}>
        {products.slice(0, 4).map((producto) => (
          <Grid item xs={12} sm={6} md={3} key={producto.pid}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Link
                to={`/product/${producto.categoria}/${producto.pid}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <img
                    src={`http://localhost:3000${producto.imagen}`}
                    alt={producto.nombre}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ flexGrow: 1, textAlign: "center" }}
                >
                  {producto.descripcion}
                </Typography>
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Nueva función para mostrar todos los productos de una categoría
export function ProductGridAll({ categoria, products }) {
  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textTransform: "uppercase",
          mb: 1,
          fontWeight: "bold",
          borderBottom: "1px solid #ccc",
          paddingTop: 4,
        }}
      >
        {categoria}
      </Typography>
      <Grid container spacing={6}>
        {products.map((producto) => (
          <Grid item xs={8} sm={3} md={3} key={producto.pid}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                marginBottom: 1,
              }}
            >
              <Link
                to={`/product/${producto.categoria}/${producto.pid}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <img
                    src={`http://localhost:3000${producto.imagen}`}
                    alt={producto.nombre}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ flexGrow: 1, textAlign: "center" }}
                >
                  {producto.descripcion}
                </Typography>
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function Footer() {
  return (
    <>
      <footer
        style={{
          backgroundColor: "#176B87",
          padding: "5px",
          marginTop: "5vh",
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" align="left" gutterBottom color={"white"}>
              Contact Us<br></br>
              53304943
            </Typography>
            <div>
              <IconButton
                aria-label="Facebook"
                component={Link}
                href="https://www.facebook.com/"
                fontSize="large"
                sx={{ color: "white" }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                component={Link}
                href="https://www.instagram.com/"
                fontSize="large"
                sx={{ color: "white" }}
              >
                <Instagram />
              </IconButton>
            </div>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary" align="center">
              {"© "}
              <Link to="/" sx={{ color: "white" }}>
                Your Website
              </Link>
            </Typography>
          </Box>
        </Container>
      </footer>
    </>
  );
}
