import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

contactSchema.statics.findAllContacts = findAllContacts;
contactSchema.statics.findContactById = findContactById;
contactSchema.statics.createContact = createContact;
contactSchema.statics.updateContactById = updateContactById;
contactSchema.statics.removeContactById = removeContactById;

async function findAllContacts() {
  return this.find();
}

async function findContactById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return this.findById(id);
}

async function createContact(contactParams) {
  return this.create(contactParams);
}

async function updateContactById(id, contactParams) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return this.findByIdAndUpdate(id, { $set: contactParams }, { new: true });
}

async function removeContactById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return this.findByIdAndDelete(id);
}

export const contactModel = mongoose.model('Contact', contactSchema);
