// @ts-ignore
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import {
  AnimationModel,
  AudioEventArguments,
  AudioTypes,
  EmergencyEvents,
} from '@typings/emergency';
import { DispatchIntro } from '@os/emergency/config';
import { EmergencyChoice } from '@os/emergency/components/EmergencyChoice';
import React from 'react';

export const hangup = function (history) {
  fetchNui<ServerPromiseResp<AudioEventArguments>>(EmergencyEvents.PLAY_AUDIO, {
    type: AudioTypes.END_CALL,
  }).then(() => {
    history.replace('/');
  });
  fetchNui<ServerPromiseResp<AnimationModel>>(EmergencyEvents.ANIMATION, {
    isCalling: false,
  });
};
