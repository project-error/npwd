import { ESXClient } from "fivem-esx-js/client/esx_client";
import { config } from "process";
let ESX: ESXClient = null;

setTick(() => {
  while (ESX === null) {
    emit('esx:getSharedObject', (obj: ESXClient) => ESX = obj);
  };
});


RegisterCommand('phone:close', (source: any, args: string[], raw: any) => {
    phoneCloseAnim()
    SetNuiFocus(false, false)
    SendNuiMessage(
      JSON.stringify({
        app: "PHONE",
        method: "setVisibility",
        data: true 
      })
    )
}, false) 


//RegisterKeyMapping('phone', _U('keymap_phone'), 'keyboard', '') -- Lets people set a keybind for the phone command but can't be implemented yet.

//[[RegisterCommand('phone:get', function(source, args, rawCommand)
//    TriggerServerEvent('phone:server:getCredentials')
//end, false)]]

//
//Start of Phone
//

let prop = 0
let isPhoneOpen = false
let propCreated = false
let phoneModel = "prop_amb_phone" // Refered to in newphoneProp function. Requires custom phone being streamed.

const newPhoneProp = () =>  { //Function for creating the phone prop
    deletePhone() //deletes the already existing prop before creating another.
    if (propCreated == false) {
        RequestModel(phoneModel)
        while (!HasModelLoaded(phoneModel)) {
          Wait(1)
          console.log("MODEL HASNT LOADED")
        }
        
        const playerPed = PlayerPedId()
        const [x, y, z] = GetEntityCoords(playerPed,  true);
        prop = CreateObject(GetHashKey(phoneModel), x, y, z + 0.2, true, true, true)
        //prop = CreateObject(GetHashKey(phoneModel), 1.0, 1.0, 1.0, 1, 1, 0)
        const boneIndex = GetPedBoneIndex(playerPed, 28422)
        AttachEntityToEntity(prop, playerPed, boneIndex, 0.0, 0.0, 0.0, 0.0, 0.0,  -.0, true, true, false, true, 1.0, true); //-- Attaches the phone to the player.
        propCreated = true
        console.log("prop created")
    }
    else if (propCreated == true) {
      console.log("prop already created")
    }
}

function deletePhone() { //-- Triggered in newphoneProp function. Only way to destory the prop correctly.
	if (prop != 0) {
    //Citizen.invokeNative(0xAE3CBE5BF394C9C9 , Citizen.pointerValueIntInitialized(prop))
    DeleteEntity(prop);
    prop = 0
    propCreated = false
    console.log("prop destroyed")
  }
}

function loadAnimDict(dict: any) { //-- Loads the animation dict. Used in the anim functions.
	while (!HasAnimDictLoaded(dict)) {
		RequestAnimDict(dict)
		Wait(0)
  }
}

function phoneOpenAnim() { //Phone Open Animation
    const flag = 50 //https://runtime.fivem.net/doc/natives/?_0xEA47FE3719165B94
    deletePhone() //Deleting  before creating a new phone where itll be deleted again.
    if (IsPedInAnyVehicle(GetPlayerPed(-1), true)) { //-- true refers to at get in.
        const dict = 'anim@cellphone@in_car@ps'
        const kek = "pepein"

        ClearPedTasks(GetPlayerPed(-1))
        loadAnimDict(dict)
        TaskPlayAnim(GetPlayerPed(-1), dict, 'cellphone_text_in', 8.0, -1, -1, flag, 0, false, false, false) 
        Wait(300) //Gives time for animation starts before creating the phone
        //newPhoneProp() //Creates the phone and attaches it.
    }
    else { //While not in a vehicle it will use this dict.
        const dict = 'cellphone@'
        const kek = "pepeout"

        ClearPedTasks(GetPlayerPed(-1))
        loadAnimDict(dict)
        TaskPlayAnim(GetPlayerPed(-1), dict, 'cellphone_text_in', 8.0, -1, -1, flag, 0, false, false, false) 
        Wait(300) //Gives time for animation starts before creating the phone
        newPhoneProp() //Creates the phone and attaches it.
    }
}

