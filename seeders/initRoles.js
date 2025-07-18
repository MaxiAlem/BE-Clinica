import Rol from '../models/Role.js';

const generarRolesBase = async () => {
    const cantidad = await Rol.count();
    if (cantidad === 0) {
        await Rol.bulkCreate([
            { nombre: 'admin' },
            { nombre: 'secretario' },
            { nombre: 'profesional' }
        ]);
        console.log('Roles iniciales creados.');
    }
};

export default generarRolesBase;
