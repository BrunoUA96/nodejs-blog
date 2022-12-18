import { body } from 'express-validator';

export const postCreateValidation = [
   body('title', 'Введіть заголовок посту').isLength({ min: 3 }).isString(),
   body('text', 'Введіть текс посту').isLength({ min: 10 }).isString(),
   body('tags', 'Неправильний формат тегів (вкажіть масив)').optional().isArray(),
   body('imageUrl', 'Неправильне посилання на фотографію').optional().isString(),
];
