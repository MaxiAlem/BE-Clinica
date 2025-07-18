import express from 'express';
import {  crearObraSocial,
    obtenerObrasSociales,
    obtenerObraSocialPorId,
    actualizarObraSocial,
    eliminarObraSocial,} from '../controllers/obraSocialController.js';

const obraSocialRouter = express.Router();

obraSocialRouter.post('/', crearObraSocial);
obraSocialRouter.get('/', obtenerObrasSociales);
obraSocialRouter.get('/:id', obtenerObraSocialPorId);
obraSocialRouter.put('/:id', actualizarObraSocial);
obraSocialRouter.delete('/:id', eliminarObraSocial);

export default obraSocialRouter;
