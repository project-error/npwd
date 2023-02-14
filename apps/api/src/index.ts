import './database/data-source';
import express from 'express';
import { ContactService } from './contacts/contact-service';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const contactService = new ContactService();

app.post('/npwd-contact-getAll', async (req, res) => {
  const contacts = await contactService.getContacts();
  res.send({ status: 'ok', data: contacts });
});

app.post('/npwd-contact-add', async (req, res) => {
  const contact = req.body;
  const newContact = await contactService.addContact(contact);

  res.json({ status: 'ok', data: newContact });
});

app.listen(6001, () => console.log('Server is running'));
