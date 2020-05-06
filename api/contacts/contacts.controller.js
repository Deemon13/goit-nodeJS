import Joi from 'joi';
import { uuid } from 'uuidv4';
import fs from 'fs';
import path from 'path';
import { NotFound } from '../helpers/error.constructors';
import { createControllerProxy } from '../helpers/controllerProxy';

const contactsPath = path.join(__dirname, '../../db/contacts.json');

const { promises: fsPromises } = fs;

async function listContacts(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const contactsDB = JSON.parse(contacts);
    return res.status(200).send(contactsDB);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const contactsDB = JSON.parse(contacts);

    const { contactId } = req.params;
    const foundContact = getContactFromArray(contactId, contactsDB);

    return res.status(200).json(foundContact);
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const contactsDB = JSON.parse(contacts);

    const contactId = uuid();

    const newContact = {
      contactId,
      ...req.body,
    };
    contactsDB.push(newContact);

    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsDB));
    return res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const contactsDB = JSON.parse(contacts);
    const { contactId } = req.params;

    const foundContact = getContactFromArray(contactId, contactsDB);
    const foundContactIndex = getContactIndexFromArray(contactId, contactsDB);

    const updatedContact = { ...foundContact, ...req.body };
    contactsDB[foundContactIndex] = updatedContact;

    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsDB));
    return res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const contactsDB = JSON.parse(contacts);
    const { contactId } = req.params;

    const message = 'contact deleted';
    const foundContactIndex = getContactIndexFromArray(contactId, contactsDB);
    contactsDB.splice(foundContactIndex, 1);

    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsDB));
    return res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

function getContactFromArray(foundContactId, db) {
  const foundContact = db.find(item => item.contactId === foundContactId);
  if (!foundContact) {
    throw new NotFound('Not found');
  }
  return foundContact;
}

function getContactIndexFromArray(foundContactId, db) {
  const foundContact = db.findIndex(item => item.contactId === foundContactId);
  if (foundContact === -1) {
    throw new NotFound('Not found');
  }
  return foundContact;
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
