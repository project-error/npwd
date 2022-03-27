import {
  FormattedMatch,
  FormattedProfile,
  Like,
  MatchEvents,
  Profile,
} from '../../../typings/match';
import MatchService from './match.service';
import { getSource } from '../utils/miscUtils';
import { matchLogger } from './match.utils';
import { config } from '../config';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<void, FormattedProfile[]>(MatchEvents.GET_PROFILES, (reqObj, resp) => {
  MatchService.handleGetProfiles(reqObj, resp).catch((e) => {
    matchLogger.error(
      `Error occurred in fetch profiles event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<void, FormattedProfile>(MatchEvents.GET_MY_PROFILE, (reqObj, resp) => {
  MatchService.handleGetMyProfile(reqObj, resp).catch((e) => {
    matchLogger.error(
      `Error occurred in fetch my profile event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<void, FormattedMatch[]>(MatchEvents.GET_MATCHES, (reqObj, resp) => {
  MatchService.handleGetMatches(reqObj, resp).catch((e) => {
    matchLogger.error(
      `Error occurred in fetch matches event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<Like, boolean>(MatchEvents.SAVE_LIKES, (reqObj, resp) => {
  MatchService.handleSaveLikes(reqObj, resp).catch((e) => {
    matchLogger.error(`Error occurred in save likes event (${reqObj.source}), Error: ${e.message}`);
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<Profile, FormattedProfile>(MatchEvents.CREATE_MY_PROFILE, (reqObj, resp) => {
  MatchService.handleCreateMyProfile(reqObj, resp).catch((e) => {
    matchLogger.error(
      `Error occurred in create my profile event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<Profile, FormattedProfile>(MatchEvents.UPDATE_MY_PROFILE, (reqObj, resp) => {
  MatchService.handleUpdateMyProfile(reqObj, resp).catch((e) => {
    matchLogger.error(
      `Error occurred in update my profile event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNet(MatchEvents.INITIALIZE, () => {
  const _source = getSource();
  MatchService.handleInitialize(_source).catch((e) =>
    matchLogger.error(`Error occurred in initialize event (${_source}), Error: ${e.message}`),
  );
});

if (!config.match.allowEditableProfileName && !config.match.generateProfileNameFromUsers) {
  const warning =
    `Both allowEdtiableProfileName and generateProfileNameFromUsers ` +
    `are set false - this means users will likely not have profile names ` +
    `for the Match App and won't be able to use it!`;
  matchLogger.warn(warning);
}
