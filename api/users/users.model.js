import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const userSchema = new Schema({
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: String,
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.createUser = createUser;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function createUser(userParams) {
  return this.create(userParams);
}

export const userModel = mongoose.model('User', userSchema);
