import express from 'express';

import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';

mongoose
   .set('strictQuery', true)
   .connect('mongodb+srv://admin:123@cluster0.aldlull.mongodb.net/blog?retryWrites=true&w=majority')
   .then(() => console.log('DB OK'))
   .catch((err) => console.log('DB ERROR: ', err));

const app = express();
app.use(express.json());
// Login
app.post('/auth/login', UserController.login);

// Check User
app.get('/auth/me', checkAuth, UserController.authMe);

// Register
app.post('/auth/register', registerValidation, UserController.register);

app.listen(4444, (err) => {
   if (err) {
      return console.log(err);
   }

   console.log('Server OK');
});
