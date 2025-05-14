import express from 'express';
const router = express.Router();

// Ruta para obtener todos los turnos
router.get('/', (req, res) => {
  res.json({ message: 'Aquí se listan todos los turnos' });
});

// Ruta para crear un nuevo turno
router.post('/', (req, res) => {
  res.json({ message: 'Nuevo turno creado' });
});

export default router;