function phoneCloseAnim() { //Phone Close Animation
    const flag = 50 //https://runtime.fivem.net/doc/natives/?_0xEA47FE3719165B94
    const anim = 'cellphone_text_out'
    if (IsPedInAnyVehicle(GetPlayerPed(-1), true)) { //true refers to at get in.
        const dict = 'anim@cellphone@in_car@ps'
        const kek = "pepein"

        StopAnimTask(GetPlayerPed(-1), dict, 'cellphone_text_in', 1.0) //Stop the pull out animation
        deletePhone() //Deletes the prop early incase they get out of the vehicle.
        Wait(250) //lets it get to a certain point
        loadAnimDict(dict) //loads the new animation
        TaskPlayAnim(GetPlayerPed(-1), dict, anim, 8.0, -1, -1, flag, 1, false, false, false) //puts phone into pocket
        Wait(200) //waits until the phone is in the pocket
        StopAnimTask(GetPlayerPed(-1), dict, anim, 1.0) //clears the animation
    }
    else { //While not in a vehicle it will use this dict.
        const dict = 'cellphone@'
        const kek = "pepeout"

        StopAnimTask(GetPlayerPed(-1), dict, 'cellphone_text_in', 1.0) //Stop the pull out animation
        Wait(100) //lets it get to a certain point
        loadAnimDict(dict) //loads the new animation
        TaskPlayAnim(GetPlayerPed(-1), dict, anim, 8.0, -1, -1, flag, 1, false, false, false) //puts phone into pocket
        Wait(200) //waits until the phone is in the pocket
        StopAnimTask(GetPlayerPed(-1), dict, anim, 1.0) //clears the animation
        deletePhone() //Deletes the prop.
    }
}

//function carryingPhone(cb)
//	cb(true)
//end

async function carryingPhone(cb: any) {
  if (ESX == null) return cb(0);
  const qtty = await ESX.TriggerServerCallback('phone:getItemAmount', 'phone');
  cb(qtty > 0);
}

function noPhone() {
	if (ESX == null) return;
    //exports['mythic_notify']('error', 'Oi Mate, No El Telephono')
    ESX.ShowNotification('Oi Mate, No El Telephono')
}

function sendPhoneConfig() {
  ESX.TriggerServerCallback('phone:phoneConfig', function(config: any) {
    SendNuiMessage(
      JSON.stringify({
        app: "PHONE",
        method: "phoneConfig",
        data: config
      })
    )
  });
}

setTick(() => {
  if (IsControlJustPressed(1, 288)) {
    Phone();
  }
})

let PhoneAsItem = false;

