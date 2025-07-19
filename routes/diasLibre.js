import express from 'express';
import {
    crearDiaLibre,
    getTodosDiasLibres, 
    eliminarDiaLibre,
    actualizarDiaLibre
} from '../controllers/diasLibreController.js';

const diasLibreRouter = express.Router();

diasLibreRouter.post('/', crearDiaLibre);
diasLibreRouter.get('/', getTodosDiasLibres);
diasLibreRouter.delete('/:id', eliminarDiaLibre);  
diasLibreRouter.put('/:id', actualizarDiaLibre); 
export default diasLibreRouter;
