import { GalleryPhoto, PhotoEvents } from '../../typings/photo';
import { Delay } from '../utils/fivem';
import { sendCameraEvent, sendMessage } from '../utils/messages';
import { PhoneEvents } from '../../typings/phone';
import { ClUtils } from './client';
import { animationService } from './animations/animation.controller';
import { RegisterNuiProxy } from './cl_utils';

const SCREENSHOT_BASIC_TOKEN = GetConvar('SCREENSHOT_BASIC_TOKEN', 'none');

const exp = (global as any).exports;

let inCameraMode = false;

function closePhoneTemp() {
  SetNuiFocus(false, false);
  sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, false);
}

function openPhoneTemp() {
  SetNuiFocus(true, true);
  sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, true);
}

function CellFrontCamActivate(activate: boolean) {
  return Citizen.invokeNative('0x2491A93618B7D838', activate);
}

const displayHelperText = () => {
  BeginTextCommandDisplayHelp('TWOSTRINGS');
  AddTextComponentString('Exit Camera Mode: ~INPUT_CELLPHONE_CANCEL~');
  AddTextComponentString('Toggle Front/Back: ~INPUT_PHONE~');
  EndTextCommandDisplayHelp(0, true, false, -1);
};

RegisterNuiCallbackType(PhotoEvents.TAKE_PHOTO);
on(`__cfx_nui:${PhotoEvents.TAKE_PHOTO}`, async (data: any, cb: Function) => {
  /*cb();*/
  await animationService.openCamera();
  emit('npwd:disableControlActions', false);
  // Create Phone Prop
  let frontCam = false;
  CreateMobilePhone(1);
  // Active Camera Change
  CellCamActivate(true, true);
  // Hide phone from rendering temporary
  closePhoneTemp();

  SetNuiFocus(false, false);

  inCameraMode = true;

  while (inCameraMode) {
    await Delay(0);
    if (IsControlJustPressed(1, 27)) {
      frontCam = !frontCam;
      CellFrontCamActivate(frontCam);
    } else if (IsControlJustPressed(1, 176)) {
      const resp = await handleTakePicture();

      cb(resp);
    } else if (IsControlJustPressed(1, 177)) {
      handleCameraExit();
      break;
    }
    displayHelperText();
  }
  ClearHelp(true);
  emit('npwd:disableControlActions', true);
  await animationService.closeCamera();
});

const handleTakePicture = async () => {
  // Wait a frame so we don't draw the display helper text
  await Delay(0);
  const resp = await takePhoto();
  await Delay(200);
  DestroyMobilePhone();
  CellCamActivate(false, false);
  openPhoneTemp();
  inCameraMode = false;

  return resp;
};

const handleCameraExit = () => {
  DestroyMobilePhone();
  CellCamActivate(false, false);
  openPhoneTemp();
  sendCameraEvent(PhotoEvents.TAKE_PHOTO_SUCCESS, false);
  inCameraMode = false;
};

onNet(PhotoEvents.SEND_PHOTOS, (photos: string[]) => {
  sendCameraEvent(PhotoEvents.SEND_PHOTOS, photos);
});

const takePhoto = () =>
  new Promise((res, rej) => {
    // Return and log error if screenshot basic token not found
    if (SCREENSHOT_BASIC_TOKEN === 'none') {
      return console.error('Screenshot basic token not found. Please set in server.cfg');
    }
    exp['screenshot-basic'].requestScreenshotUpload(
      'https://api.imgur.com/3/image',
      'imgur',
      {
        headers: {
          authorization: `Client-ID ${SCREENSHOT_BASIC_TOKEN}`,
          'content-type': 'multipart/form-data',
        },
      },
      async (data: any) => {
        try {
          const imageLink = JSON.parse(data).data.link;

          const resp = await ClUtils.emitNetPromise(PhotoEvents.UPLOAD_PHOTO, imageLink);
          console.log('export shit', resp);
          res(resp);
        } catch (e) {
          rej(e.message);
        }
      },
    );
  });

RegisterNuiProxy(PhotoEvents.FETCH_PHOTOS);

RegisterNuiCallbackType(PhotoEvents.DELETE_PHOTO);
on(`__cfx_nui:${PhotoEvents.DELETE_PHOTO}`, async (data: GalleryPhoto, cb: Function) => {
  console.log('my data', data);
  /*emitNet(PhotoEvents.DELETE_PHOTO, data);*/
  const resp = await ClUtils.emitNetPromise(PhotoEvents.DELETE_PHOTO, data);
  cb(resp);
});
