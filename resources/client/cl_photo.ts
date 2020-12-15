import events from "../utils/events";
import { Delay } from "../utils/fivem";
const SCREENSHOT_BASIC_TOKEN = GetConvar('SCREENSHOT_BASIC_TOKEN', 'none')

const exp = (global as any).exports

function closePhoneTemp() {
  SendNuiMessage(
    //Hides phone
    JSON.stringify({
      app: "PHONE",
      method: "setVisibility",
      data: false,
    })
  );
}

function openPhoneTemp() {
  SendNuiMessage(
    //Opens phone
    JSON.stringify({
      app: "PHONE",
      method: "setVisibility",
      data: true,
    })
  );
}


let takingPhoto = false

function CellFrontCamActivate(activate: any) {
	return Citizen.invokeNative('0x2491A93618B7D838', activate)
}

RegisterNuiCallbackType(events.CAMERA_TAKE_PHOTO);
on(`__cfx_nui:${events.CAMERA_TAKE_PHOTO}`, async () => {
  CreateMobilePhone(1);
  CellCamActivate(true, true);

  closePhoneTemp()
  SetNuiFocus(false, false);

  takingPhoto = true;

  while (takingPhoto) {
    await Delay(0);
    let frontCam = false;

    if (IsControlJustPressed(1, 27)) {
      if (!frontCam) {
        frontCam = true;
        CellFrontCamActivate(true);
      } else {
        frontCam = false;
        CellFrontCamActivate(false);
      }

    } else if (IsControlJustPressed(1, 176)) {
      takePhoto()
      await Delay(200)
      console.log("phone closing")
      DestroyMobilePhone();
      CellCamActivate(false, false);

      openPhoneTemp()
      SetNuiFocus(true, true);
      
      takingPhoto = false;

    } else if (IsControlJustPressed(1, 177)) {
      DestroyMobilePhone();
      CellCamActivate(false, false);

      openPhoneTemp()
      SetNuiFocus(true, true);

      takingPhoto = false;
      break;
    }
  }
});

//setTick(async () => {
//  while (takingPhoto) {
//    await Delay(0);
//
//    if (IsControlReleased(1, 177)) {
//      DestroyMobilePhone();
//      CellCamActivate(false, false);
//      takingPhoto = false;
//      SetNuiFocus(true, true);
//      break;
//    }
//  }
//})



onNet(events.CAMERA_SEND_PHOTOS, (photos: string[]) => {
  console.log(photos)
  SendNuiMessage(
    JSON.stringify({
      app: "CAMERA",
      method: "setPhotos",
      data: photos
    })
  )
})


function takePhoto() {
  const [width, height] = GetActiveScreenResolution();
  // Return and log error if screenshot basic token not found
  if (SCREENSHOT_BASIC_TOKEN === 'none') {
    return console.error('Screenshot basic token not found. Please set in server.cfg');
  }
  exp["screenshot-basic"].requestScreenshotUpload(
    "https://api.imgur.com/3/image",
    "imgur",
    {
      headers: {
        'authorization': `Client-ID ${ SCREENSHOT_BASIC_TOKEN }`,
        'content-type': 'multipart/form-data'
      }
    },
    (data: string) => {
      const imageLink = JSON.parse(data).data.link;
      emitNet(events.CAMERA_UPLOAD_PHOTO, imageLink)
    }
  );
}


// delete photo

RegisterNuiCallbackType(events.CAMERA_DELETE_PHOTO);
on(`__cfx_nui:${events.CAMERA_DELETE_PHOTO}`, (data: any) => {
  emitNet(events.CAMERA_DELETE_PHOTO, data)
})

onNet(events.CAMERA_DELETE_PHOTO_SUCCESS, () => {
  emitNet(events.CAMERA_FETCH_PHOTOS)
})

