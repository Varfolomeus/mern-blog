import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation,
} from './middleware/validations.js';

dotenv.config();
import { checkAuth, handleValidationErrors } from './middleware/index.js';

import { PostController, UserController, CommentController } from './Controllers/index.js';

const { MONGO_URL, PORT, USER_UPLOADS_FOLDER, USER_AVATARS_FOLDER } = process.env;

const port = PORT || 3001;

mongoose.set('strictQuery', false);

mongoose
  .connect(MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('DB ok');
  })
  .catch((e) => {
    console.log('db fail', e.reason);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, USER_UPLOADS_FOLDER);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const storageForAvatars = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, USER_AVATARS_FOLDER);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const uploadforavatars = multer({ storage: storageForAvatars });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(USER_UPLOADS_FOLDER));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.post('/avatar', uploadforavatars.single('image'), (req, res) => {
  res.json({
    url: `/uploads/avatars/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/tags/:id', PostController.getPostOnTags);
app.get('/posts/:id', PostController.getOne);
app.get('/postssortbycreation', PostController.getSortedByCreation);
app.get('/postssortbyviews', PostController.getSortedByViews);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.post('/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);

app.get('/comments', CommentController.getAll);
app.delete('/comments/:id', checkAuth, CommentController.removeCommentsRefToPost);
app.get('/comtofullpost/:id', CommentController.commentOnPostWithUserInfo);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server ok on port ' + port);
});
