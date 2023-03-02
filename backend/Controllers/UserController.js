import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from './../models/User.js';
import User from './../models/User.js';

dotenv.config();
const { BCRYPT_SALT_BASE, SECRET_KEY, TOKEN_TO_UPDATE_TIME } = process.env;

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const bcryptSalt = await bcrypt.genSalt(BCRYPT_SALT_BASE);
    const hash = await bcrypt.hash(password, bcryptSalt);
    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    });
    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET_KEY,
      {
        expiresIn: TOKEN_TO_UPDATE_TIME,
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.status(200).json({
      message: 'User registered',
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'User not registered',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      });
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'entered not correct email or password',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET_KEY,
      {
        expiresIn: TOKEN_TO_UPDATE_TIME,
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.status(200).json({
      message: 'Authorization success',
      ...userData,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Authorization failed',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    const { passwordHash, ...userData } = user._doc;
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    res.status(200).json({
      message: 'User foumd',
      ...userData,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Server error',
    });
  }
};
