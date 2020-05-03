import { Router } from 'express';
import { contactController } from './contacts.controller';

const router = Router();

router.post(
  '/',
  contactController.validateAddContact,
  contactController.addContact,
);

router.get('/', contactController.listContacts);

router.get('/:contactId', contactController.getById);

router.put(
  '/:contactId',
  contactController.validateUpdateContact,
  contactController.updateContact,
);

router.delete('/:contactId', contactController.removeContact);

export const contactsRouter = router;
