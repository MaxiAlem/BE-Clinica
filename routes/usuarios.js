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

usuarioRouter.post('/', crearUsuario);
usuarioRouter.get('/',verificarToken,autorizarRol(['secretario', 'admin']), obtenerUsuarios);
usuarioRouter.get('/:id', verificarToken, obtenerUsuarioPorId);
usuarioRouter.put('/:id', verificarToken, actualizarUsuario);
usuarioRouter.delete('/:id', verificarToken, eliminarUsuario);

export default usuarioRouter;
