const path = require('path');
const Controller = require('./controller');
const requireCliente = require('./clienteMiddleware');

module.exports = function(app) {
  app.get('/api/articulos', requireCliente, Controller.getArticulos);
  app.post('/api/compras', requireCliente, Controller.createCompra);
  app.get('/api/compras', requireCliente, Controller.getCompras);
  app.put('/api/compras/:id', requireCliente, Controller.updateCompra);
  app.delete('/api/compras/:id', requireCliente, Controller.deleteCompra);

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  });

  app.get('/cliente', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  });
};