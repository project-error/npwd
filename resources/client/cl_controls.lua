local disableKeys

CreateThread(function()
    while true do
        if disableKeys then
            Wait(0)
            DisableControlAction(0, 1, true)    -- Look Left/Right
            DisableControlAction(0, 2, true)    -- Look up/Down
            DisableControlAction(0, 16, true)   -- Next Weapon
            DisableControlAction(0, 17, true)   -- Select Previous Weapon
            DisableControlAction(0, 22, true)   -- Jump
            DisableControlAction(0, 24, true)   -- Attack
            DisableControlAction(0, 25, true)   -- Aim
            DisableControlAction(0, 37, true)   -- Weapon Wheel
            DisableControlAction(0, 81, true)   -- Next Radio (Vehicle)
            DisableControlAction(0, 82, true)   -- Previous Radio (Vehicle)
            DisableControlAction(0, 91, true)   -- Passenger Aim (Vehicle)
            DisableControlAction(0, 92, true)   -- Passenger Attack (Vehicle)
            DisableControlAction(0, 99, true)   -- Select Next Weapon (Vehicle)
            DisableControlAction(0, 106, true)  -- Control Override (Vehicle)
            DisableControlAction(0, 114, true)  -- Fly Attack (Flying)
            DisableControlAction(0, 115, true)  -- Next Weapon (Flying)
            DisableControlAction(0, 122, true)  -- Control OVerride (Flying)
            DisableControlAction(0, 135, true)  -- Control OVerride (Sub)
            DisableControlAction(0, 245, true)  -- Chat
        else
            Wait(100)
        end
    end
end)

RegisterNetEvent('npwd:disableControlActions')
AddEventHandler('npwd:disableControlActions', function(bool)
  disableKeys = bool
end) 