// Importación de módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Creación de la aplicación Express
const app = express();
const port = 5000;

// Habilitación de CORS para permitir peticiones desde otros dominios
app.use(cors());

// Configuración para parsear JSON en las peticiones
app.use(express.json());

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',  // Dirección del servidor de base de datos
  user: 'root',       
  password: 'root',  
  database: 'proyectocc6', // Nombre de la base de datos
});

// Intento de conexión a la base de datos
connection.connect((err) => {
  if (err) {
    // Si hay un error, lo muestra en la consola y termina la ejecución
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  // Si la conexión es exitosa, muestra un mensaje en la consola
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
  // Consulta SQL para seleccionar todos los productos
  const query = 'SELECT * FROM producto';
  
  // Ejecución de la consulta
  connection.query(query, (err, results) => {
    if (err) {
      // Si hay un error en la consulta, lo muestra en la consola
      console.error('Error en la consulta SQL:', err);
      // Envía una respuesta de error al cliente
      res.status(500).json({ error: 'Error al obtener los productos', details: err.message });
      return;
    }
    // Si la consulta es exitosa, envía los resultados al cliente
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});