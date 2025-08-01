//import db from '../db.js'; // o como tengas instanciado tu pool/conexion
import sequelize from '../config/db.js';



export const fetchPacientesPorEspecialidad = async ({ startDate, endDate } = {}) => {

  let whereClause = '';

  if (startDate && endDate) {
    whereClause = `WHERE t.start BETWEEN :startDate AND :endDate`;
  }

  const query = `
  SELECT 
  e.nombre AS especialidad,
  COUNT(t.id) AS cantidad_turnos
FROM turnos t
JOIN profesionales p ON t.profesionalId = p.id
JOIN profesional_especialidades pe ON pe.profesionalId = p.id
JOIN especialidades e ON e.id = pe.especialidadId
${whereClause}
GROUP BY e.id, e.nombre
ORDER BY cantidad_turnos DESC;

  `;

  const result = await sequelize.query(query, {
    replacements: { startDate, endDate },
  });
  return result[0];
};


export const fetchPacientesPorProfesional = async ({ startDate, endDate } = {}) => {
  let whereClause = '';

  if (startDate && endDate) {
    whereClause = `WHERE t.start BETWEEN :startDate AND :endDate`;
  }

  const query = `
    SELECT 
      CONCAT(p.nombre, ' ', p.apellido) AS profesional,
      COUNT(t.id) AS cantidad_turnos
    FROM turnos t
    JOIN profesionales p ON t.profesionalId = p.id
    ${whereClause}
    GROUP BY p.id, p.nombre, p.apellido
    ORDER BY cantidad_turnos DESC;
  `;

  const result = await sequelize.query(query, {
    replacements: { startDate, endDate },
  });

  return result[0];
};


export const fetchTopObrasSociales= async ({ startDate, endDate } = {}) => {

  let whereClause = '';

  if (startDate && endDate) {
    whereClause = `WHERE t.start BETWEEN :startDate AND :endDate`;
  }

  const query = `
  SELECT 
  o.nombre AS obra_social,
  COUNT(t.id) AS cantidad_turnos
FROM turnos t
JOIN obras_sociales o ON t.obraSocialId = o.id
${whereClause}
GROUP BY o.id, o.nombre
ORDER BY cantidad_turnos DESC
LIMIT 15;

  `;

  const result = await sequelize.query(query, {
    replacements: { startDate, endDate },
  });
  return result[0];
};
export const fetchTendenciaTurnos= async () => {
  const query = `
  SELECT
  DATE_FORMAT(start, '%Y-%m-01') AS mes,
  COUNT(*) AS cantidad
FROM turnos
GROUP BY mes
ORDER BY mes ASC;
 `;

  const result = await sequelize.query(query);
  return result[0];
};
export const fetchPacientesPorMes= async () => {
  const query = `
  SELECT
  DATE_FORMAT(createdAt, '%Y-%m-01') AS mes,
  COUNT(*) AS cantidad_pacientes
FROM pacientes
WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY mes
ORDER BY mes ASC;


 `;

  const result = await sequelize.query(query);
  return result[0];
};
export const fetchPorcentajeCancelados= async ({ startDate, endDate } = {}) => {

  let whereClause = '';

  if (startDate && endDate) {
    whereClause = `WHERE t.start BETWEEN :startDate AND :endDate`;
  }

  const query = `
  SELECT
  ROUND(
    (SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
    2
  ) AS porcentaje_cancelados
FROM turnos
${whereClause};
 `;

 const result = await sequelize.query(query, {
  replacements: { startDate, endDate },
});

  return result[0];
};