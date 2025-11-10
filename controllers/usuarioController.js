import Usuario from '../models/Usuario.js';
import Rol from '../models/Role.js';
import Profesional from '../models/Profesional.js';
import bcrypt from 'bcrypt';

// Helper DRY para el tenant
const tenantScope = (req) => ({ organizacionId: req.organizacionId });

// Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  try {
    const { usuario, password, rolId, profesionales } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { usuario, ...tenantScope(req) } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({
      usuario,
      password: hashedPassword,
      rolId,
      organizacionId: req.organizacionId, // 💥 asignación tenant
    });

    if (profesionales && profesionales.length > 0) {
      await nuevoUsuario.setProfesionales(profesionales);
    }

    const usuarioCompleto = await Usuario.findByPk(nuevoUsuario.id, {
      include: [
        { model: Rol, as: 'rol' },
        { model: Profesional, as: 'profesional' }
      ]
    });

    res.status(201).json(usuarioCompleto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el usuario' });
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: tenantScope(req),
      include: [
        { model: Rol, as: 'rol' },
        { model: Profesional, as: 'profesionales' }
      ]
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message });
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findOne({
      where: { id, ...tenantScope(req) },
      include: [
        { model: Rol, as: 'rol' },
        { model: Profesional, as: 'profesional' }
      ]
    });

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario' });
  }
};

// Actualizar un usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, password, rolId, profesionales } = req.body;

    const user = await Usuario.findOne({ where: { id, ...tenantScope(req) } });
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const updatedData = {};
    if (usuario !== undefined) updatedData.usuario = usuario;
    if (rolId !== undefined) updatedData.rolId = rolId;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    await user.update(updatedData);

    if (profesionales) {
      await user.setProfesionales(profesionales);
    }

    const usuarioCompleto = await Usuario.findByPk(user.id, {
      include: [
        { model: Rol, as: 'rol' },
        { model: Profesional, as: 'profesional' }
      ]
    });

    res.json(usuarioCompleto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findOne({ where: { id, ...tenantScope(req) } });

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
  }
};
