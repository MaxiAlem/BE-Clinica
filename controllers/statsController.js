import { fetchPacientesPorEspecialidad, fetchPacientesPorProfesional, fetchTopObrasSociales } from '../services/statsServices.js';

export const getPacientesPorEspecialidad = async (req, res) => {
  try {
    const data = await fetchPacientesPorEspecialidad();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};
export const getPacientesPorProfesional = async (req, res) => {
  try {
    const data = await fetchPacientesPorProfesional();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};
export const getTopObrasSociales = async (req, res) => {
  try {
    const data = await fetchTopObrasSociales();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};

