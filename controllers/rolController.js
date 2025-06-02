import Rol from '../models/Role.js';

// Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los roles', error: error.message });
  }
};

// Crear un nuevo rol
export const crearRol = async (req, res) => {
  const { nombre } = req.body;
  try {
    const rolExistente = await Rol.findOne({ where: { nombre } });
    if (rolExistente) {
      return res.status(400).json({ mensaje: 'El rol ya existe' });
    }
    const nuevoRol = await Rol.create({ nombre });
    res.status(201).json(nuevoRol);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el rol', error: error.message });
  }
};

// Actualizar un rol
export const actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }
    await rol.update({ nombre });
    res.json(rol);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el rol', error: error.message });
  }
};

// Eliminar un rol (soft delete si tienes paranoid: true, sino borrado físico)
export const eliminarRol = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }
    await rol.destroy();
    res.json({ mensaje: 'Rol eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el rol', error: error.message });
  }
};

// Obtener un rol por ID
export const obtenerRolPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el rol', error: error.message });
  }
};