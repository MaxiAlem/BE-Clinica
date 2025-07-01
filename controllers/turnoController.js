import Turno from '../models/Turno.js';
import Paciente from '../models/Paciente.js';
import Profesional from '../models/Profesional.js';
import Especialidad from '../models/Especialidad.js';
import ObraSocial from "../models/ObraSocial.js";
import PDFDocument from "pdfkit";
import { Op } from "sequelize";

/**
 * Crear un nuevo turno
 */
export const crearTurno = async (req, res) => {
  try {
    const turno = await Turno.create(req.body);
    console.log("FECHA QUE LLEGA DEL FRONT:", req.body.start, req.body.end);
    res.status(201).json(turno);
  } catch (err) {
    console.error("Error en crearTurno:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Obtener todos los turnos
 */
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [{
        model: Paciente,
        as: 'Paciente'  // IMPORTANTE usar el alias aquí
      },{
        model: Profesional,
        as: 'Profesional'  // IMPORTANTE usar el alias aquí
      },]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener un turno por ID
 */
export const obtenerTurnoPorId = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id, {
      include: [
        { model: Paciente, as: 'Paciente' },
        { model: Profesional, as: 'Profesional' }
      ]
    });
    

    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    res.json(turno);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por paciente ID
 */
export const obtenerTurnosPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const turnos = await Turno.findAll({
      where: { pacienteId },
      include: [
        { 
          model: Profesional,
          as: 'Profesional',
          include: [{
            model: Especialidad,
            as: 'especialidades',
            attributes: ['id', 'nombre'] // Solo traemos estos campos
          }]
        }
      ],
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por profesional ID
 */
 export const obtenerTurnosPorProfesional = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const turnos = await Turno.findAll({
      where: { profesionalId },
      include: [
        {
          model: Paciente,
          as: 'Paciente'  
        }
      ]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por día (rango desde 00:00 hasta 23:59)
 */
export const obtenerTurnosPorDia = async (req, res) => {
  try {
    const { fecha } = req.query; // formato esperado: YYYY-MM-DD

    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere una fecha en query param' });
    }

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: {
        fechaHora: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [Paciente, Profesional]
    });

    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * Obtener turnos por profesional y día (agenda del profesional para ese día)
 * GET /profesionales/:profesionalId/turnos-dia?fecha=YYYY-MM-DD
 */
 export const obtenerTurnosPorProfesionalYDia = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const { fecha } = req.query; // formato esperado: YYYY-MM-DD

    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere una fecha en query param (YYYY-MM-DD)' });
    }

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: {
        profesionalId,
        fechaHora: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [
        {
          model: Paciente,
          as: 'Paciente'
        },
        {
          model: Profesional,
          as: 'Profesional'
        }
      ],
      order: [['fechaHora', 'ASC']]
    });

    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualizar un turno
 */
export const actualizarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.update(req.body);
    res.json(turno);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar (soft-delete) un turno
 */
export const eliminarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.destroy();
    res.json({ message: 'Turno eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Restaurar un turno eliminado
 */
export const restaurarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id, { paranoid: false });
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.restore();
    res.json({ message: 'Turno restaurado', turno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const generarAgendaPDFPorProfesionalYDia = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const { fecha } = req.query; // formato esperado: YYYY-MM-DD

    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere una fecha en query param (YYYY-MM-DD)' });
    }

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: {
        profesionalId,
        start: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [
        { model: Paciente, as: 'Paciente' },
        { model: Profesional, as: 'Profesional' },
        { model: ObraSocial, as: 'ObraSocial' }
      ],
      order: [['start', 'ASC']]
    });

    if (!turnos.length) {
      return res.status(404).json({ error: "No hay turnos para ese día" });
    }

    // Configuración de columnas (proporciones ajustadas)
    const columns = [
      { label: "Hora", width: 35 },            // 50 * 0.7
      { label: "Durac.", width: 42 },        // 60 * 0.7
      { label: "Tipo", width: 60 },
      { label: "Obra Soc.", width: 132 },    // 110 * 1.2
      { label: "Paciente", width: 110 },
      { label: "Valor", width: 60 },
      { label: "Seña", width: 50 },
      { label: "Motivo", width: 90 },
      { label: "Observaciones", width: 100 },
      { label: "Asis.", width: 30 }
    ];
    const rowHeight = 22;
    const startX = 40;
    let posY = 120;

    // Crear el PDF en modo landscape
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="agenda_profesional_${profesionalId}_${fecha}.pdf"`);
    doc.pipe(res);

    // Encabezado
    const profesional = turnos[0].Profesional;
    doc.fontSize(18).text(`Agenda de ${profesional.nombre} ${profesional.apellido}`, { align: 'center' });
    doc.fontSize(12).text(`Fecha: ${fecha}`, { align: 'center' });
    doc.moveDown(1);

    // Definir color de borde de la grilla gris
    doc.strokeColor('#bbbbbb');

    // Cabecera de la tabla (fondo gris claro)
    let posX = startX;
    doc.font("Helvetica-Bold").fontSize(10);
    columns.forEach(col => {
      doc
        .fillColor('#f5f5f5')
        .rect(posX, posY, col.width, rowHeight)
        .fillAndStroke();
      doc
        .fillColor('black')
        .text(col.label, posX + 2, posY + 6, { width: col.width - 4, align: "left" });
      posX += col.width;
    });

    // Filas de turnos
    doc.font("Helvetica").fontSize(10);
    posY += rowHeight;
    turnos.forEach(turno => {
      posX = startX;
      const hora = new Date(turno.start).toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' });
      const duracionMs = new Date(turno.end) - new Date(turno.start);
      const duracionMin = Math.round(duracionMs / 60000);
      const obraSocial = turno.ObraSocial?.nombre || '';
      const paciente = `${turno.Paciente?.nombre || ''} ${turno.Paciente?.apellido || ''}`;
      const costoTotal = turno.costoTotal !== undefined ? `$${turno.costoTotal}` : '';
      const sena = turno.sena !== undefined ? `$${turno.sena}` : '';
      const motivo = turno.motivo || '';

      const fila = [
        hora,
        duracionMin + " min",
        turno.tipo,
        obraSocial,
        paciente,
        costoTotal,
        sena,
        motivo,
        "", // Observaciones (vacío)
        ""  // Asist (vacío)
      ];

      fila.forEach((cell, i) => {
        doc
          .fillColor('white')
          .rect(posX, posY, columns[i].width, rowHeight)
          .fillAndStroke();
        doc
          .fillColor('black')
          .text(String(cell).substring(0, 32), posX + 2, posY + 6, {
            width: columns[i].width - 4,
            align: "left",
          });
        posX += columns[i].width;
      });
      posY += rowHeight;
      // Salto de página si es necesario
      if (posY > doc.page.height - 60) {
        doc.addPage({ layout: 'landscape' });
        posY = 40;
        // Repetir cabecera de tabla en nueva página
        posX = startX;
        doc.strokeColor('#bbbbbb');
        doc.font("Helvetica-Bold").fontSize(10);
        columns.forEach(col => {
          doc
            .fillColor('#f5f5f5')
            .rect(posX, posY, col.width, rowHeight)
            .fillAndStroke();
          doc
            .fillColor('black')
            .text(col.label, posX + 2, posY + 6, { width: col.width - 4, align: "left" });
          posX += col.width;
        });
        doc.font("Helvetica").fontSize(10);
        posY += rowHeight;
      }
    });

    doc.end();
  } catch (err) {
    console.error("Error generando PDF:", err);
    res.status(500).json({ error: err.message });
  }
};