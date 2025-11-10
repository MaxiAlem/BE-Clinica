import Turno from '../models/Turno.js';
import Paciente from '../models/Paciente.js';
import Profesional from '../models/Profesional.js';
import Especialidad from '../models/Especialidad.js';
import ObraSocial from "../models/ObraSocial.js";
import DiaLibre from '../models/DiasLibre.js';
import PDFDocument from "pdfkit";
import { Op } from "sequelize";

// Helper DRY para el tenant
const tenantScope = (req) => ({ organizacionId: req.user.organizacionId });

// ====================== CREAR TURNO ======================
export const crearTurno = async (req, res) => {
  try {
    const { start, end, profesionalId, derivacionProfesionalId, pacienteId } = req.body;
    const fechaTurno = new Date(start);

    // Verificar días libres a través del profesional
    const diaLibre = await DiaLibre.findOne({
      where: {
        profesionalId,
        fechaInicio: { [Op.lte]: fechaTurno },
        fechaFin: { [Op.gte]: fechaTurno }
      },
      include: [{
        model: Profesional,
        as: 'profesional',
        where: { organizacionId: req.user.organizacionId }
      }]
    });

    if (diaLibre) {
      const desde = new Date(diaLibre.fechaInicio).toISOString().slice(0, 10);
      const hasta = new Date(diaLibre.fechaFin).toISOString().slice(0, 10);
      return res.status(400).json({
        error: `El profesional está de vacaciones del ${desde} al ${hasta}.`
      });
    }

    const turno = await Turno.create({
      ...req.body,
      organizacionId: req.user.organizacionId,
      derivacionProfesionalId
    });

    const turnoCompleto = await Turno.findByPk(turno.id, {
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Profesional, as: 'profesional' },
        { model: Profesional, as: 'derivacionProfesional' }
      ]
    });

    res.status(201).json(turnoCompleto);
  } catch (err) {
    console.error("Error en crearTurno:", err);
    res.status(400).json({ error: err.message });
  }
};

// ====================== OBTENER TURNOS ======================
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      where: tenantScope(req),
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Profesional, as: 'profesional' },
        { model: Profesional, as: 'derivacionProfesional' }
      ]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerTurnoPorId = async (req, res) => {
  try {
    const turno = await Turno.findOne({
      where: { id: req.params.id, ...tenantScope(req) },
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Profesional, as: 'profesional' },
        { model: Profesional, as: 'derivacionProfesional' }
      ]
    });

    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
    res.json(turno);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== TURNOS POR PACIENTE ======================
export const obtenerTurnosPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const turnos = await Turno.findAll({
      where: { pacienteId, ...tenantScope(req) },
      include: [
        {
          model: Profesional,
          as: 'profesional',
          include: [{
            model: Especialidad,
            as: 'especialidades',
            attributes: ['id', 'nombre']
          }]
        },
        { model: Profesional, as: 'derivacionProfesional' }
      ]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== TURNOS POR PROFESIONAL ======================
export const obtenerTurnosPorProfesional = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const turnos = await Turno.findAll({
      where: { profesionalId, ...tenantScope(req) },
      include: [
        { model: Paciente, as: 'paciente' },
        { model: ObraSocial, as: 'obraSocial', attributes: ['nombre'] },
        { model: Profesional, as: 'derivacionProfesional' }
      ]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== TURNOS POR DIA ======================
export const obtenerTurnosPorDia = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Se requiere una fecha' });

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: { start: { [Op.between]: [startOfDay, endOfDay] }, ...tenantScope(req) },
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Profesional, as: 'profesional' },
        { model: Profesional, as: 'derivacionProfesional' }
      ]
    });

    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== TURNOS POR PROFESIONAL Y DIA ======================
export const obtenerTurnosPorProfesionalYDia = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Se requiere fecha' });

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: { profesionalId, start: { [Op.between]: [startOfDay, endOfDay] }, ...tenantScope(req) },
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Profesional, as: 'profesional' },
        { model: Profesional, as: 'derivacionProfesional' },
        { model: ObraSocial, as: 'obraSocial' }
      ],
      order: [['start', 'ASC']]
    });

    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== ACTUALIZAR TURNO ======================
