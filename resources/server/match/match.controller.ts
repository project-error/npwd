import { Like, MatchEvents, Profile } from '../../../typings/match';
import MatchService from './match.service';
import { getSource } from '../utils/miscUtils';
import { matchLogger } from './match.utils';
import { config } from '../server';

onNet(MatchEvents.INITIALIZE, () => {
  const _source = getSource();
  MatchService.handleInitialize(_source).catch((e) =>
    matchLogger.error(`Error occurred in initialize event (${_source}), Error: ${e.message}`),
  );
});

onNet(MatchEvents.CREATE_MY_PROFILE, (profile: Profile) => {
  const _source = getSource();
  MatchService.handleCreateMyProfile(_source, profile).catch((e) =>
    matchLogger.error(`Error occurred in createMyProfile event (${_source}), Error: ${e.message}`),
  );
});

onNet(MatchEvents.UPDATE_MY_PROFILE, (profile: Profile) => {
  const _source = getSource();
  MatchService.handleUpdateMyProfile(_source, profile).catch((e) =>
    matchLogger.error(`Error occurred in updateMyProfile event (${_source}), Error: ${e.message}`),
  );
});

onNet(MatchEvents.SAVE_LIKES, (likes: Like[]) => {
  const _source = getSource();
  MatchService.handleSaveLikes(_source, likes).catch((e) =>
    matchLogger.error(`Error occurred in saveLikes event (${_source}), Error: ${e.message}`),
  );
});

onNet(MatchEvents.GET_MATCHES, () => {
  const _source = getSource();
  MatchService.handleGetMatches(_source).catch((e) =>
    matchLogger.error(`Error occurred in getMatches event (${_source}), Error: ${e.message}`),
  );
});

if (!config.match.allowEditableProfileName && !config.match.generateProfileNameFromUsers) {
  const warning =
    `Both allowEdtiableProfileName and generateProfileNameFromUsers ` +
    `are set false - this means users will likely not have profile names ` +
    `for the Match App and won't be able to use it!`;
  matchLogger.warn(warning);
}
