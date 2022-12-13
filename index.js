import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
   .connect('mongodb+srv://admin:123@cluster0.aldlull.mongodb.net/?retryWrites=true&w=majority')
   .then(() => console.log('DB OK'))
   .catch((err) => console.log('DB ERROR: ', err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
   res.send('Hello World');
});

// Login
app.post('/auth/login', (req, res) => {
   console.log(req);

   const token = jwt.sign(
      {
         email: req.body.email,
         password: req.body.password,
      },
      'secret123',
   );

   res.json({
      success: true,
      token,
   });
});

app.listen(4444, (err) => {
   if (err) {
      return console.log(err);
   }

   console.log('Server OK');
});
