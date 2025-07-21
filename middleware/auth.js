import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  //const authHeader = req.headers.authorization;
  const token = req.cookies.token; //viene por 🍪

  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return res.status(401).json({ mensaje: 'Token no proporcionado' });
  // }

 // const token = authHeader.split(' ')[1];
 if (!token) {
  return res.status(401).json({ mensaje: 'Token no proporcionado' });
}

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { id, rol }
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};
