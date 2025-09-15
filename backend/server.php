const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

// Conectar a MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api/games', require('./routes/games'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
