// Importación de módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');

// Creación de la aplicación Express
const app = express();
const port = 5000;

// Habilitación de CORS para permitir peticiones desde otros dominios
app.use(cors());

// Configuración para parsear JSON en las peticiones
app.use(express.json());

// Configuración de express-session para manejar sesiones de usuario
app.use(session({
  secret: 'tu_secreto', // Clave secreta para firmar el ID de la sesión
  resave: false, // No re-guardar la sesión si no se modifica
  saveUninitialized: true, // Guardar una sesión que es nueva, aunque no se haya modificado
  cookie: { secure: false } // Usar `true` solo si estás en HTTPS
}));

// Configuración para la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',  // Dirección del servidor de base de datos
  user: 'root',       // Usuario de la base de datos
  password: 'root',   // Contraseña del usuario de la base de datos
  database: 'proyectocc6', // Nombre de la base de datos
});

// Intento de conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM producto';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      res.status(500).json({ error: 'Error al obtener los productos', details: err.message });
      return;
    }
    res.json(results);
  });
});

// Ruta para registrar un nuevo usuario
app.post('/api/register', (req, res) => {
  const { nombre, usuario, contraseña } = req.body;
  const values = [nombre, usuario, contraseña];
  connection.query("INSERT INTO cliente (nombre, usuario, contraseña) VALUES (?, ?, ?)", values, (err, result) => {
    if (err) {
      console.error('Error al registrar:', err);
      res.status(500).send(err.message);
    } else {
      if (result.affectedRows > 0) {
        res.status(201).send("Usuario registrado exitosamente");
      } else {
        res.status(400).send("Error al registrar el usuario");
      }
    }
  });
});

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
  const { usuario, contraseña } = req.body;
  const query = "SELECT * FROM cliente WHERE usuario = ? AND contraseña = ?";
  connection.query(query, [usuario, contraseña], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    if (results.length > 0) {
      req.session.userId = results[0].id; // Almacenar ID de usuario en la sesión
      req.session.usuario = results[0].usuario; // Almacenar nombre de usuario en la sesión
      res.status(200).json({
        id: results[0].id,
        usuario: results[0].usuario,
        nombre: results[0].nombre
      });
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});