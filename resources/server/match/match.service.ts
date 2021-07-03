import { matchLogger } from './match.utils';
import MatchDB, { _MatchDB } from './match.db';
import { Like, MatchEvents, Profile } from '../../../typings/match';
import PlayerService from '../players/player.service';

class _MatchService {
  private readonly matchDB: _MatchDB;
  constructor() {
    this.matchDB = MatchDB;
    matchLogger.debug('Match service started');
  }

  async dispatchPlayerProfile(identifier: string, source: number): Promise<void> {
    try {
      const profile = await this.matchDB.getOrCreateProfile(identifier);
      emitNet(MatchEvents.GET_MY_PROFILE_SUCCESS, source, profile);
    } catch (e) {
      matchLogger.error(`Failed to get player profile, ${e.message}`);
      emitNet(MatchEvents.GET_MY_PROFILE_FAILED, source, {
        message: 'APPS_MATCH_GET_MY_PROFILE_FAILED',
        type: 'error',
      });
    }
  }

  async dispatchProfiles(identifier: string, source: number): Promise<void> {
    try {
      const profiles = await this.matchDB.getPotentialProfiles(identifier);
      emitNet(MatchEvents.GET_PROFILES_SUCCESS, source, profiles);
    } catch (e) {
      matchLogger.error(`Failed to retrieve profiles, ${e.message}`);
      emitNet(MatchEvents.GET_PROFILES_FAILED, source, {
        message: 'APPS_MATCH_GET_PROFILES_FAILED',
        type: 'error',
      });
    }
  }

  async handleInitialize(src: number) {
    const identifier = PlayerService.getIdentifier(src);
    matchLogger.debug(`Initializing match for identifier: ${identifier}`);

    await this.dispatchPlayerProfile(identifier, src);
    await this.dispatchProfiles(identifier, src);
    await this.matchDB.updateLastActive(identifier);
  }

  async handleCreateMyProfile(src: number, profile: Profile) {
    const identifier = PlayerService.getIdentifier(src);

    matchLogger.debug(`Creating profile for identifier: ${identifier}`);
    matchLogger.debug(profile);

    try {
      if (!profile.name || !profile.name.trim()) {
        throw new Error('Profile name must not be blank');
      }

      const newProfile = await this.matchDB.createProfile(identifier, profile);
      emitNet(MatchEvents.CREATE_MY_PROFILE_SUCCESS, src, newProfile);
    } catch (e) {
      matchLogger.error(`Failed to update profile for identifier ${identifier}, ${e.message}`);
      emitNet(MatchEvents.CREATE_MY_PROFILE_FAILED, src, {
        message: 'APPS_MATCH_CREATE_PROFILE_FAILED',
        type: 'error',
      });
    }
  }

  async handleUpdateMyProfile(src: number, profile: Profile) {
    const identifier = PlayerService.getIdentifier(src);
    matchLogger.debug(`Updating profile for identifier: ${identifier}`);
    matchLogger.debug(profile);

    try {
      if (!profile.name || !profile.name.trim()) {
        throw new Error('Profile name must not be blank');
      }

      const updatedProfile = await this.matchDB.updateProfile(identifier, profile);
      emitNet(MatchEvents.UPDATE_MY_PROFILE_SUCCESS, src, updatedProfile);
    } catch (e) {
      matchLogger.error(`Failed to update profile for identifier ${identifier}, ${e.message}`);
      emitNet(MatchEvents.UPDATE_MY_PROFILE_FAILED, src, {
        message: 'APPS_MATCH_UPDATE_PROFILE_FAILED',
        type: 'error',
      });
    }
  }

  async handleSaveLikes(src: number, likes: Like[]) {
    const identifier = PlayerService.getIdentifier(src);
    matchLogger.debug(`Saving likes for identifier ${identifier}`);

    try {
      await this.matchDB.saveLikes(identifier, likes);
    } catch (e) {
      matchLogger.error(`Failed to save likes, ${e.message}`);
      emitNet(MatchEvents.SAVE_LIKES_FAILED, src, {
        message: 'APPS_MATCH_SAVE_LIKES_FAILED',
        type: 'error',
      });
    }

    try {
      const newMatches = await this.matchDB.findNewMatches(identifier, likes);
      if (newMatches.length > 0) {
        emitNet(MatchEvents.NEW_MATCH, src, {
          message: 'APPS_MATCH_NEW_LIKE_FOUND',
          type: 'info',
        });
      }
    } catch (e) {
      matchLogger.error(`Failed to find new matches, ${e.message}`);
    }
  }

  async handleGetMatches(src: number) {
    const identifier = PlayerService.getIdentifier(src);

    try {
      const matchedProfiles = await this.matchDB.findAllMatches(identifier);
      emitNet(MatchEvents.GET_MATCHES_SUCCESS, src, matchedProfiles);
    } catch (e) {
      matchLogger.error(`Failed to retrieve matches, ${e.message}`);
      emitNet(MatchEvents.GET_MATCHES_FAILED, src, {
        message: 'APPS_MATCH_GET_MATCHES_FAILED',
        type: 'error',
      });
    }
  }
}

const MatchService = new _MatchService();

export default MatchService;
