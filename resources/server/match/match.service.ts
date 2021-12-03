import { formatMatches, formatProfile, matchLogger } from './match.utils';
import MatchDB, { _MatchDB } from './match.db';
import {
  FormattedMatch,
  FormattedProfile,
  Like,
  MatchEvents,
  Profile,
} from '../../../typings/match';
import PlayerService from '../players/player.service';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';

class _MatchService {
  private readonly matchDB: _MatchDB;

  constructor() {
    this.matchDB = MatchDB;
    matchLogger.debug('Match service started');
  }

  async handleGetProfiles(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<FormattedProfile[]>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const profiles = await this.dispatchProfiles(identifier);
      resp({ status: 'ok', data: profiles });
    } catch (e) {
      matchLogger.error(`Error in handleGetProfiles, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleGetMyProfile(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<FormattedProfile>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const profile = await this.dispatchPlayerProfile(identifier);
      resp({ status: 'ok', data: profile });
    } catch (e) {
      matchLogger.error(`Error in handleGetMyProfile, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleSaveLikes(reqObj: PromiseRequest<Like[]>, resp: PromiseEventResp<boolean>) {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    matchLogger.debug(`Saving likes for identifier ${identifier}`);

    try {
      await this.matchDB.saveLikes(identifier, reqObj.data);
    } catch (e) {
      matchLogger.error(`Failed to save likes, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }

    try {
      const newMatches = await this.matchDB.findNewMatches(identifier, reqObj.data);
      if (newMatches.length > 0) {
        resp({ status: 'ok', data: true });
      }
    } catch (e) {
      matchLogger.error(`Failed to find new matches, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleGetMatches(reqObj: PromiseRequest<void>, resp: PromiseEventResp<FormattedMatch[]>) {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const matchedProfiles = await this.matchDB.findAllMatches(identifier);
      const formattedMatches = matchedProfiles.map(formatMatches);
      resp({ status: 'ok', data: formattedMatches });
    } catch (e) {
      matchLogger.error(`Failed to retrieve matches, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleCreateMyProfile(
    reqObj: PromiseRequest<Profile>,
    resp: PromiseEventResp<FormattedProfile>,
  ) {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const profile = reqObj.data;

    matchLogger.debug(`Creating profile for identifier: ${identifier}`);
    matchLogger.debug(profile);

    try {
      if (!profile.name || !profile.name.trim()) {
        throw new Error('Profile name must not be blank');
      }

      const newProfile = await this.matchDB.createProfile(identifier, profile);
      const formattedProfile = formatProfile(newProfile);

      resp({ status: 'ok', data: formattedProfile });
    } catch (e) {
      matchLogger.error(`Failed to update profile for identifier ${identifier}, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleUpdateMyProfile(
    reqObj: PromiseRequest<Profile>,
    resp: PromiseEventResp<FormattedProfile>,
  ) {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const profile = reqObj.data;

    matchLogger.debug(`Updating profile for identifier: ${identifier}`);
    matchLogger.debug(profile);

    try {
      if (!profile.name || !profile.name.trim()) {
        throw new Error('Profile name must not be blank');
      }

      const updatedProfile = await this.matchDB.updateProfile(identifier, profile);
      const formattedProfile = formatProfile(updatedProfile);

      resp({ status: 'ok', data: formattedProfile });
    } catch (e) {
      matchLogger.error(`Failed to update profile for identifier ${identifier}, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async dispatchPlayerProfile(identifier: string): Promise<FormattedProfile> {
    try {
      const profile = await this.matchDB.getOrCreateProfile(identifier);
      return formatProfile(profile);
    } catch (e) {
      matchLogger.error(`Failed to get player profile, ${e.message}`);
    }
  }

  async dispatchProfiles(identifier: string): Promise<FormattedProfile[]> {
    try {
      const profiles = await this.matchDB.getPotentialProfiles(identifier);
      return profiles.map(formatProfile);
    } catch (e) {
      matchLogger.error(`Failed to retrieve profiles, ${e.message}`);
    }
  }

  async handleInitialize(src: number) {
    const identifier = PlayerService.getIdentifier(src);
    matchLogger.debug(`Initializing match for identifier: ${identifier}`);
    await this.matchDB.updateLastActive(identifier);
  }
}

const MatchService = new _MatchService();

export default MatchService;
