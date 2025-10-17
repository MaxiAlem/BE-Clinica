import MetodoPago from '../models/MetodoPago.js';

// Helper DRY para el tenant
const tenantScope = (req) => ({ organizacionId: req.user.organizacionId });

/**
 * Obtener todos los métodos de pago activos de una organización
 */
export const obtenerMetodosPago = async (req, res) => {
  try {


    const metodos = await MetodoPago.findAll({
      where: { activo: true, organizacionId: req.organizacionId  },
      order: [['nombre', 'ASC']]
    });

    res.status(200).json(metodos);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

/**
 * Crear un nuevo método de pago para una organización
 */
export const crearMetodoPago = async (req, res) => {
  try {
    const { nombre, descripcion, organizacionId } = req.body;

    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });


    // Validar nombre único por organización
    const existente = await MetodoPago.findOne({ where: { nombre, organizacionId: req.organizacionId } });
    if (existente) return res.status(400).json({ error: 'Este método de pago ya existe en la organización' });

    const metodo = await MetodoPago.create({
      nombre,
      descripcion: descripcion || null,
      activo: true,
      organizacionId
    });

    res.status(201).json(metodo);
  } catch (error) {
    console.error('Error al crear método de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

/**
 * Actualizar un método de pago
 */
export const actualizarMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo, organizacionId } = req.body;

    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) return res.status(404).json({ error: 'Método de pago no encontrado' });

    // Validar nombre único por organización si se cambia
    if (nombre && nombre !== metodo.nombre) {
      const existente = await MetodoPago.findOne({ where: { nombre, organizacionId: metodo.organizacionId,tenantScope } });
      if (existente) return res.status(400).json({ error: 'Este nombre ya está en uso en la organización' });
    }

    await metodo.update({
      nombre: nombre || metodo.nombre,
      descripcion: descripcion || metodo.descripcion,
      activo: activo !== undefined ? activo : metodo.activo
    });

    res.status(200).json(metodo);
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

/**
 * Desactivar un método de pago
 */
export const eliminarMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;

    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) return res.status(404).json({ error: 'Método de pago no encontrado' });

    await metodo.update({ activo: false });

    res.status(200).json({ mensaje: 'Método de pago desactivado correctamente' });
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};
