ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

RegisterNetEvent('phone:sendContacts')
AddEventHandler('phone:sendContacts', function()
    ESX.TriggerServerCallback('phone:getContacts', function(contacts)
        SendNUIMessage(
            {
                app = 'BANK',
                method = 'setContacts',
                data = contacts
            }
        )
    end)
end)

RegisterNUICallback('contacts:add', function(data)
  local display = data.name
  local number = data.number
  TriggerServerEvent('phone:addContacts', display, number)
  TriggerEvent('phone:sendContacts')
end)
