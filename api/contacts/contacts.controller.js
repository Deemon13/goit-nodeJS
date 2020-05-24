import Joi from 'joi';
import { contactModel } from './contacts.model';
import { NotFound } from '../helpers/error.constructors';
import { createControllerProxy } from '../helpers/controllerProxy';

async function listContacts(req, res, next) {
  try {
    const contacts = await contactModel.findAllContacts();

    // console.log(contacts);

    return res.status(200).send(contacts);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const foundContact = await this.getContactByIdOrThrow(id);

    return res.status(200).json(foundContact);
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  try {
    const newContact = await contactModel.createContact(req.body);

    return res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    await this.getContactByIdOrThrow(id);

    const updatedContact = contactModel.updateContactById(id, req.body);

    return res.status(200).json(updatedContact.value);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  try {
    const { id } = req.params;
    await this.getContactByIdOrThrow(id);

    await contactModel.removeContactById(id);
    return res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

async function getContactByIdOrThrow(contactId) {
  const contactFound = await contactModel.findContactById(contactId);
  if (!foundContact) {
    throw new NotFound('Not found');
  }
  return contactFound;
}

function validateAddContact(req, res, next) {
  const contactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const validationResult = Joi.validate(req.body, contactRules);
  const message = 'missing required name field';
  if (validationResult.error) {
    return res.status(400).json({ message });
  }
  next();
}

function validateUpdateContact(req, res, next) {
  const message = 'missing fields';
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message });
  }
  next();
}

export const contactController = createControllerProxy({
  listContacts,
  getById,
  validateAddContact,
  addContact,
  removeContact,
  validateUpdateContact,
  updateContact,
});

// export const contactController = {
//   listContacts,
//   getById,
//   validateAddContact,
//   addContact,
//   removeContact,
//   validateUpdateContact,
//   updateContact,
// };
