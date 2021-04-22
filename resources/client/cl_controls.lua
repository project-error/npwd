local disableKeys

CreateThread(function()
    while true do
        if disableKeys then
            Wait(0)
            DisableControlAction(0, 1, true) -- Look Left/Right
            DisableControlAction(0, 2, true) -- Look up/Down
            DisableControlAction(0, 16, true) -- Next Weapon
            DisableControlAction(0, 17, true) -- Select Previous Weapon
            DisableControlAction(0, 22, true) -- Jump
            DisableControlAction(0, 24, true) -- Attack
            DisableControlAction(0, 25, true) -- Aim
            DisableControlAction(0, 37, true) -- Weapon Wheel
        else
            Wait(100)
        end
    end
end)

RegisterNetEvent('npwd:disableControlActions')
AddEventHandler('npwd:disableControlActions', function(bool)
  disableKeys = bool
end) 