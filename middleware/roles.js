export const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        const rolUsuario = req.usuario?.rol;

        if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({ mensaje: 'Acceso denegado: no tienes permiso para realizar esta acción' });
        }

        next();
    };
};