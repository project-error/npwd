import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';

import Nui from '../../../../os/nui-events/utils/Nui';
import { useProfile } from '../../hooks/useProfile';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';

interface IProps {
  defaultProfileNames: string[];
  updateEvent: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '15px',
  },
  formControl: {
    // margin: theme.spacing(1),
    width: '100%',
  },
}));

export function DefaultProfilePrompt({ defaultProfileNames, updateEvent }: IProps): JSX.Element {
  const classes = useStyles();
  const { t } = useTranslation();
  const { profile } = useProfile();

  const hasDefaults = defaultProfileNames.length > 0;
  const defaultProfileName = hasDefaults ? defaultProfileNames[0] : '';

  const [profileName, setProfileName] = useState(defaultProfileName);

  const handleUpdate = () => {
    const data = {
      ...profile,
      profile_name: profileName,
    };
    Nui.send(updateEvent, data);
  };

  const handleChange = (event: React.ChangeEvent<any>): void => {
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
          {defaultProfileNames.map((profileName) => (
            <option value={profileName}>{profileName}</option>
          ))}
        </Select>
      </FormControl>
      <ProfileUpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default DefaultProfilePrompt;
