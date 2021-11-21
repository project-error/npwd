import { PhotoEvents } from '../../typings/photo';
import { Delay } from '../utils/fivem';
import { sendCameraEvent, sendMessage } from '../utils/messages';
import { PhoneEvents } from '../../typings/phone';
import { ClUtils, config } from './client';
import { animationService } from './animations/animation.controller';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';

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

RegisterNuiCB<void>(PhotoEvents.TAKE_PHOTO, async (_, cb) => {
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
      if (SCREENSHOT_BASIC_TOKEN !== 'none') {
        const resp = await handleTakePicture();
        cb(resp);
        break;
      }
      console.error(
        'You may be trying to take a photo, but your token is not setup for upload! See NPWD Docs for more info!',
      );
    } else if (IsControlJustPressed(1, 177)) {
      await handleCameraExit();
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
  DestroyMobilePhone();
  CellCamActivate(false, false);
  openPhoneTemp();
  const resp = await takePhoto();
  await Delay(200);
  inCameraMode = false;
  ClearHelp(true);

  animationService.openPhone();
  return resp;
};

const handleCameraExit = async () => {
  ClearHelp(true);
  animationService.closeCamera();
  emit('npwd:disableControlActions', true);
  DestroyMobilePhone();
  CellCamActivate(false, false);
  openPhoneTemp();
  sendCameraEvent(PhotoEvents.TAKE_PHOTO_SUCCESS, false);
  inCameraMode = false;

  await animationService.openCamera();
};

const takePhoto = () =>
  new Promise((res, rej) => {
    // Return and log error if screenshot basic token not found
    if (SCREENSHOT_BASIC_TOKEN === 'none' && config.images.useAuthorization) {
      return console.error('Screenshot basic token not found. Please set in server.cfg');
    }
    exp['screenshot-basic'].requestScreenshotUpload(
      config.images.url,
      config.images.type,
      {
        encoding: config.images.imageEncoding,
        headers: {
          authorization: config.images.useAuthorization ? `${config.images.authorizationPrefix} ${SCREENSHOT_BASIC_TOKEN}` : undefined,
          'content-type': config.images.contentType,
        },
      },
      async (data: any) => {
        try {
          let parsedData = JSON.parse(data);
          for (const index of config.images.returnedDataIndexes)
            parsedData = parsedData[index];
          const resp = await ClUtils.emitNetPromise(PhotoEvents.UPLOAD_PHOTO, parsedData);
          res(resp);
        } catch (e) {
          rej(e.message);
        }
      },
    );
  });

RegisterNuiProxy(PhotoEvents.FETCH_PHOTOS);
RegisterNuiProxy(PhotoEvents.DELETE_PHOTO);
