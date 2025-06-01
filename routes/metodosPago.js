import express from 'express';
import {
  obtenerMetodosPago,
  crearMetodoPago,
  actualizarMetodoPago,
  eliminarMetodoPago
} from '../controllers/metodoPagoController.js';


const metodoPagorouter = express.Router();

metodoPagorouter.get('/', obtenerMetodosPago);
metodoPagorouter.post('/', crearMetodoPago);
metodoPagorouter.put('/:id',  actualizarMetodoPago);
metodoPagorouter.delete('/:id', eliminarMetodoPago);

export default metodoPagorouter;