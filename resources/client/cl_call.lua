ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

-----
--END OF ESX 
-----
local isPhoneOpen = false 
local inCall = false
RegisterNUICallback('phone:startCall', function(data)
    print('Start call with ' .. data.number)
    local phoneNumber = data.number
    startCall(phoneNumber)
end)

--[[RegisterNetEvent("phone:acceptCall")
AddEventHandler("phone:acceptCall", function(phoneNumber, initiator)
  print("should accept")
  if inCall == false then
    inCall = true
    
    exports["mumble-voip"]:SetCallChannel(infoCall.id+1)
  end
  if isPhoneOpen == false then 
    isPhoneOpen = true
    phoneOpenAnim()
    SetCursorLocation(0.936, 0.922) -- Experimental
    local res = GetActiveScreenResolution()
    --print(res)
    SendNUIMessage( -- Shows phone
        {
        app = 'PHONE',
        method = 'setVisibility',
        data = true
        }
    )
    SetNuiFocus(true, true)
    TriggerServerEvent('phone:getCredentials', source)
  end
end)--]]

RegisterCommand('answer', function(source) -- Toggles Phone
  local rocko = 2222222
  local chip = 1111111
  acceptCall(rocko, chip)
  print(rocko)
end, false)

function startCall(transmitter, target)
  TriggerServerEvent('phone:startCall', transmitter, target)
end

function acceptCall (phoneNumber)
  TriggerServerEvent('phone:acceptCall', phoneNumber)
  print(phoneNumber)
end

function rejectCall(phoneNumber)
  TriggerServerEvent('phone:rejectCall', infoCall)
end

RegisterNetEvent('phone:waitingCall') -- Done for caller/ reciever
AddEventHandler('phone:waitingCall', function(phoneNumber)
  local playerPed = PlayerPedId()
  --print(phoneNumber)
  print("oi")
  --TriggerServerEvent('InteractSound_SV:PlayWithinDistance', 0.5, 'cellCall', 0.4)
end)