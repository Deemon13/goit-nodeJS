const fs = require("fs");
const path = require("path");
const { uuid } = require("uuidv4");

const contactsPath = path.join(__dirname, "./db/contacts.json");

const { promises: fsPromises } = fs;

function listContacts() {
  return fsPromises
    .readFile(contactsPath, "utf-8")
    .then((response) => JSON.parse(response))
    .then((data) => console.table(data))
    .catch((error) => error);
}

function getContactById(contactId) {
  return fsPromises
    .readFile(contactsPath, "utf-8")
    .then((response) => JSON.parse(response))
    .then((data) => console.table(data.filter((item) => item.id === contactId)))
    .catch((error) => error);
}

function removeContact(contactId) {
  return fsPromises
    .readFile(contactsPath, "utf-8")
    .then((response) => JSON.parse(response))
    .then((data) => data.filter((item) => item.id !== contactId))
    .then((newData) =>
      fsPromises
        .writeFile(contactsPath, JSON.stringify(newData))
        .then(listContacts())
        .catch((err) => err)
    )
    .catch((error) => error);
}

function addContact(name, email, phone) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((response) => JSON.parse(response))
    .then((data) => {
      data.push({
        id: uuid(),
        name,
        email,
        phone,
      });
      return data;
    })
    .then((newData) =>
      fsPromises
        .writeFile(contactsPath, JSON.stringify(newData))
        .then(listContacts())
        .catch((err) => err)
    )
    .catch((error) => error);
}

module.exports = { listContacts, getContactById, removeContact, addContact };
