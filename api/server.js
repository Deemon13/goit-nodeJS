import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { contactsRouter } from './contacts/contacts.router';

const PORT = 3000;

export class CrudServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddleware();
    this.initDatabase();
    this.initRoutes();
    this.handleErrors();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
    this.server.use(cors({ origin: 'http://localhost:3000' }));
    this.server.use(morgan('tiny'));
  }

  initRoutes() {
    this.server.use('/contacts', contactsRouter);
  }

  handleErrors() {
    this.server.use((err, req, res, next) => {
      delete err.stack;

      return res.status(err.status).send(`message: ${err.message}`);
    });
  }

  initDatabase() {}

  startListening() {
    this.server.listen(PORT, () => {
      console.log('Server started listening on port', PORT);
    });
  }
}
