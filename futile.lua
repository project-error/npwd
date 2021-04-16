isPhoneOpen = false

CreateThread(function()
    while true do
        Wait(5)
        if isPhoneOpen then
            DisableControlAction(0, 1, true) -- Look Left/Right
            DisableControlAction(0, 2, true) -- Look up/Down
            DisableControlAction(0, 16, true) -- Next Weapon
            DisableControlAction(0, 17, true) -- Select Previous Weapon
            DisableControlAction(0, 22, true) -- Jump
            DisableControlAction(0, 24, true) -- Attack
            DisableControlAction(0, 25, true) -- Aim
            DisableControlAction(0, 37, true) -- Weapon Wheel
        else
            EnableControlAction(0, 1, true) -- Look Left/Right
            EnableControlAction(0, 2, true) -- Look up/Down
            EnableControlAction(0, 17, true) -- Select Previous Weapon
            EnableControlAction(0, 22, true) -- Jump
            EnableControlAction(0, 24, true) -- Attack
            EnableControlAction(0, 25, true) -- Aim
            EnableControlAction(0, 37, true) -- Weapon Wheel
            EnableControlAction(0, 16, true) -- Next Weapon
            Wait(1000)
        end
    end
end)

RegisterNetEvent('npwd:disableEnableInput')
AddEventHandler('npwd:disableEnableInput', function()
    isPhoneOpen = not isPhoneOpen
end)