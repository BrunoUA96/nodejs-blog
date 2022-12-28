import express from 'express';
import mongoose from 'mongoose';

import checkAuth from './utils/checkAuth.js';

// Validators
import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/post.js';

// Controllers
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
   .set('strictQuery', true)
   .connect('mongodb+srv://admin:123@cluster0.aldlull.mongodb.net/blog?retryWrites=true&w=majority')
   .then(() => console.log('DB OK'))
   .catch((err) => console.log('DB ERROR: ', err));

const app = express();
app.use(express.json());

// User
// - Login
app.post('/auth/login', loginValidation, UserController.login);
// - Check User
app.get('/auth/me', checkAuth, UserController.authMe);
// - Register
app.post('/auth/register', registerValidation, UserController.register);

//Posts
// - Get all Posts
app.get('/posts', PostController.getAll);
// - Create Post
app.post('/posts', checkAuth, postCreateValidation, PostController.create);

app.listen(4444, (err) => {
   if (err) {
      return console.log(err);
   }

   console.log('Server OK');
});
