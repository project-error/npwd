import { config } from '../config';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { AudioRequest, AudioResponse } from '../../../typings/audio';
import { audioLogger } from './audio.utils';
import fetch, { FormData, fileFromSync } from 'node-fetch';
import * as fs from 'fs';

class _AudioService {
  async uploadAudio(reqObj: PromiseRequest<AudioRequest>, resp: PromiseEventResp<AudioResponse>) {
    const uploadToken = GetConvar('NPWD_AUDIO_TOKEN', '');

    if (!uploadToken) {
      audioLogger.error('Could not find upload token for audio! Please add the token the convar.');
      return resp({ status: 'error', errorMsg: 'No upload token found!' });
    }

    fs.writeFileSync(
      'recording.ogg',
      Buffer.from(reqObj.data.file.replace('data:audio/ogg;base64,', ''), 'base64'),
    );

    try {
      const form_data = new FormData();
      const blob = fileFromSync('./recording.ogg', 'audio/ogg');
      form_data.append('recording', blob);

      const res = await fetch(config.voiceMessage.url, {
        method: 'POST',
        headers: {
          [config.voiceMessage.authorizationHeader]: uploadToken,
        },
        body: form_data,
      });

      if (res.status !== 200) {
        const errorText = await res.text();
        audioLogger.error(`Failed to upload audio. Error: ${errorText}`);
        return resp({ status: 'error', errorMsg: 'Failed to upload audio' });
      }

      const response: any = await res.json();

      let recordingUrl = '';
      for (const index of config.voiceMessage.returnedDataIndexes) {
        recordingUrl = response[index] as string;
      }

      resp({ status: 'ok', data: { url: recordingUrl } });
    } catch (err) {
      console.error('Error when trying to upload image', err.message);
      resp({ status: 'error', errorMsg: 'Failed to upload audio' });
    }
  }
}

const AudioService = new _AudioService();
export default AudioService;
