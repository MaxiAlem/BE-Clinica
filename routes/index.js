import express from 'express';
import usuarioRouter from './usuarios.js';
import profesionalRouter from './profesionales.js';
import pacienteRouter from './pacientes.js';
import turnoRouter from './turnos.js';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Rutas principales
router.get('/', (req, res) => {
  res.send('Bienvenido a la API');
});
router.post('/login', login);
// Usar rutas modulares
router.use('/usuarios', usuarioRouter);
router.use('/profesionales', profesionalRouter);
router.use('/pacientes', pacienteRouter)
router.use('/turnos', turnoRouter)


export default router;