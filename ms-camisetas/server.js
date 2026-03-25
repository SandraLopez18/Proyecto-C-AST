const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3002;

// Evita petición de favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride());

// Archivos estáticos (Angular)
app.use(express.static(path.join(__dirname, 'frontend')));

// Mongo
mongoose.connect('mongodb://localhost:27017/tiendaBD')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(port, () => {
    console.log(`ms-camisetas ejecutándose en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
  });

// Rutas
require('./app/routes.js')(app);

// Servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});