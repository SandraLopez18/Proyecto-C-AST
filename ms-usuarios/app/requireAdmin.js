const mongoose = require('mongoose');
const Usuario = require('./modelo/usuario');

async function requireAdmin(req, res, next) {
  try {
    const userId = (req.query.userId || req.body.userId || req.headers['x-user-id'] || '').trim();

    if (!userId) {
      return res.status(400).json({ error: 'Debe enviarse el ID del administrador.' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido.' });
    }

    const usuario = await Usuario.findById(userId).lean();

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error('ERROR requireAdmin:', error);
    return res.status(500).json({ error: 'Error comprobando permisos.' });
  }
}

module.exports = requireAdmin;