const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'proyectocc6',
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
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

// Ruta para obtener un producto específico
app.get('/api/productos/:categoria/:pid', (req, res) => {
  const { categoria, pid } = req.params;
  const query = 'SELECT * FROM producto WHERE categoria = ? AND pid = ?';
  
  connection.query(query, [categoria, pid], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      res.status(500).json({ error: 'Error al obtener el producto' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(results[0]);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
