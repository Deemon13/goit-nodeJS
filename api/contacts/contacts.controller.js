import Joi from 'joi';
import { contactModel } from './contacts.model';
import { NotFound } from '../helpers/error.constructors';
import { createControllerProxy } from '../helpers/controllerProxy';

async function listContacts(req, res, next) {
  try {
    const filterQuery = req.query.sub;
    console.log('filterQuery:', filterQuery);
    const pageQuery = Number(req.query.page);
    const limitQuery = Number(req.query.limit);
    const contacts = await contactModel.findAllContacts(pageQuery, limitQuery);
    if (filterQuery) {
      const foundContacts = await contactModel.findContactsBySubscription(
        filterQuery,
      );
      return res.status(200).json(foundContacts);
    }
    return res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { contactId } = req.params;
    const foundContact = await this.getContactByIdOrThrow(contactId);

    return res.status(200).send(foundContact);
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
    const { contactId } = req.params;
    await this.getContactByIdOrThrow(contactId);

    const updatedContact = contactModel.updateContactById(contactId, req.body);

    return res.status(200).json(updatedContact.value);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    await this.getContactByIdOrThrow(contactId);

    await contactModel.removeContactById(contactId);
    const message = 'contact deleted';
    return res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

async function getContactByIdOrThrow(checkId) {
  const contactFound = await contactModel.findContactById(checkId);
  if (!contactFound) {
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
  getContactByIdOrThrow,
  getById,
  validateAddContact,
  addContact,
  removeContact,
  validateUpdateContact,
  updateContact,
});
