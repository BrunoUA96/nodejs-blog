import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

// Validators
import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/post.js';

// Utils
import { checkAuth, handleValidationErrors } from './utils/index.js';

// Controllers
import { UserController, PostController } from './controllers/index.js';

mongoose
   .set('strictQuery', true)
   .connect('mongodb+srv://admin:123@cluster0.aldlull.mongodb.net/blog?retryWrites=true&w=majority')
   .then(() => console.log('DB OK'))
   .catch((err) => console.log('DB ERROR: ', err));

const app = express();

const storage = multer.diskStorage({
   destination: (_, __, callBack) => {
      callBack(null, 'uploads');
   },
   filename: (_, file, callBack) => {
      callBack(null, file.originalname);
   },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// User
// - Login
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
// - Check User
app.get('/auth/me', checkAuth, UserController.authMe);
// - Register
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

//Posts
// - Image upload
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`,
   });
});

// - Get all Posts
app.get('/posts', PostController.getAll);
// - Create Post
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
// - Update post
app.patch(
   '/posts/:id',
   checkAuth,
   postCreateValidation,
   handleValidationErrors,
   PostController.update,
);
// - Get post
app.get('/posts/:id', PostController.getOne);
// - Remove post
app.delete('/posts/:id', checkAuth, PostController.remove);

app.listen(4444, (err) => {
   if (err) {
      return console.log(err);
   }

   console.log('Server OK');
});
