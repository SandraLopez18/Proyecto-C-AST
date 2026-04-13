const mongoose = require('mongoose');
const Camiseta = require('./modelo/camiseta');
const Compra = require('./modelo/compra');

function buildFiltroArticulos(query) {
  const filtro = {};

  if (query.id) {
    if (!mongoose.Types.ObjectId.isValid(query.id)) {
      throw new Error('ID_INVALIDO');
    }
    filtro._id = query.id;
  }

  if (query.nombre) {
    filtro.nombre = { $regex: query.nombre, $options: 'i' };
  }

  if (query.color) {
    filtro.color = query.color;
  }

  if (query.disponible) {
    filtro.disponible = query.disponible;
  }

  return filtro;
}

function buildFiltroCompras(query, userId) {
  const filtro = {
    clienteId: userId
  };

  if (query.id) {
    if (!mongoose.Types.ObjectId.isValid(query.id)) {
      throw new Error('ID_COMPRA_INVALIDO');
    }
    filtro._id = query.id;
  }

  if (query.articuloId) {
    if (!mongoose.Types.ObjectId.isValid(query.articuloId)) {
      throw new Error('ID_ARTICULO_INVALIDO');
    }
    filtro.articuloId = query.articuloId;
  }

  if (query.nombreComprador) {
    filtro.nombreComprador = { $regex: query.nombreComprador, $options: 'i' };
  }

  return filtro;
}

exports.getArticulos = async function(req, res) {
  try {
    const filtro = buildFiltroArticulos(req.query);
    const articulos = await Camiseta.find(filtro).sort({ createdAt: -1 });
    return res.status(200).json(articulos);
  } catch (error) {
    console.error('ERROR getArticulos:', error);

    if (error.message === 'ID_INVALIDO') {
      return res.status(400).json({ error: 'ID de artículo inválido.' });
    }

    return res.status(500).json({ error: 'Error al consultar artículos.' });
  }
};

exports.createCompra = async function(req, res) {
  try {
    const { articuloId, cantidad, nombreComprador, direccionEnvio } = req.body;
    const clienteId = req.userId;

    if (!articuloId || !cantidad || !nombreComprador || !direccionEnvio) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    if (!mongoose.Types.ObjectId.isValid(articuloId)) {
      return res.status(400).json({ error: 'ID de artículo inválido.' });
    }

    const cantidadNumerica = Number(cantidad);

    if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un entero mayor que 0.' });
    }

    const articulo = await Camiseta.findById(articuloId);

    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado.' });
    }

    if (articulo.cantidad < cantidadNumerica) {
      return res.status(400).json({ error: 'Stock insuficiente.' });
    }

    articulo.cantidad = articulo.cantidad - cantidadNumerica;
    articulo.disponible = articulo.cantidad > 0 ? 'SI' : 'NO';
    await articulo.save();

    const compra = new Compra({
      articuloId: articulo._id,
      clienteId: clienteId,
      cantidad: cantidadNumerica,
      nombreComprador: nombreComprador,
      direccionEnvio: direccionEnvio,
      precioUnitario: articulo.precio,
      precioTotal: articulo.precio * cantidadNumerica
    });

    await compra.save();

    return res.status(201).json({
      mensaje: 'Compra realizada correctamente.',
      compraId: compra._id,
      compra: compra
    });
  } catch (error) {
    console.error('ERROR createCompra:', error);
    return res.status(500).json({
      error: 'Error al crear la compra.',
      detalle: error.message
    });
  }
};

exports.getCompras = async function(req, res) {
  try {
    const filtro = buildFiltroCompras(req.query, req.userId);

    const compras = await Compra.find(filtro)
      .populate('articuloId')
      .sort({ createdAt: -1 });

    return res.status(200).json(compras);
  } catch (error) {
    console.error('ERROR getCompras:', error);

    if (error.message === 'ID_COMPRA_INVALIDO' || error.message === 'ID_ARTICULO_INVALIDO') {
      return res.status(400).json({ error: 'Algún ID enviado no es válido.' });
    }

    return res.status(500).json({ error: 'Error al consultar compras.' });
  }
};

exports.updateCompra = async function(req, res) {
  try {
    const compraId = req.params.id;
    const clienteId = req.userId;
    const { nombreComprador, direccionEnvio } = req.body;

    if (!mongoose.Types.ObjectId.isValid(compraId)) {
      return res.status(400).json({ error: 'ID de compra inválido.' });
    }

    if (!nombreComprador || !direccionEnvio) {
      return res.status(400).json({ error: 'Nombre y dirección son obligatorios.' });
    }

    const compraActualizada = await Compra.findOneAndUpdate(
      { _id: compraId, clienteId: clienteId },
      {
        nombreComprador: nombreComprador,
        direccionEnvio: direccionEnvio
      },
      { new: true }
    ).populate('articuloId');

    if (!compraActualizada) {
      return res.status(404).json({ error: 'Compra no encontrada para este cliente.' });
    }

    return res.status(200).json({
      mensaje: 'Compra modificada correctamente.',
      compra: compraActualizada
    });
  } catch (error) {
    console.error('ERROR updateCompra:', error);
    return res.status(500).json({ error: 'Error al modificar compra.' });
  }
};

exports.deleteCompra = async function(req, res) {
  try {
    const compraId = req.params.id;
    const clienteId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(compraId)) {
      return res.status(400).json({ error: 'ID de compra inválido.' });
    }

    const compra = await Compra.findOne({
      _id: compraId,
      clienteId: clienteId
    });

    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada para este cliente.' });
    }

    const articulo = await Camiseta.findById(compra.articuloId);

    if (!articulo) {
      return res.status(404).json({ error: 'El artículo asociado ya no existe.' });
    }

    articulo.cantidad = articulo.cantidad + compra.cantidad;
    articulo.disponible = articulo.cantidad > 0 ? 'SI' : 'NO';
    await articulo.save();

    await Compra.deleteOne({ _id: compra._id });

    return res.status(200).json({
      mensaje: 'Compra eliminada correctamente y stock restaurado.'
    });
  } catch (error) {
    console.error('ERROR deleteCompra:', error);
    return res.status(500).json({ error: 'Error al eliminar compra.' });
  }
};