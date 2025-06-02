import express from 'express';
import usuarioRouter from './usuarios.js';
import profesionalRouter from './profesionales.js';
import pacienteRouter from './pacientes.js';
import turnoRouter from './turnos.js';
import obraSocialRouter from './obraSocial.js';
import especialidadRouter from './especialidades.js';
import metodoPagorouter from './metodosPago.js';
import rolRouter from './rol.js';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Rutas principales
router.get('/', (req, res) => {
  res.send('Bienvenido a la API');
});
router.post('/login', login);
// Usar rutas modulares
router.use('/usuarios', usuarioRouter);

router.use('/metodos-pago', metodoPagorouter)
router.use('/profesionales', profesionalRouter);
router.use('/pacientes', pacienteRouter)
router.use('/turnos', turnoRouter);
router.use('/obras-sociales', obraSocialRouter);
router.use('/especialidad', especialidadRouter)
router.use('/roles', rolRouter)


export default router;