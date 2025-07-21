import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Rol from '../models/Role.js';
import Profesional from '../models/Profesional.js';

export const login = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const user = await Usuario.findOne({
      where: { usuario }, 
      include: [{ model: Rol, as: 'rol' }]
    });
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password, user.password);
    if (!passwordValido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol.nombre }, // crea un JWT que contiene el id y el rol
      process.env.JWT_SECRET,
      { expiresIn: '100h' }
    );

    res.cookie('token', token, {
      httpOnly: true,   
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 100 * 60 * 60 * 1000 // 100 horas en ms 
    });

    // *** Solo una respuesta ***
    res.status(200).json({ 
      usuario: user.usuario, 
      rol: user.rol.nombre,
      mensaje: 'Login exitoso'
    });
    // No pongas nada más después de esto
  } catch (error) {
    console.error('ERROR EN LOGIN', error);
    res.status(500).json({ mensaje: 'Error en el login' });
  }
};

// /ME
export const me = async (req, res) => {
  try {
    const { id } = req.user;

    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Rol, as: 'rol' },
      { model: Profesional, as: 'profesionales' }]
    });

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    // Nunca envíes el password
    const { password, ...usuarioSafe } = usuario.toJSON();

    res.json(usuarioSafe);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario actual', error: error.message });
  }
};