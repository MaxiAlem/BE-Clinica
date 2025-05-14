import { Router } from 'express';
import {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/auth.js';

const usuarioRouter = Router();

usuarioRouter.post('/', crearUsuario);
usuarioRouter.get('/',verificarToken, obtenerUsuarios);
usuarioRouter.get('/:id', verificarToken, obtenerUsuarioPorId);
usuarioRouter.put('/:id', verificarToken, actualizarUsuario);
usuarioRouter.delete('/:id', verificarToken, eliminarUsuario);

export default usuarioRouter;
