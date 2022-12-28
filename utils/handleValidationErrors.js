import { validationResult } from 'express-validator';

export default (req, res, next) => {
   // Провіряє полученні данні регістрації на помилки
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
   }

   next();
};
