import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
   try {
      const posts = await PostModel.find().populate('user').exec();

      res.json(posts);
   } catch (error) {
      console.log(error);
      res.status(500).json({
         message: 'Не получилось дістати тости',
      });
   }
};

export const getOne = async (req, res) => {
   try {
      const postId = req.params.id;

      await PostModel.findByIdAndUpdate(
         {
            _id: postId,
         },
         { $inc: { viewsCount: 1 } },
         {
            returnDocument: 'after',
         },
         (err, doc) => {
            if (err) {
               console.log(err);
               return res.status(500).json({
                  message: 'Не получилось получити тост за допомогою Id',
               });
            }

            if (!doc) {
               return res.status(404).json({
                  message: 'Не вдалось знайти пост',
               });
            }

            res.json(doc);
         },
      );
   } catch (error) {
      console.log(error);
      res.status(500).json({
         message: 'Не получилось дістати тости',
      });
   }
};

export const remove = async (req, res) => {
   try {
      const postId = req.params.id;

      await PostModel.findOneAndDelete(
         {
            _id: postId,
         },
         (err, doc) => {
            if (err) {
               console.log(err);
               return res.status(500).json({
                  message: 'Не получилось видалити тост за допомогою Id',
               });
            }

            if (!doc) {
               return res.status(404).json({
                  message: 'Не вдалось знайти пост',
               });
            }

            res.json({
               success: true,
            });
         },
      );
   } catch (error) {}
};

export const create = async (req, res) => {
   try {
      const doc = new PostModel({
         title: req.body.title,
         text: req.body.text,
         imageUrl: req.body.imageUrl,
         tags: req.body.tags,
         user: req.userId,
      });

      const post = await doc.save();

      res.json(post);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не получилось створити пост',
      });
   }
};

export const update = async (req, res) => {
   try {
      const postId = req.params.id;

      await PostModel.updateOne(
         {
            _id: postId,
         },
         {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
         },
      );

      res.json({
         success: true,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         message: 'Не вдалось обновити пост',
      });
   }
};
