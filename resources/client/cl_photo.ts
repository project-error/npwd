import events from '../utils/events';
import { Delay } from '../utils/fivem';
const SCREENSHOT_BASIC_TOKEN = GetConvar('SCREENSHOT_BASIC_TOKEN', 'none');

const exp = (global as any).exports;

let inCameraMode = false;

function closePhoneTemp() {
  SetNuiFocus(false, false);
  SendNuiMessage(
    //Hides phone
    JSON.stringify({
      app: 'PHONE',
      method: 'setVisibility',
      data: false,
    })
  );
}

function openPhoneTemp() {
  SetNuiFocus(true, true);
  SendNuiMessage(
    //Opens phone
    JSON.stringify({
      app: 'PHONE',
      method: 'setVisibility',
      data: true,
    })
  );
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

RegisterNuiCallbackType(events.CAMERA_TAKE_PHOTO);
on(`__cfx_nui:${events.CAMERA_TAKE_PHOTO}`, async (data: any, cb: Function) => {
  cb();
  // Create Phone Prop
  CreateMobilePhone(1);
  // Active Camera Change
  CellCamActivate(true, true);
  // Hide phone from rendering temporary
  closePhoneTemp();

  SetNuiFocus(false, false);

  inCameraMode = true;

  while (inCameraMode) {
    await Delay(0);
    let frontCam = false;
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

onNet(events.CAMERA_SEND_PHOTOS, (photos: string[]) => {
  // console.log(photos);
  SendNuiMessage(
    JSON.stringify({
      app: 'CAMERA',
      method: 'setPhotos',
      data: photos,
    })
  );
});

function takePhoto() {
  // Return and log error if screenshot basic token not found
  if (SCREENSHOT_BASIC_TOKEN === 'none') {
    return console.error(
      'Screenshot basic token not found. Please set in server.cfg'
    );
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
      emitNet(events.CAMERA_UPLOAD_PHOTO, imageLink);
    }
  );
}

onNet(events.CAMERA_UPLOAD_PHOTO_SUCCESS, () => {
  emitNet(events.CAMERA_FETCH_PHOTOS);
});

// delete photo

RegisterNuiCallbackType(events.CAMERA_DELETE_PHOTO);
on(`__cfx_nui:${events.CAMERA_DELETE_PHOTO}`, (data: any, cb: Function) => {
  emitNet(events.CAMERA_DELETE_PHOTO, data);
  cb();
});

onNet(events.CAMERA_DELETE_PHOTO_SUCCESS, () => {
  emitNet(events.CAMERA_FETCH_PHOTOS);
});
