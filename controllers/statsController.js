import { fetchPacientesPorEspecialidad, fetchPacientesPorMes, fetchPacientesPorProfesional, fetchPorcentajeCancelados, fetchTendenciaTurnos, fetchTopObrasSociales } from '../services/statsServices.js';

export const getPacientesPorEspecialidad = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchPacientesPorEspecialidad({ startDate, endDate });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};
export const getPacientesPorProfesional = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchPacientesPorProfesional({ startDate, endDate });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};
export const getTopObrasSociales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchTopObrasSociales({ startDate, endDate });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};

export const getTendenciaTurnos = async (req, res) => {
  try {
    const data = await fetchTendenciaTurnos();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};
export const getPacientesPorMes = async (req, res) => {
  try {
    const data = await fetchPacientesPorMes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};
export const getPorcentajeCancelados = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchPorcentajeCancelados({ startDate, endDate });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};

