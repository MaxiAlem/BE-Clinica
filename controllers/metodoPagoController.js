import MetodoPago from '../models/MetodoPago.js';

// @desc    Obtener todos los métodos de pago
// @route   GET /api/metodos-pago
// @access  Privado/Admin
const obtenerMetodosPago = async (req, res) => {
  try {
    const metodos = await MetodoPago.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });
    res.json(metodos);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// @desc    Crear un nuevo método de pago
// @route   POST /api/metodos-pago
// @access  Privado/Admin
const crearMetodoPago = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    // Validación básica
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Verificar si ya existe
    const metodoExistente = await MetodoPago.findOne({ where: { nombre } });
    if (metodoExistente) {
      return res.status(400).json({ error: 'Este método de pago ya existe' });
    }

    const metodo = await MetodoPago.create({
      nombre,
      descripcion: descripcion || null,
      activo: true
    });

    res.status(201).json(metodo);
  } catch (error) {
    console.error('Error al crear método de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// @desc    Actualizar un método de pago
// @route   PUT /api/metodos-pago/:id
// @access  Privado/Admin
const actualizarMetodoPago = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, activo } = req.body;

  try {
    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) {
      return res.status(404).json({ error: 'Método de pago no encontrado' });
    }

    // Validar nombre único (si se está modificando)
    if (nombre && nombre !== metodo.nombre) {
      const metodoExistente = await MetodoPago.findOne({ where: { nombre } });
      if (metodoExistente) {
        return res.status(400).json({ error: 'Este nombre ya está en uso' });
      }
    }

    await metodo.update({
      nombre: nombre || metodo.nombre,
      descripcion: descripcion || metodo.descripcion,
      activo: activo !== undefined ? activo : metodo.activo
    });

    res.json(metodo);
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// @desc    Eliminar (desactivar) un método de pago
// @route   DELETE /api/metodos-pago/:id
// @access  Privado/Admin
const eliminarMetodoPago = async (req, res) => {
  const { id } = req.params;

  try {
    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) {
      return res.status(404).json({ error: 'Método de pago no encontrado' });
    }

    // Borrado lógico (cambiar a activo: false)
    await metodo.update({ activo: false });

    res.json({ mensaje: 'Método de pago desactivado correctamente' });
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export {
  obtenerMetodosPago,
  crearMetodoPago,
  actualizarMetodoPago,
  eliminarMetodoPago
};