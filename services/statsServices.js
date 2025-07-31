//import db from '../db.js'; // o como tengas instanciado tu pool/conexion
import sequelize from '../config/db.js';

export const fetchPacientesPorEspecialidad = async () => {
  const query = `
  SELECT 
  e.nombre AS especialidad,
  COUNT(t.id) AS cantidad_turnos
FROM turnos t
JOIN profesionales p ON t.profesionalId = p.id
JOIN profesional_especialidades pe ON pe.profesionalId = p.id
JOIN especialidades e ON e.id = pe.especialidadId
GROUP BY e.id, e.nombre
ORDER BY cantidad_turnos DESC;

  `;

  const result = await sequelize.query(query);
  return result[0];
};




export const fetchPacientesPorProfesional = async () => {
  const query = `
  SELECT 
  CONCAT(p.nombre, ' ', p.apellido) AS profesional,
  COUNT(t.id) AS cantidad_turnos
FROM turnos t
JOIN profesionales p ON t.profesionalId = p.id
GROUP BY p.id, p.nombre, p.apellido
ORDER BY cantidad_turnos DESC;

  `;

  const result = await sequelize.query(query);
  return result[0];
};
export const fetchTopObrasSociales= async () => {
  const query = `
  SELECT 
  o.nombre AS obra_social,
  COUNT(t.id) AS cantidad_turnos
FROM turnos t
JOIN obras_sociales o ON t.obraSocialId = o.id
GROUP BY o.id, o.nombre
ORDER BY cantidad_turnos DESC
LIMIT 5;

  `;

  const result = await sequelize.query(query);
  return result[0];
};