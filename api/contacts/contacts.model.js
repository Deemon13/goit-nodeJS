// const { MongoClient, ObjectId } = require('mongodb');
import mongoose, { Schema } from 'mongoose';

// class ContactModel {
//   constructor() {
//     // this.contacts = null;
//   }

//   async createContact(contactParams) {
//     await getContactsCollection();

//     const insertResult = await this.contacts.insertOne(contactParams);

//     return this.contacts.findOne({
//       _id: new ObjectId(insertResult.insertedId),
//     });
//   }

//   async findAllContacts() {
//     await getContactsCollection();
//     return this.contacts.find().toArray();
//   }

//   async findContactById(id) {
//     await getContactsCollection();
//     if (!ObjectId.isValid(id)) {
//       return null;
//     }
//     return this.contacts.findOne({ _id: new ObjectId(id) });
//   }

//   async updateContactById(id) {
//     await getContactsCollection();
//     if (!ObjectId.isValid(id)) {
//       return null;
//     }
//     return this.contacts.findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: contactParams },
//       { new: true },
//     );
//   }

//   async removeContactById(id) {
//     await getContactsCollection();
//     if (!ObjectId.isValid(id)) {
//       return null;
//     }
//     return this.contacts.deleteOne({ _id: new ObjectId(id) });
//   }

//   async getContactsCollection() {
//     if (this.contacts) {
//       return;
//     }

//     const client = await MongoClient(process.env.MONGODB_DB_URL);
//     const db = client.db(process.env.MONGODB_DB_NAME);

//     this.contacts = await db.createCollection('contacts');
//   }
// }

// export const contactModel = new ContactModel();

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

const contactModel = mongoose.model('Contact', contactSchema);
