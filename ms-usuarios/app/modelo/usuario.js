const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  /**
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  **/
  rol: {
    type: String,
    enum: ['admin', 'cliente'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios');