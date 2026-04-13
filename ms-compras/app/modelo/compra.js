const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema({
    camisetaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Camiseta'
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
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
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    fechaCompra: {
        type: Date,
        default: Date.now
    }
    /**
    precioUnitario: {
        type: Number,
        required: true,
        min: 0
    },
    precioTotal: {
        type: Number,
        required: true,
        min: 0
    }
    **/ 
}, {
    timestamps: true,
});

module.exports = mongoose.model('Compra', CompraSchema, 'compras');