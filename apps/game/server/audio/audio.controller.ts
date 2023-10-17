import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import { AudioEvents, AudioRequest, AudioResponse } from '@typings/audio';
import AudioService from './audio.service';
import { audioLogger } from './audio.utils';

onNetPromise<AudioRequest, AudioResponse>(AudioEvents.UPLOAD_AUDIO, (reqObj, resp) => {
  AudioService.uploadAudio(reqObj, resp).catch((e) => {
    audioLogger.error(
      `Error occurred in audio upload event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});
