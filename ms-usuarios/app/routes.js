const controller = require('./controller');

module.exports = function(app) {
  app.post('/api/usuarios', controller.createUsuario);
  app.get('/api/usuarios', controller.getUsuarios);
  app.get('/api/usuarios/:id/rol', controller.getRolUsuario);
  app.delete('/api/usuarios/:id', controller.deleteUsuario);
};