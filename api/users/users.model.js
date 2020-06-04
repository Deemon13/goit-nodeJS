import mongoose, { Schema } from 'mongoose';
import { uuid } from 'uuidv4';

const { ObjectId } = mongoose.Types;

const USER_STATUSES = {
  NOT_VERIFIED: 'NOT_VERIFIED',
  ACTIVE: 'ACTIVE',
};

const userSchema = new Schema({
  email: String,
  password: String,
  avatarURL: String,
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  status: {
    type: String,
    required: true,
    default: USER_STATUSES.NOT_VERIFIED,
    enum: Object.values(USER_STATUSES),
  },
  verificationToken: { type: String, required: false },
  token: String,
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.createUser = createUser;
userSchema.statics.updateUserById = updateUserById;
userSchema.statics.findUserByToken = findUserByToken;
userSchema.statics.findUserById = findUserById;
userSchema.statics.updateUserParams = updateUserParams;
userSchema.statics.findUserByVerificationToken = findUserByVerificationToken;
userSchema.statics.verifyUser = verifyUser;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function createUser(userParams) {
  userParams.verificationToken = uuid();

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

async function findUserByVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function verifyUser(verificationToken) {
  return this.updateOne(
    { verificationToken },
    { $set: { verificationToken: null, status: USER_STATUSES.ACTIVE } },
  );
}

export const userModel = mongoose.model('User', userSchema);
