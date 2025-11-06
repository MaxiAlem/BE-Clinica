import express from 'express';
import { 
  getFacturasInternas, 
  getFacturaInternaById, 
  postFacturaInterna, 
  removeFacturaInterna,
  previewFacturaInterna
} from '../controllers/facturacionController.js';

const facturacionRouter = express.Router();

facturacionRouter.get('/', getFacturasInternas);
facturacionRouter.get('/:id', getFacturaInternaById);
facturacionRouter.post('/preview', previewFacturaInterna);
facturacionRouter.post('/', postFacturaInterna);
facturacionRouter.delete('/:id', removeFacturaInterna);

export default facturacionRouter;


