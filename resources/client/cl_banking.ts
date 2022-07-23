import { BankingEvents } from '../../typings/banking';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(BankingEvents.GET_ACCOUNTS);
RegisterNuiProxy(BankingEvents.TRANSFER_MONEY);
RegisterNuiProxy(BankingEvents.GET_TRANSACTIONS);
