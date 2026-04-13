const mongoose = require('mongoose');

const CamisetaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    modelo: {
      type: String,
      enum: ['BASICA', 'OVERSIZE', 'POLO'],
      required: true
    },
    color: {
      type: String,
      enum: ['NEGRO', 'BLANCO', 'ROJO', 'AZUL', 'VERDE'],
      required: true
    },
    material: {
      type: String,
      enum: ['ALGODON', 'POLIESTER', 'SEDA'],
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0
    },
    precio: {
      type: Number,
      required: true,
      min: 0
    },
    disponible: {
      type: String,
      enum: ['SI', 'NO'],
      default: 'SI'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Camiseta', CamisetaSchema, 'camisetas');