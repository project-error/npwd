import { config } from '../config';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { AudioRequest, AudioResponse } from '../../../typings/audio';
import { audioLogger } from './audio.utils';
import fetch, { FormData, fileFromSync } from 'node-fetch';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const path = GetResourcePath('npwd') + '/uploads';

class _AudioService {
  private readonly TOKEN: string;

  constructor() {
    this.TOKEN = GetConvar('NPWD_AUDIO_TOKEN', '');
  }

  async uploadAudio(reqObj: PromiseRequest<AudioRequest>, resp: PromiseEventResp<AudioResponse>) {
    if (!this.TOKEN) {
      audioLogger.error('Could not find upload token for audio! Please add the token the convar.');
      return resp({ status: 'error', errorMsg: 'No upload token found!' });
    }

    if (!fs.existsSync(path)) fs.mkdirSync(path);
    const filePath = `${path}/recording-${uuidv4()}.ogg`;

    fs.writeFileSync(
      filePath,
      Buffer.from(reqObj.data.file.replace('data:audio/ogg;base64,', ''), 'base64'),
    );

    try {
      const form_data = new FormData();
      const blob = fileFromSync(filePath, 'audio/ogg');
      form_data.append('recording', blob);

      const res = await fetch(config.voiceMessage.url, {
        method: 'POST',
        headers: {
          [config.voiceMessage.authorizationHeader]: this.TOKEN,
        },
        body: form_data,
      });

      fs.rmSync(filePath);

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
