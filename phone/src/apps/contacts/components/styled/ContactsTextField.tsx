import { TextField, withStyles } from '@material-ui/core';
import { TextFieldStyles } from '../../../../ui/helpers/customStyles';
import { CONTACTS_APP_BG_COLOR } from '../../constants';

export const ContactsTextField = withStyles(
  TextFieldStyles(CONTACTS_APP_BG_COLOR)
)(TextField);
