
const autorizarRol = (...rolesPermitidos) => (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(401).json({ mensaje: "No autorizado" });
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: "No tienes permisos" });
    }
    next();
  };
  export default autorizarRol;