const { default: mongoose } = require('mongoose');
const Usuario = require('./modelo/usuario');

// Crear usuario
exports.createUsuario = async (req, res) => {
  try {
    const { rol } = req.body;

    if (!rol) {
      return res.status(400).json({ error: 'Rol es obligatorio.' });
    }

    const usuario = await Usuario.create({ rol });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario.' });
  }
};

// Obtener usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const { rol } = req.query;
    const filtro = {};

    if (rol) {
      filtro.rol = rol;
    }

    const usuarios = await Usuario.find(filtro);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
};

// Obtener rol de un usuario
exports.getRolUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      _id: usuario._id,
      rol: usuario.rol
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rol del usuario.' });
  }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de usuario no válido.' });
    }

    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario.' });
  }
};