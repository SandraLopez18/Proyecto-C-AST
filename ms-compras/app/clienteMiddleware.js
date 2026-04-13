const { obtenerRolUsuario } = require('./auth');

async function requireCliente(req, res, next) {
  try {
    const userId = (req.query.userId || req.body.userId || req.headers['x-user-id'] || '').trim();

    if (!userId) {
      return res.status(400).json({ error: 'Debe enviarse el ID del usuario.' });
    }

    const rol = await obtenerRolUsuario(userId);

    if (!rol) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (rol !== 'cliente') {
      return res.status(403).json({ error: 'Acceso denegado. Solo clientes.' });
    }

    req.userId = userId;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error comprobando permisos.' });
  }
}

module.exports = requireCliente;
