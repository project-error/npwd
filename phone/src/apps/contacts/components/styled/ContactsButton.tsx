import { Button, withStyles } from '@material-ui/core';
import { ButtonStyles } from '../../../../ui/helpers/customStyles';
import { CONTACTS_APP_BG_COLOR, CONTACTS_APP_COLOR } from '../../constants';

export const ContactsButton = withStyles(
  ButtonStyles(CONTACTS_APP_COLOR, CONTACTS_APP_BG_COLOR)
)(Button);
