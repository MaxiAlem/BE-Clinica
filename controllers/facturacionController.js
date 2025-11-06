import { 
  fetchFacturasInternas, 
  fetchFacturaInternaById, 
  deleteFacturaInterna,
  generarPreviewFactura,
  createFacturaInterna
} from '../services/facturacionService.js';

import FacturacionInterna from '../models/FacturacionInterna.js';
import FacturaTurno from '../models/FacturaTurno.js';
import sequelize from '../models/index.js';

// 🔹 Obtener facturas internas
export const getFacturasInternas = async (req, res) => {
  try {
    const { startDate, endDate, profesionalId, turnoStartDate, turnoEndDate, estadosTurno } = req.query;

    const estadosArray = estadosTurno
      ? Array.isArray(estadosTurno)
        ? estadosTurno
        : estadosTurno.split(',').map(e => e.trim())
      : [];

    const facturas = await fetchFacturasInternas({
      startDate,
      endDate,
      organizacionId: req.user.organizacionId,
      profesionalId,
      turnoStartDate,
      turnoEndDate,
      estadosTurno: estadosArray,
      includeTurnos: true
    });

    res.json(facturas);
  } catch (error) {
    console.error('❌ Error obteniendo facturas:', error);
    res.status(500).json({ error: 'Error obteniendo facturas internas' });
  }
};

// 🔹 Obtener una factura interna por ID
export const getFacturaInternaById = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await fetchFacturaInternaById(id, req.user.organizacionId);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    console.error('❌ Error obteniendo factura:', error);
    res.status(500).json({ error: 'Error obteniendo la factura' });
  }
};

// 🔹 Generar vista previa
export const previewFacturaInterna = async (req, res) => {
  try {
    const { profesionalId, startDate, endDate } = req.body;
    const preview = await generarPreviewFactura({
      profesionalId,
      startDate,
      endDate,
      organizacionId: req.user.organizacionId
    });
    res.json(preview);
  } catch (error) {
    console.error('❌ Error generando preview:', error);
    res.status(500).json({ error: 'Error generando vista previa' });
  }
};

// 🔹 Crear factura interna con turnos
export const postFacturaInterna = async (req, res) => {
  const { turnos, ...preview } = req.body;
  const t = await sequelize.transaction();

  try {
    const nextId = await FacturacionInterna.count({
      where: { organizacionId: req.user.organizacionId },
    }) + 1;

    const facturaNum = `F-${nextId.toString().padStart(4, '0')}`;

    const factura = await FacturacionInterna.create(
      {
        titulo: preview.titulo || '',
        profesionalId: preview.profesionalId,
        periodoDesde: preview.periodoDesde,
        periodoHasta: preview.periodoHasta,
        total: preview.total || 0,
        creadoPor: req.user.id,
        organizacionId: req.user.organizacionId,
        query: preview.query || {},
        facturaNum
      },
      { transaction: t }
    );

    if (turnos?.length) {
      const turnosData = turnos.map(tu => ({
        turnoId: tu.turnoId || tu.id,
        fecha: tu.fecha ? new Date(tu.fecha) : null,
        paciente: tu.paciente || '—',
        costoTotal: tu.costoTotal || 0,
        sena: tu.sena || 0,
        nota: tu.nota || '',
        obraSocial: tu.obraSocial || '—',
        facturaId: factura.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await FacturaTurno.bulkCreate(turnosData, { transaction: t });
    }

    await t.commit();

    // 🔄 Obtener factura completa para devolver al front
    const facturaCompleta = await fetchFacturaInternaById(factura.id, req.user.organizacionId);

    res.status(201).json(facturaCompleta);
  } catch (error) {
    await t.rollback();
    console.error('Error al crear la factura interna:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo crear la factura interna',
      error: error.message
    });
  }
};


// 🔹 Eliminar factura
export const removeFacturaInterna = async (req, res) => {
  try {
    await deleteFacturaInterna(req.params.id, req.user.organizacionId);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error eliminando factura:', error);
    res.status(500).json({ error: 'Error eliminando la factura' });
  }
};
