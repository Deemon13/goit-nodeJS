import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const userSchema = new Schema({
  email: String,
  password: String,
  avatarURL: String,
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: String,
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.createUser = createUser;
userSchema.statics.updateUserById = updateUserById;
userSchema.statics.findUserByToken = findUserByToken;
userSchema.statics.findUserById = findUserById;
userSchema.statics.updateUserParams = updateUserParams;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function createUser(userParams) {
  return this.create(userParams);
}

async function updateUserById(id, userParams) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return this.findByIdAndUpdate(id, { $set: userParams }, { new: true });
}

async function findUserByToken(token) {
  return this.findOne({ token });
}

async function findUserById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return this.findById(id);
}

async function updateUserParams(id, userParams) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return this.findByIdAndUpdate(
    id,
    { $set: { avatarURL: userParams } },
    { new: true },
  );
}

export const userModel = mongoose.model('User', userSchema);
