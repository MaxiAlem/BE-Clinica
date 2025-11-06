import FacturacionInterna from '../models/FacturacionInterna.js';
import FacturaTurno from '../models/FacturaTurno.js';
import { Op } from 'sequelize';
import Turno from '../models/Turno.js';
import Profesional from '../models/Profesional.js';
import Paciente from '../models/Paciente.js';
import ObraSocial from '../models/ObraSocial.js';
import Especialidad from '../models/Especialidad.js';

// 🧾 Obtener todas las facturas (opcionalmente con turnos)
export const fetchFacturasInternas = async ({
  startDate,
  endDate,
  organizacionId,
  includeTurnos = false,
  profesionalId,
  turnoStartDate,
  turnoEndDate,
  estadosTurno
}) => {
  const whereFactura = { organizacionId };

  if (startDate && endDate) {
    whereFactura.createdAt = { [Op.between]: [startDate, endDate] };
  }

  if (profesionalId) {
    whereFactura.profesionalId = profesionalId;
  }

  const include = [];
  if (includeTurnos) {
    const whereTurno = {};
    if (turnoStartDate && turnoEndDate) {
      whereTurno.fecha = { [Op.between]: [turnoStartDate, turnoEndDate] };
    }
    if (estadosTurno && estadosTurno.length > 0) {
      whereTurno.estado = { [Op.in]: estadosTurno };
    }

    include.push({
      model: FacturaTurno,
      as: 'turnos',
      where: Object.keys(whereTurno).length ? whereTurno : undefined,
      required: false,
    });
  }

  return await FacturacionInterna.findAll({
    where: whereFactura,
    order: [['createdAt', 'DESC']],
    include
  });
};

// Obtener factura por ID con datos normalizados
export const fetchFacturaInternaById = async (id, organizacionId) => {
  const factura = await FacturacionInterna.findOne({
    where: { id, organizacionId },
    include: [
      {
        model: FacturaTurno,
        as: 'turnos',
        attributes: [
          'id',
          'fecha',
          'paciente',
          'costoTotal',
          'sena',
          'nota',
          'obraSocial'
        ]
      },
      {
        model: Profesional,
        as: 'profesional',
        attributes: ['id', 'nombre', 'apellido'],
        include: [
          { model: Especialidad, as: 'especialidades', attributes: ['id', 'nombre'], through: { attributes: [] } }
        ]
      },
    ],
  });

  if (!factura) return null;

  return {
    id: factura.id,
    facturaNum: factura.facturaNum,
    titulo: factura.titulo,
    periodoDesde: factura.periodoDesde,
    periodoHasta: factura.periodoHasta,
    total: factura.total,
    query: factura.query,
    profesional: factura.profesional
      ? {
          id: factura.profesional.id,
          nombre: factura.profesional.nombre,
          apellido: factura.profesional.apellido,
          especialidades: factura.profesional.especialidades.map(e => ({ id: e.id, nombre: e.nombre }))
        }
      : null,
    turnos: factura.turnos.map(t => ({
      id: t.id,
      fecha: t.fecha,
      paciente: t.paciente || '—',
      costoTotal: t.costoTotal,
      sena: t.sena,
      nota: t.nota,
      obraSocial: t.obraSocial || '—'
    })),
    createdAt: factura.createdAt,
    updatedAt: factura.updatedAt
  };
};

// 🔹 Generar vista previa
export const generarPreviewFactura = async ({ profesionalId, startDate, endDate, organizacionId }) => {
  const profesional = await Profesional.findOne({
    where: { id: profesionalId, organizacionId },
    attributes: ['id', 'nombre', 'apellido'],
    include: [{ association: 'especialidades', attributes: ['id', 'nombre'], through: { attributes: [] } }]
  });

  if (!profesional) throw new Error('Profesional no encontrado');

  const turnos = await Turno.findAll({
    where: {
      profesionalId,
      organizacionId,
      estado: { [Op.not]: 'cancelado' },
      ...(startDate && endDate ? { start: { [Op.between]: [startDate, endDate] } } : {}),
    },
    include: [
      { model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'apellido'] },
      { model: ObraSocial, as: 'obraSocial', attributes: ['id', 'nombre'] },
    ],
    order: [['start', 'ASC']],
  });

  return {
    profesionalId: profesional.id,
    profesional: {
      id: profesional.id,
      nombre: profesional.nombre,
      apellido: profesional.apellido,
      especialidades: profesional.especialidades.map(e => ({ id: e.id, nombre: e.nombre }))
    },
    totalTurnos: turnos.length,
    periodoDesde: turnos[0]?.start || startDate,
    periodoHasta: turnos[turnos.length - 1]?.start || endDate,
    turnos: turnos.map(t => ({
      id: t.id,
      fecha: t.start,
      paciente: t.paciente ? `${t.paciente.nombre} ${t.paciente.apellido}` : '—',
      costoTotal: t.costoTotal,
      sena: t.sena,
      nota: t.notas,
      obraSocial: t.obraSocial ? t.obraSocial.nombre : '—'
    })),
  };
};

// 💾 Crear nueva factura interna
export const createFacturaInterna = async ({ titulo, query, datos, creadoPor, profesionalId, organizacionId, periodoDesde, periodoHasta }) => {
  const lastFactura = await FacturacionInterna.findOne({
    where: { organizacionId },
    order: [['createdAt', 'DESC']]
  });

  const nextNum = lastFactura
    ? String(parseInt(lastFactura.facturaNum) + 1).padStart(4, '0')
    : '0001';

  return await FacturacionInterna.create({
    facturaNum: nextNum,
    titulo,
    query,
    datos,
    profesionalId,
    creadoPor,
    organizacionId,
    periodoDesde,
    periodoHasta,
  });
};

// 🗑️ Eliminar factura (soft delete)
export const deleteFacturaInterna = async (id, organizacionId) => {
  const factura = await FacturacionInterna.findOne({ where: { id, organizacionId } });
  if (!factura) throw new Error('Factura no encontrada');
  await factura.destroy();
  return true;
};
