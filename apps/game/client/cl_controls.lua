local disableKeys

local DisableControlAction = DisableControlAction
local Wait = Wait
local CreateThread = CreateThread

CreateThread(function()
    while true do
        if disableKeys then
            Wait(0)
            DisableControlAction(0, 0, true)    -- Next Camera
            DisableControlAction(0, 1, true)    -- Look Left/Right
            DisableControlAction(0, 2, true)    -- Look up/Down
            DisableControlAction(0, 16, true)   -- Next Weapon
            DisableControlAction(0, 17, true)   -- Select Previous Weapon
            DisableControlAction(0, 22, true)   -- Jump
            DisableControlAction(0, 24, true)   -- Attack
            DisableControlAction(0, 25, true)   -- Aim
            DisableControlAction(0, 26, true)   -- Look Behind
            DisableControlAction(0, 36, true)   -- Input Duck/Sneak
            DisableControlAction(0, 37, true)   -- Weapon Wheel
            DisableControlAction(0, 44, true)   -- Cover
            DisableControlAction(0, 47, true)   -- Detonate
            DisableControlAction(0, 55, true)   -- Dive
            DisableControlAction(0, 75, true)   -- Exit Vehicle
            DisableControlAction(0, 76, true)   -- Vehicle Handbrake
            DisableControlAction(0, 81, true)   -- Next Radio (Vehicle)
            DisableControlAction(0, 82, true)   -- Previous Radio (Vehicle)
            DisableControlAction(0, 91, true)   -- Passenger Aim (Vehicle)
            DisableControlAction(0, 92, true)   -- Passenger Attack (Vehicle)
            DisableControlAction(0, 99, true)   -- Select Next Weapon (Vehicle)
            DisableControlAction(0, 106, true)  -- Control Override (Vehicle)
            DisableControlAction(0, 114, true)  -- Fly Attack (Flying)
            DisableControlAction(0, 115, true)  -- Next Weapon (Flying)
            DisableControlAction(0, 121, true)  -- Fly Camera (Flying)
            DisableControlAction(0, 122, true)  -- Control OVerride (Flying)
            DisableControlAction(0, 135, true)  -- Control OVerride (Sub)
            DisableControlAction(0, 140, true)  -- Melee attack light
            DisableControlAction(0, 200, true)  -- Pause Menu
            DisableControlAction(0, 245, true)  -- Chat
        else
            Wait(100)
        end
    end
end)

-- Handles pause menu state
CreateThread(function()
    while true do
        Wait(500)
        local isPauseOpen = IsPauseMenuActive() ~= false
        local isPhoneVisible = exports.npwd:isPhoneVisible()
        -- Handle if the phone is already visible and escape menu is opened
        if isPauseOpen and isPhoneVisible then
            exports.npwd:setPhoneVisible(false)
        end
    end
end)


AddEventHandler('npwd:disableControlActions', function(bool)
  disableKeys = bool
end)
