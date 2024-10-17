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
  const query = 'SELECT * FROM Producto';

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

// Ruta para insertar una nueva orden
app.post('/api/ordenNueva', (req, res) => {
  const {cid, coid, estado, precioTotal } = req.body; // Ensure these fields are being sent

  if (!cid || !coid || !estado || !precioTotal) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query = "INSERT INTO Orden (cid, coid, estado, precioTotal) VALUES (?, ?, ?, ?)";
  const values = [cid, coid, estado, precioTotal];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al insertar la orden:', err);
      res.status(500).json({ error: 'Error al insertar la orden', details: err.message });
      return;
    }
    res.status(201).json({ message: 'Orden insertada exitosamente', orderId: result.insertId });
  });
});

// Ruta para obtener las ordenes
app.post('/api/orden', (req, res) => {
  const { userId, estado } = req.body;

  const query = "SELECT * FROM orden WHERE cid = ? AND estado = ?";
  connection.query(query, [userId, estado], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    if (results.length > 0) {
      // Mapeamos los resultados para obtener tanto los IDs de las órdenes como los coid
      const orderData = results.map(order => ({
        oid: order.oid, // ID de la orden
        coid: order.coid // ID del courier
      }));

      res.status(200).json({
        orderData: orderData // Enviamos un array de objetos con oid y coid
      });
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });
});

// Ruta para obtener los datos del courier
app.post('/api/courier', (req, res) => {
  const { coid } = req.body;

  const query = "SELECT * FROM courier WHERE coid = ?";
  connection.query(query, [coid], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send('No se encontró el courier');
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
        id: results[0].cid,
        usuario: results[0].usuario,
        nombre: results[0].nombre
      });
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });
});

// Ruta para obtener todos los couriers
app.get('/api/couriers', (req, res) => {
  const query = 'SELECT * FROM Courier';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      res.status(500).json({ error: 'Error al obtener los couriers', details: err.message });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener todas las tarjetas
app.get('/api/tarjetas', (req, res) => {
  const query = 'SELECT * FROM Tarjeta';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      res.status(500).json({ error: 'Error al obtener las tarjetas', details: err.message });
      return;
    }
    res.json(results);
  });
});

// Ruta para agregar un nuevo producto
app.post('/api/addProduct', (req, res) => {
    const { nombre, precio, existencia, categoria, descripcion, imagen } = req.body;
    const values = [nombre, precio, existencia, categoria, descripcion, imagen];

    connection.query("INSERT INTO Producto (nombre, precio, existencia, categoria, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?)", values, (err, result) => {
        if (err) {
            console.error('Error al agregar el producto:', err);
            return res.status(500).json({ message: 'Error al agregar el producto' }); // Cambiado a JSON
        }
        res.status(201).json({ message: 'Producto agregado exitosamente', pid: result.insertId }); // Cambiado a JSON
    });
});


// Ruta para eliminar un producto por nombre
app.delete('/api/deleteProduct', (req, res) => {
  const { nombre } = req.body; // Obtener el nombre del producto del cuerpo de la solicitud

  // Primero, buscamos el producto por nombre
  connection.query("SELECT pid FROM Producto WHERE nombre = ?", [nombre], (err, results) => {
    if (err) {
      console.error('Error al buscar el producto:', err);
      return res.status(500).json({ error: 'Error al buscar el producto', details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    const pid = results[0].pid; // Obtenemos el pid del producto encontrado

    // Ahora eliminamos el producto usando el pid
    connection.query("DELETE FROM Producto WHERE pid = ?", [pid], (err, result) => {
      if (err) {
        console.error('Error al eliminar el producto:', err);
        return res.status(500).json({ error: 'Error al eliminar el producto', details: err.message });
      }
      if (result.affectedRows > 0) {
        res.status(200).send('Producto eliminado exitosamente');
      } else {
        res.status(404).send('Producto no encontrado');
      }
    });
  });
});


// Ruta para actualizar un producto
app.put('/api/updateProduct', (req, res) => {
  const { pid, nombre, precio, existencia, descripcion } = req.body;

  const updateQuery = "UPDATE Producto SET nombre = ?, precio = ?, existencia = ?, descripcion = ? WHERE pid = ?";
  const values = [nombre, precio, existencia, descripcion, pid];

  connection.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error('Error al editar el producto:', err);
      return res.status(500).json({ error: 'Error al editar el producto', details: err.message });
    }
    if (result.affectedRows > 0) {
      res.status(200).send('Producto editado exitosamente');
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
