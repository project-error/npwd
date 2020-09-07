ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

RegisterCommand('phone:close', function(source, args, rawCommand)
    SendNUIMessage({
        app = 'PHONE',
        method = 'setVisibility',
        data = false
    })
    SetNuiFocus(false, false)
end, false)
-----
--END OF ESX 
-----
local prop = 0
local isPhoneOpen = false
local phoneModel = "prop_amb_phone"
--RegisterKeyMapping('phone', _U('keymap_phone'), 'keyboard', '')

--[[RegisterCommand('phone:get', function(source, args, rawCommand)
    riggerServerEvent('phone:server:getCredentials')
end, false)]]

function loadAnimDict(dict)
	while ( not HasAnimDictLoaded(dict)) do
		RequestAnimDict(dict)
		Citizen.Wait(0)
	end
end

function newPhoneProp()
    deletePhone()
    DeleteObject(prop)
	RequestModel(phoneModel)
	while not HasModelLoaded(phoneModel) do
		Citizen.Wait(1)
    end
    
    local playerPed = GetPlayerPed(-1)
    local x,y,z = table.unpack(GetEntityCoords(playerPed))
    prop = CreateObject(GetHashKey(phoneModel), x, y, z + 0.2, true, true, true)
    local boneIndex = GetPedBoneIndex(playerPed, 28422)
	AttachEntityToEntity(prop, playerPed, boneIndex, 28422, 0.0, 0.0, 0.0, 0.0, 0.0, -.0, true, true, false, true, 1, true)
end

function phoneAnim()
    loadAnimDict('cellphone@')
    TaskPlayAnim(GetPlayerPed(-1), 'cellphone@', 'cellphone_text_in', 9.0, -1, -1, 50, 0, false, false, false)
end

--function deleteProp()
--    print(prop)
--    if prop ~= 0 then
--		DeleteObject(prop)
--        ClearAllPedProps(prop)  
--		prop = 0
--	end
--end

function deletePhone()
	if prop ~= 0 then
		Citizen.InvokeNative(0xAE3CBE5BF394C9C9 , Citizen.PointerValueIntInitialized(prop))
		prop = 0
	end
end




Citizen.CreateThread(function()
    while true do
    Citizen.Wait(0)
       if IsControlJustPressed(1, Config.KeyTogglePhone) then
            if isPhoneOpen == false then
                isPhoneOpen = true
                print(Config.KeyTogglePhone) --Left for testing purposes. 
                newPhoneProp()
                phoneAnim()

                SendNUIMessage( -- Shows phone
                    {
                    app = 'PHONE',
                    method = 'setVisibility',
                    data = true
                    }
                )
                SetNuiFocus(true, true)
                TriggerServerEvent('phone:getCredentials', source)
            elseif isPhoneOpen == true then
                isPhoneOpen = false
                print(Config.KeyTogglePhone) --Left for testing purposes. 
                ClearPedTasksImmediately(GetPlayerPed(-1))
                deletePhone()
                SendNUIMessage( -- Hides phone
                    {
                    app = 'PHONE',
                    method = 'setVisibility',
                    data = false
                    }
                )
                SetNuiFocus(false, false)
            end
        end
    end
end)

RegisterCommand('phone', function(source) -- Toggles Phone
    if isPhoneOpen == false then 
        isPhoneOpen = true 
        phoneAnim()
        print("phone is now open") --Left for testing purposes. 
        TriggerServerEvent('phone:getCredentials', source) 
        SendNUIMessage( -- Shows phone
            {
            app = 'PHONE',
            method = 'setVisibility',
            data = true
            }
        )
        SetNuiFocus(true, true)
    else
        isPhoneOpen = false
        print("phone is now closed") --Left for testing purposes. 
        SendNUIMessage( -- Hides phone
            {
             app = 'PHONE',
             method = 'setVisibility',
             data = false
            }
        )
        SetNuiFocus(false, false)
        ClearPedTasksImmediately(GetPlayerPed(-1))
    end
end, false)


RegisterNetEvent('phone:send')
AddEventHandler('phone:send', function()
    TriggerEvent('phone:sendContacts')
end)

RegisterNUICallback('phone:close', function()
    isPhoneOpen = false
    SendNUIMessage(
        {
         app = 'PHONE',
         method = 'setVisibility',
         data = false
        }
    )
    SetNuiFocus(false, false)
    ClearPedTasksImmediately(GetPlayerPed(-1))
    deletePhone()
end)

RegisterNetEvent('phone:sendCredentials')
AddEventHandler('phone:sendCredentials', function(number)
    print(number)
    SendNUIMessage(
        {
            app = "SIMCARD",
            method = "setNumber",
            data = number
        }
    )
end)