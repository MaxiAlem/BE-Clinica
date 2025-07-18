import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Rol = sequelize.define('Rol', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'roles',
    timestamps: false
});

export default Rol;