export const actualizarTurno = async (req, res) => {
  try {
    const turno = await Turno.findOne({ where: { id: req.params.id, ...tenantScope(req) } });
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    await turno.update({
      ...req.body,
      derivacionProfesionalId: req.body.derivacionProfesionalId
    });

    const turnoActualizado = await Turno.findByPk(turno.id, {
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Profesional, as: 'profesional' },
        { model: Profesional, as: 'derivacionProfesional' }
      ]
    });

    res.json(turnoActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ====================== ELIMINAR / RESTAURAR ======================
export const eliminarTurno = async (req, res) => {
  try {
    const turno = await Turno.findOne({ where: { id: req.params.id, ...tenantScope(req) } });
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    await turno.destroy();
    res.json({ message: 'Turno eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const restaurarTurno = async (req, res) => {
  try {
    const turno = await Turno.findOne({ where: { id: req.params.id, ...tenantScope(req) }, paranoid: false });
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    await turno.restore();
    res.json({ message: 'Turno restaurado', turno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Generar PDF por profesional y día (mismo tenant)
export const generarAgendaPDFPorProfesionalYDia = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Se requiere fecha' });

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: {
        profesionalId,
        start: { [Op.between]: [startOfDay, endOfDay] },
        ...tenantScope(req)
      },
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Profesional, as: 'profesional' },
        { model: ObraSocial, as: 'obraSocial' }
      ],
      order: [['start', 'ASC']]
    });

    if (!turnos.length) return res.status(404).json({ error: "No hay turnos para ese día" });

    // Configuración de columnas (proporciones ajustadas)
    const columns = [
      { label: "Hora", width: 40 },            // 50 * 0.7
      { label: "Durac.", width: 42 },        // 60 * 0.7
      { label: "Tipo", width: 60 },
      { label: "Obra Soc.", width: 130 },    // 110 * 1.2
      { label: "Paciente", width: 125 },
      { label: "Valor", width: 60 },
      { label: "Seña", width: 50 },
      { label: "Motivo", width: 100 },
      { label: "Observaciones", width: 130 },
      { label: "Asis.", width: 25 }
    ];
    const rowMinHeight = 22;
    const startX = 40;
    let posY = 120;

    // Crear el PDF en modo landscape
    const doc = new PDFDocument({ margin: 35, size: 'A4', layout: 'landscape' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="agenda_profesional_${profesionalId}_${fecha}.pdf"`);
    doc.pipe(res);

    // Encabezado
    const profesional = turnos[0].profesional;
    doc.fontSize(16).text(`Agenda de ${profesional.nombre} ${profesional.apellido}`, { align: 'center' });
    doc.fontSize(10).text(`Fecha: ${fecha}`, { align: 'center' });
    doc.moveDown(0);

    // Definir color de borde de la grilla gris
    doc.strokeColor('#bbbbbb');



doc.registerFont('Actor', './fonts/Actor-Regular.ttf');
doc.registerFont('ArchivoNarrow', './fonts/ArchivoNarrow-Regular.ttf');
doc.registerFont('ArchivoNarrow-Bold', './fonts/ArchivoNarrow-Bold.ttf');
    // Cabecera de la tabla (fondo gris claro)
    
doc.font('ArchivoNarrow');
    let posX = startX;
    doc.font("ArchivoNarrow-Bold").fontSize(10);
    columns.forEach(col => {
      doc
        .fillColor('#f5f5f5')
        .rect(posX, posY, col.width, rowMinHeight)
        .fillAndStroke();
      doc
        .fillColor('black')
        .text(col.label, posX + 2, posY + 6, { width: col.width - 4, align: "left" });
      posX += col.width;
    });

    // Filas de turnos con altura dinámica según contenido
  
    doc.font('ArchivoNarrow').fontSize(10);
    posY += rowMinHeight;

      // Función para formatear la hora en zona horaria local
      const formatLocalTime = (date) => {
        return new Date(date).toLocaleTimeString("es-AR", {
          timeZone: 'America/Argentina/Buenos_Aires',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      };

          // Función para calcular duración en zona horaria local
    const calculateLocalDuration = (start, end) => {
      const startLocal = new Date(start);
      const endLocal = new Date(end);
      const duracionMs = endLocal - startLocal;
      return Math.round(duracionMs / 60000);
    };


    turnos.forEach(turno => {
      posX = startX;

      // Usar las funciones de zona horaria local
      const hora = formatLocalTime(turno.start);
      const duracionMin = calculateLocalDuration(turno.start, turno.end);

    
      const obraSocial = turno.obraSocial?.nombre
  ? `${turno.obraSocial.nombre}${turno.paciente?.nAfiliado ? `  ( N°:${turno.paciente.nAfiliado})` : ''}`
  : '';

      const paciente = `${turno.paciente?.nombre || ''} ${turno.paciente?.apellido || ''}  (DNI:${turno.paciente?.dni || 'sin DNI'})`;
      const costoTotal = turno.costoTotal !== undefined ? `$${turno.costoTotal}` : '';
      const sena = turno.sena !== undefined ? `$${turno.sena}` : '';
      const motivo = turno.motivo || '';
      const notas = turno.notas || '';

      const fila = [
        hora,
        duracionMin + " min",
        turno.tipo,
        obraSocial,
        paciente,
        costoTotal,
        sena,
        motivo,
        notas, // Observaciones (vacío)
        ""  // Asist (vacío)
      ];

      // Calcular la altura necesaria de la fila según el contenido de cada celda
      const cellHeights = fila.map((cell, i) =>
        doc.heightOfString(String(cell), {
          width: columns[i].width - 4,
          align: "left"
        })
      );
      const dynamicRowHeight = Math.max(...cellHeights, rowMinHeight);

      
  // ======= Chequeo antes de dibujar =======
  if (posY + dynamicRowHeight > doc.page.height - 40) {
    doc.addPage({ layout: 'landscape' });
    posY = 40;
    posX = startX;
    doc.strokeColor('#bbbbbb');
    doc.font('ArchivoNarrow-Bold').fontSize(10);
    columns.forEach(col => {
      doc
        .fillColor('#f5f5f5')
        .rect(posX, posY, col.width, rowMinHeight)
        .fillAndStroke();
      doc
        .fillColor('black')
        .text(col.label, posX + 2, posY + 6, { width: col.width - 4, align: "left" });
      posX += col.width;
    });
    doc.font('ArchivoNarrow').fontSize(10);
    posY += rowMinHeight;
  }
  // ========================================

      fila.forEach((cell, i) => {
        doc
          .fillColor('white')
          .rect(posX, posY, columns[i].width, dynamicRowHeight)
          .fillAndStroke();
        doc
          .fillColor('black')
          .text(String(cell), posX + 4, posY + 1, {
            width: columns[i].width - 4,
            align: "left",
            lineGap: -1
          });
        posX += columns[i].width;
      });
      posY += dynamicRowHeight;

      // Salto de página si es necesario
      if (posY > doc.page.height - 60) {
        doc.addPage({ layout: 'landscape' });
        posY = 40;
        // Repetir cabecera de tabla en nueva página
        posX = startX;
        doc.strokeColor('#bbbbbb');
        doc.font('ArchivoNarrow').fontSize(19);
        columns.forEach(col => {
          doc
            .fillColor('#f5f5f5')
            .rect(posX, posY, col.width, rowMinHeight)
            .fillAndStroke();
          doc
            .fillColor('black')
            .text(col.label, posX + 2, posY + 2, { width: col.width - 4, align: "left" });
          posX += col.width;
        });
        doc.font('ArchivoNarrow').fontSize(9);
        posY += rowMinHeight;
      }
    });

    doc.end();
  } catch (err) {
    console.error("Error generando PDF:", err);
    res.status(500).json({ error: err.message });
  }
};