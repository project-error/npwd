import { PhotoEvents } from '../../typings/photo';
import { Delay } from '../utils/fivem';
import { sendMessage, sendCameraEvent } from '../utils/messages';
const SCREENSHOT_BASIC_TOKEN = GetConvar('SCREENSHOT_BASIC_TOKEN', 'none');

const exp = (global as any).exports;

let inCameraMode = false;

function closePhoneTemp() {
  SetNuiFocus(false, false);
  sendMessage('PHONE', 'setVisibility', false);
}

function openPhoneTemp() {
  SetNuiFocus(true, true);
  sendMessage('PHONE', 'setVisibility', true);
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
  cb();
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
    displayHelperText();
    if (IsControlJustPressed(1, 27)) {
      frontCam = !frontCam;
      CellFrontCamActivate(frontCam);
    } else if (IsControlJustPressed(1, 176)) {
      await handleTakePicture();
    } else if (IsControlJustPressed(1, 177)) {
      handleCameraExit();
      break;
    }
  }
  ClearHelp(true);
});

const handleTakePicture = async () => {
  takePhoto();
  await Delay(200);
  DestroyMobilePhone();
  CellCamActivate(false, false);
  openPhoneTemp();
  inCameraMode = false;
};

const handleCameraExit = () => {
  DestroyMobilePhone();
  CellCamActivate(false, false);
  openPhoneTemp();
  inCameraMode = false;
};

onNet(PhotoEvents.SEND_PHOTOS, (photos: string[]) => {
  sendCameraEvent(PhotoEvents.SEND_PHOTOS, photos);
});

function takePhoto() {
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
    (data: string) => {
      const imageLink = JSON.parse(data).data.link;
      emitNet(PhotoEvents.UPLOAD_PHOTO, imageLink);
    },
  );
}

onNet(PhotoEvents.UPLOAD_PHOTO_SUCCESS, () => {
  emitNet(PhotoEvents.FETCH_PHOTOS);
});

// delete photo

RegisterNuiCallbackType(PhotoEvents.DELETE_PHOTO);
on(`__cfx_nui:${PhotoEvents.DELETE_PHOTO}`, (data: any, cb: Function) => {
  emitNet(PhotoEvents.DELETE_PHOTO, data);
  cb();
});

onNet(PhotoEvents.DELETE_PHOTO_SUCCESS, () => {
  emitNet(PhotoEvents.FETCH_PHOTOS);
});
