import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModule from '../models/User.js';

export const register = async (req, res) => {
   try {
      // Destructuring req
      const { fullName, email, password, avatarUrl } = req.body;

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Define User document
      const doc = new UserModule({
         fullName,
         email,
         passwordHash: hash,
         avatarUrl,
      });

      // Save User
      const user = await doc.save();

      const token = jwt.sign(
         {
            _id: user._id,
         },
         'secret123',
         {
            expiresIn: '30d',
         },
      );

      // Remove password from response
      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Failed to register',
      });
   }
};

export const login = async (req, res) => {
   try {
      // Find User in MongoDB
      const user = await UserModule.findOne({ email: req.body.email });

      // If user not found
      if (!user) {
         return res.status(404).json({
            message: 'User not faund',
         });
      }

      // Check password (compare req pass & MongoDB pass), use bcrypt
      const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

      if (!isValidPass) {
         return res.status(400).json({
            message: 'Wrong login or password',
         });
      }

      const token = jwt.sign(
         {
            _id: user._id,
         },
         'secret123',
         {
            expiresIn: '30d',
         },
      );

      // Remove pass from user doc
      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         message: 'Failed to register',
      });
   }
};

export const authMe = async (req, res) => {
   try {
      // Find User in MongoDB
      const user = await UserModule.findById(req.userId);

      if (!user) {
         return res.status(404).json({
            message: 'User not found',
         });
      }

      const { passwordHash, ...userData } = user._doc;

      res.json(userData);
   } catch (error) {
      console.log(error);
      res.status(500).json({
         message: 'Failed to register',
      });
   }
};
