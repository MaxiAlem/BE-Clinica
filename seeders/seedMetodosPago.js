
import MetodoPago from '../models/MetodoPago.js';

const genmetodosPago = async () => {
    const cantidad = await MetodoPago.count();
    if (cantidad === 0) {
        await MetodoPago.bulkCreate([
            { nombre: 'Efectivo' },
            { nombre: 'Transferencia' },
            { nombre: 'T. de Crédito' }
        ]);
        console.log('metodos de pago main');
    }
};

export default genmetodosPago;
