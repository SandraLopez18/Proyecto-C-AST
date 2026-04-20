const controller = require('./controller');
const requireAdmin = require('./requireAdmin');

module.exports = function(app) {
  app.post('/api/usuarios', controller.createUsuario);
  app.get('/api/usuarios', requireAdmin, controller.getUsuarios);
  app.get('/api/usuarios/:id/rol', controller.getRolUsuario);
  app.delete('/api/usuarios/:id', controller.deleteUsuario);
};