import mongoose from 'mongoose';

const UserSema = mongoose.Schema(
   {
      fullName: {
         type: String,
         require: true,
      },
      email: {
         type: String,
         require: true,
         unique: true,
      },
      passwordHash: {
         type: String,
         require: true,
      },
      avatarUrl: String,
   },
   { timestamps: true },
);

export default mongoose.model('User', UserSema);
