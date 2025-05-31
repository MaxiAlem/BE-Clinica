const autorizarRol = (rolesPermitidos = []) => {
    return (req, res, next) => {
        const rol = req.usuario.rol;
        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();
    };
};

export default autorizarRol;
