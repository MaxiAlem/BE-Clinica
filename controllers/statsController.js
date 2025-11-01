import { 
  fetchPacientesPorEspecialidad, 
  fetchPacientesPorMes, 
  fetchPacientesPorProfesional, 
  fetchPorcentajeCancelados, 
  fetchTendenciaTurnos, 
  fetchTopObrasSociales,
  fetchPacientesPorObraSocialYProfesional
} from '../services/statsServices.js';

export const getPacientesPorEspecialidad = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchPacientesPorEspecialidad({ startDate, endDate, organizacionId: req.user.organizacionId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};

export const getPacientesPorProfesional = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchPacientesPorProfesional({ startDate, endDate, organizacionId: req.user.organizacionId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};

export const getTopObrasSociales = async (req, res) => {
  try {
    const { startDate, endDate, obrasSociales } = req.query;
    const { organizacionId } = req.user;

    const obrasArray = obrasSociales ? obrasSociales.split(',') : [];

    const data = await fetchTopObrasSociales({
      startDate,
      endDate,
      organizacionId,
      obrasSociales: obrasArray,
    });

    res.json(data);
  } catch (error) {
    console.error('Error obteniendo top obras sociales:', error);
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};

export const getPacientesPorObraSocialYProfesional = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchPacientesPorObraSocialYProfesional({
      startDate,
      endDate,
      organizacionId: req.user.organizacionId,
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo datos de pacientes' });
  }
};

export const getTendenciaTurnos = async (req, res) => {
  try {
    const data = await fetchTendenciaTurnos({ organizacionId: req.user.organizacionId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};

export const getPacientesPorMes = async (req, res) => {
  try {
    const data = await fetchPacientesPorMes({ organizacionId: req.user.organizacionId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};

export const getPorcentajeCancelados = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchPorcentajeCancelados({ startDate, endDate, organizacionId: req.user.organizacionId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
};
