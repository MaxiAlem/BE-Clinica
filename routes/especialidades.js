
import express from 'express';

import {
  crearEspecialidad,
  obtenerEspecialidades,
  obtenerEspecialidadPorId,
  actualizarEspecialidad,
  eliminarEspecialidad,
} from '../controllers/especialidadController.js'



const especialidadRouter = express.Router();

// Crear nueva obra social
especialidadRouter.post('/', crearEspecialidad);

// Obtener todas las obras sociales
especialidadRouter.get('/',  obtenerEspecialidades);

// Obtener una obra social por ID
especialidadRouter.get('/:id',   obtenerEspecialidadPorId);

// Actualizar una obra social por ID
especialidadRouter.put('/:id', actualizarEspecialidad);

// Eliminar (soft delete) una obra social por ID
especialidadRouter.delete('/:id', eliminarEspecialidad);

export default especialidadRouter;
