import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';

import ProfileUpdateButton from '../buttons/ProfileUpdateButton';

interface IProps {
  handleUpdate: () => void;
  profileName: string;
  setProfileName: (name: string) => void;
  defaultProfileNames: string[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '15px',
  },
  formControl: {
    width: '100%',
  },
}));

export function DefaultProfilePrompt({
  profileName,
  setProfileName,
  handleUpdate,
  defaultProfileNames,
}: IProps): JSX.Element {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<any>): void => {
    event.preventDefault();
    setProfileName(event.target.value);
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="profile-name">
          {t('APPS_TWITTER_EDIT_DEFAULT_PROFILE_NAME')}
        </InputLabel>
        <Select
          value={profileName}
          onChange={handleChange}
          inputProps={{
            name: 'profileName',
            id: 'profile-name',
          }}
        >
          <option value="" />
          {defaultProfileNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      </FormControl>
      <ProfileUpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default DefaultProfilePrompt;
