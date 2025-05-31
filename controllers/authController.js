import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Rol from '../models/Role.js';

export const login = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const user = await Usuario.findOne({
      where: { usuario }, include: [{ model: Rol, as: 'rol' }]
    });
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password, user.password);
    if (!passwordValido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol.nombre },//crea un JWT que contiene el id y el rol
      process.env.JWT_SECRET,
      { expiresIn: '100h' } // o el tiempo que quieras
    );

    res.json({ token, usuario: user.usuario, rol: user.rol.nombre });
  } catch (error) {
    console.error('ERROR EN LOGIN', error);  // <-- importante
    res.status(500).json({ mensaje: 'Error en el login' });
  }
};