function Phone() {
  if (PhoneAsItem == true) {
    carryingPhone((carryingPhone: any) => {
      if (carryingPhone == true) {
        if (isPhoneOpen == false) {
          isPhoneOpen = true 
          phoneOpenAnim()
          console.log("phone is now open") //Left for testing purposes. 
          TriggerServerEvent('phone:getCredentials', source) 
          SetCursorLocation(0.936, 0.922) //Experimental
          let res = GetActiveScreenResolution()
          SendNuiMessage(
            JSON.stringify({
              app: "PHONE",
              method: "setVisibility",
              data: true
            })
          )
          sendPhoneConfig()
          SetNuiFocus(true, true)
        }
        else {
          isPhoneOpen = false
          console.log("phone is now closed") //Left for testing purposes. 
          SendNuiMessage( //Hides phone
            JSON.stringify({
              app: "PHONE",
              method: "setVisibility",
              data: false
            })
          )
          SetNuiFocus(false, false)
          phoneCloseAnim()
        }
      }
      else {
        noPhone();
      }
    })
  }
  else if (PhoneAsItem == false) {   
    //print("ConfigOff")  
    if (isPhoneOpen == false) { 
    isPhoneOpen = true 
    phoneOpenAnim()
    console.log("phone is now open") //Left for testing purposes. 
    TriggerServerEvent('phone:getCredentials', source) 
    SetCursorLocation(0.936, 0.922) //Experimental
    let res = GetActiveScreenResolution()
    //print(res)
    SendNuiMessage(
      JSON.stringify({
        app: "PHONE",
        method: "setVisibility",
        data: true
      })
    )
    sendPhoneConfig()
    SetNuiFocus(true, true)
    }
    else {
    isPhoneOpen = false
    console.log("phone is now closed") //Left for testing purposes. 
    SendNuiMessage( //Hides phone
      JSON.stringify({
        app: "PHONE",
        method: "setVisibility",
        data: false
      })
    )
    SetNuiFocus(false, false)
    phoneCloseAnim()
  }
}




RegisterCommand('phone', function(source) { //-- Toggles Phone
  Phone()
}, false)


// Need to add the contacts file before even doing this
//RegisterNetEvent('phone:send')
//AddEventHandler('phone:send', function()
//    TriggerEvent('phone:sendContacts')
//end)



RegisterNuiCallbackType('phone:close');
on(`__cfx_nui:phone:close`, () => {
  Phone();
}) // //Called for when the phone is closed via the UI.



// Will take care of this later on the other branch
//RegisterNetEvent('phone:sendCredentials')
//AddEventHandler('phone:sendCredentials', function(number)
//    print(number)
//    SendNUIMessage(
//        {
//            app = "SIMCARD",
//            method = "setNumber",
//            data = number
//        }
//    )
//end)

AddEventHandler('onResourceStop', function(resource) {
  if (resource == GetCurrentResourceName()) {
    SendNuiMessage(
      JSON.stringify({
        app: 'PHONE',
        method: 'setVisibility',
        data: false
      })
    )
    SetNuiFocus(false, false)
    deletePhone() //Deletes the phone incase it was attached.
    ClearPedTasks(GetPlayerPed(-1)) //Leave here until launch as it'll fix any stuck animations.
  }
})

//
//Phone Destory When Wet
//

async function countPhone(cb: any) {
  if (ESX == null) return cb(0)
  const qtty = await ESX.TriggerServerCallback('phone:getItemAmount', 'phone');
  cb(qtty > 0);
}

let destroyedPhone = false

let SwimDestroy = false;

setTick(() => {
  while (SwimDestroy) {
  Wait(10 * 1000);
    if (IsPedSwimming(PlayerPedId())) {
      let chance = Math.floor((Math.random() * 100) + 1);
      if (chance <= 100) {
        countPhone((countPhone: boolean) => {
          if (countPhone == true) {
            ESX.ShowNotification('Your phone is ruined from the water!')
            destroyedPhone = true
          }
        })
      }
      if (destroyedPhone == true) {
        Wait(3 * 60000)
      }
    } 
  }
})

//Citizen.CreateThread(function()
//    while Config.SwimDestroy do -- Checks if phone should destroy while swimming.
//    Citizen.Wait(Config.RunRate * 1000) -- Checks how often the player is swimming x * 1 second.
//        if IsPedSwimming(GetPlayerPed(-1)) then
//           local chance = GetRandomIntInRange(0, 100)
//            if chance <= Config.DestoryChance then -- Chance of destroying the phone.
//                countPhone(function (countPhone)
//                    if countPhone == true then
//                        --print("Phone destroyed")
//                        ESX.ShowNotification('Your phone is ruined from the water!')
//                        destroyedPhone = true
//                    end
//                end)
//            end
//            if destroyedPhone == true then -- If the phone was destroyed earlier then we will wait to check again.
//                Wait(Config.DestroyPhoneReCheck * 60000) -- Waits x * 1 minute before checking again because it's pointless to re check.
//            end
//        end
//    end
//end)