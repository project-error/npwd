import { PhotoEvents } from '../../typings/photo';
import { Delay } from '../utils/fivem';
import { sendCameraEvent, sendMessage } from '../utils/messages';
import { PhoneEvents } from '../../typings/phone';
import { ClUtils } from './client';
import { config } from './cl_config';
import { animationService } from './animations/animation.controller';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';

const SCREENSHOT_BASIC_TOKEN = GetConvar('SCREENSHOT_BASIC_TOKEN', 'none');
const exp = global.exports;

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

// TODO: The flow here seems a little convuluted, we need to take a look at it.
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

  // We want to emit this event for UI handling in other resources
  // We hide nothing in NPWD by default
  emit(PhotoEvents.NPWD_PHOTO_MODE_STARTED);

  while (inCameraMode) {
    await Delay(0);
    // Arrow Up Key, Toggle Front/Back Camera
    if (IsControlJustPressed(1, 27)) {
      frontCam = !frontCam;
      CellFrontCamActivate(frontCam);
      // Enter Key, Take Photo
    } else if (IsControlJustPressed(1, 176)) {
      const resp = await handleTakePicture();
      cb(resp);
      break;
    } else if (IsControlJustPressed(1, 194)) {
      await handleCameraExit();
      break;
    }
    displayHelperText();
  }

  ClearHelp(true);
  // We can now signal to other resources for ending photo mode
  // and redisplaying HUD components
  emit(PhotoEvents.NPWD_PHOTO_MODE_ENDED);

  emit('npwd:disableControlActions', true);
  await animationService.closeCamera();
});

const handleTakePicture = async () => {
  // Wait a frame so we don't draw the display helper text
  ClearHelp(true);
  await Delay(0);
  /*
   * If we don't do this janky work around players get stuck in their camera
   * until the entire server callback has happened, which doesn't matter for
   * people with fast internet but a lot of people still have slow internet
   */
  setTimeout(() => {
    DestroyMobilePhone();
    CellCamActivate(false, false);
    openPhoneTemp();
    animationService.openPhone();
    emit('npwd:disableControlActions', true);
  }, 200);
  const resp = await takePhoto();
  inCameraMode = false;
  return resp;
};

const handleCameraExit = async () => {
  sendCameraEvent(PhotoEvents.CAMERA_EXITED);
  ClearHelp(true);
  await animationService.closeCamera();
  emit('npwd:disableControlActions', true);
  DestroyMobilePhone();
  CellCamActivate(false, false);
  openPhoneTemp();
  inCameraMode = false;
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
          authorization: config.images.useAuthorization
            ? `${config.images.authorizationPrefix} ${SCREENSHOT_BASIC_TOKEN}`
            : undefined,
          'content-type': config.images.contentType,
        },
      },
      async (data: any) => {
        try {
          let parsedData = JSON.parse(data);
          for (const index of config.images.returnedDataIndexes) parsedData = parsedData[index];
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
