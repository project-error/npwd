import { config } from '../config';
import { Contact, ContactDeleteDTO, ContactEvents, PreDBContact, ContactPay } from '@typings/contact';
import PlayerService from '../players/player.service';
import ContactService from './contacts.service';
import { contactsLogger } from './contacts.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
const exps = global.exports;

onNetPromise<ContactPay, Contact>(ContactEvents.PAY_CONTACT, (reqObj, resp) => {
  PlayerService.getIdentifierByPhoneNumber(reqObj.data.number, true).then((response) => {
    const resourceExport = exps[config.contacts.payResource ?? ''];
    if (resourceExport) {
      //dont wait for a response.. devs can add their own "notification" triggers in their exports if they wish
      exps[config.contacts.payResource][config.contacts.payFunction](reqObj.source, response, reqObj.data.amount)
    } else {
      contactsLogger.error(`No such resource exists for ${config.contacts.payResource} (${reqObj.source})`);
      return resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    }
    resp({ status: 'ok', errorMsg: '' });
  }).catch((e) => {
    contactsLogger.error(
      `Error occured in fetch identifier by phone event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  })
});

onNetPromise<void, Contact[]>(ContactEvents.GET_CONTACTS, (reqObj, resp) => {
  ContactService.handleFetchContacts(reqObj, resp).catch((e) => {
    contactsLogger.error(
      `Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<PreDBContact, Contact>(ContactEvents.ADD_CONTACT, (reqObj, resp) => {
  ContactService.handleAddContact(reqObj, resp).catch((e) => {
    contactsLogger.error(
      `Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<Contact, void>(ContactEvents.UPDATE_CONTACT, (reqObj, resp) => {
  ContactService.handleUpdateContact(reqObj, resp).catch((e) => {
    contactsLogger.error(
      `Error occured in update contact event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<ContactDeleteDTO, void>(ContactEvents.DELETE_CONTACT, (reqObj, resp) => {
  ContactService.handleDeleteContact(reqObj, resp).catch((e) => {
    contactsLogger.error(
      `Error occured in delete contact event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});
