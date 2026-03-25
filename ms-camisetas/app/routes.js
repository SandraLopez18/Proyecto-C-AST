const path = require('path');
const Controller = require('./controller');
const requireAdmin = require('./adminMiddleware');

module.exports = function(app) {
  app.get('/api/camisetas', requireAdmin, Controller.getCamiseta);
  app.get('/api/camisetas/:id', requireAdmin, Controller.getCamisetaById);
  app.post('/api/camisetas', requireAdmin, Controller.setCamiseta);
  app.put('/api/camisetas/:id', requireAdmin, Controller.updateCamiseta);
  app.delete('/api/camisetas/:id', requireAdmin, Controller.removeCamiseta);

  app.use('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'angular', 'index.html'));
  });
};