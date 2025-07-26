import { Router } from 'express';
import {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/auth.js';
import autorizarRol from '../middleware/autorizarRol.js';

const usuarioRouter = Router();

// Solo admin y secretario pueden crear usuarios
usuarioRouter.post('/') //verificarToken, autorizarRol('secretario', 'admin'), crearUsuario);

// Solo admin y secretario pueden ver todos los usuarios
usuarioRouter.get('/', verificarToken, autorizarRol('secretario', 'admin'), obtenerUsuarios);

// Cualquier usuario autenticado puede ver un usuario por id (ajusta según necesidad)
usuarioRouter.get('/:id', verificarToken, obtenerUsuarioPorId);

// Solo admin y secretario pueden modificar/eliminar usuarios
usuarioRouter.put('/:id', verificarToken, autorizarRol('secretario', 'admin'), actualizarUsuario);
usuarioRouter.delete('/:id', verificarToken, autorizarRol('secretario', 'admin'), eliminarUsuario);

export default usuarioRouter;