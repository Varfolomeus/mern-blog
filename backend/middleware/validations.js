import { body } from 'express-validator';
export const loginValidation = [
  body('email', 'Wrong email').isEmail(),
  body('password', 'Wrong password').isLength({ min: 5 }),
];
export const registerValidation = [
  body('email', 'Wrong email').isEmail(),
  body('password', 'Wrong password').isLength({ min: 5 }),
  body('fullName', 'Input correct name').isLength({ min: 3 }),
  body('avatarUrl', 'Wrong avatar URL').optional().isURL(),
];
export const postCreateValidation = [
  body('title', 'Input article title').isLength({ min: 3 }).isString(),
  body('text', 'Input article text').isLength({ min: 3 }).isString(),  
  body('tags', 'Wrong article tags list').optional().isString(),
  body('avatarUrl', 'Wrong article illustration URL').optional().isString(),
];
export const commentCreateValidation = [
  body('title', 'Input article title').isLength({ min: 3 }).isString(),
  body('text', 'Input article text').isLength({ min: 3 }).isString(),  
  body('user', 'Wrong user information').isString(),
  body('post', 'Wrong post information').isString(),
];