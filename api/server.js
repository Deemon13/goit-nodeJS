import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import { contactsRouter } from './contacts/contacts.router';
import { authRouter } from './auth/auth.router';

const PORT = 3000;

export class CrudServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    await this.initDatabase();
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

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_DB_URL);
      console.log('Database connection successful');
    } catch (err) {
      console.log('Database connection error', err);
      process.exit(1);
    }
  }

  initRoutes() {
    this.server.use('/contacts', contactsRouter);
    this.server.use('/auth', authRouter);
  }

  handleErrors() {
    this.server.use((err, req, res, next) => {
      delete err.stack;

      return res.status(err.status).send(`message: ${err.message}`);
    });
  }

  startListening() {
    this.server.listen(PORT, () => {
      console.log('Server started listening on port', PORT);
    });
  }
}
