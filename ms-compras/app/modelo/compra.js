const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema(
  {
    articuloId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camiseta',
      required: true
    },
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    nombreComprador: {
      type: String,
      required: true,
      trim: true
    },
    direccionEnvio: {
      type: String,
      required: true,
      trim: true
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    },
    precioTotal: {
      type: Number,
      required: true,
      min: 0
    },
    fechaEnvio: {
      type: Date,
      default: null
      //required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Compra', CompraSchema, 'compras');