import { Router } from 'fivem-router';
import ContactService from '../services/ContactService';
import { z } from 'zod';
import { handleError } from '../utils/errors';

export const contactsRouter = new Router({
  prefix: '/contacts',
});

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  phoneNumber: z.string().min(2).max(15),
});

const contactIdSchema = z.object({
  contactId: z.coerce.number(),
});

contactsRouter.add('/:contactId', async (ctx, next) => {
  try {
    const { contactId } = contactIdSchema.parse(ctx.params);
    const contact = await ContactService.getContactById(ctx, contactId);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: contact,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

contactsRouter.add('/add', async (ctx, next) => {
  try {
    const { name, phoneNumber } = contactSchema.parse(ctx.request.body);
    const contact = await ContactService.addContact(ctx, name, phoneNumber);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: contact,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

contactsRouter.add('/all', async (ctx, next) => {
  try {
    const contacts = await ContactService.getContacts(ctx);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: contacts,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

contactsRouter.add('/:contactId/update', async (ctx, next) => {
  try {
    const { contactId } = contactIdSchema.parse(ctx.params);
    const { name, phoneNumber } = contactSchema.parse(ctx.request.body);
    const contact = await ContactService.updateContact(ctx, contactId, name, phoneNumber);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: contact,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

contactsRouter.add('/:contactId/delete', async (ctx, next) => {
  try {
    const { contactId } = contactIdSchema.parse(ctx.params);
    await ContactService.deleteContact(ctx, contactId);

    ctx.status = 200;
    ctx.body = {
      ok: true,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});
