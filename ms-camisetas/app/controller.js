const Camiseta = require('./modelo/camiseta');

// Obtener camisetas
exports.getCamiseta = async function (req, res) {
  try {
    const { id, nombre, modelo, color, material, disponible } = req.query;

    // Búsqueda por ID interno
    if (id) {
      const camiseta = await Camiseta.findById(id).lean();

      if (!camiseta) {
        return res.status(404).json({ error: 'Camiseta no encontrada' });
      }

      return res.status(200).json([camiseta]);
    }

    // Búsqueda por otras características
    const filtro = {};

    if (nombre) filtro.nombre = new RegExp(nombre, 'i'); // búsqueda flexible
    if (modelo) filtro.modelo = modelo;
    if (color) filtro.color = color;
    if (material) filtro.material = material;
    if (disponible) filtro.disponible = disponible;

    if (!nombre && !modelo && !color && !material && !disponible) {
      filtro.disponible = 'SI';
    }


    let query = Camiseta.find(filtro);

    const camisetas = await query.lean();
    res.status(200).json(camisetas);

  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    res.status(500).send(error);
  }
};



// Obtener camiseta por ID
exports.getCamisetaById = async function (req, res) {
  try {
    const camiseta = await Camiseta.findById(req.params.id).lean();

    if (!camiseta) {
      return res.status(404).json({ error: 'Camiseta no encontrada' });
    }

    res.status(200).json(camiseta);
  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    res.status(500).send(error);
  }
};

// Crear camiseta
exports.setCamiseta = async function (req, res) {
  try {
    const nuevaCamiseta = await Camiseta.create({
      nombre: req.body.nombre,
      modelo: req.body.modelo,
      color: req.body.color,
      material: req.body.material,
      cantidad: req.body.cantidad,
      precio: req.body.precio,
      disponible: req.body.disponible
    });

    res.status(201).json(nuevaCamiseta);

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// Modificar camiseta
exports.updateCamiseta = async function (req, res) {
  try {
    const { nombre, modelo, color, material, cantidad, precio, disponible } = req.body;

    if (
      nombre === undefined ||
      modelo === undefined ||
      color === undefined ||
      material === undefined ||
      cantidad === undefined ||
      precio === undefined ||
      disponible === undefined
    ) {
      return res.status(400).json({
        error: 'En una petición PUT deben enviarse todos los campos del recurso.'
      });
    }

    const camisetaActualizada = await Camiseta.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        modelo,
        color,
        material,
        cantidad,
        precio,
        disponible
      },
      {
        runValidators: true,
        new: true
      }
    );

    if (!camisetaActualizada) {
      return res.status(404).json({ error: 'Camiseta no encontrada' });
    }

    res.status(200).json(camisetaActualizada);

  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    res.status(500).send(error);
  }
};

// Eliminar camiseta
exports.removeCamiseta = async function (req, res) {
  try {
    const deleted = await Camiseta.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Camiseta no encontrada' });
    }

    res.status(200).json(deleted);

  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    res.status(500).send(error);
  }
};
