import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { SECRET_KEY } = process.env;

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded._id;
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({
        message: 'Access not allowed.',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Access not allowed.',
    });
  }

  //   next();
};
