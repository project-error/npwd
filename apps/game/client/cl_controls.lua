local controlsDisabled = false
local disableKeys
local DisableControlAction = DisableControlAction
local EnableControlAction = EnableControlAction
local Wait = Wait
local CreateThread = CreateThread
local _npwd = exports.npwd
local function pausemenuThread()
    local sleep = 1000
    while true do
        if not _npwd.isPhoneVisible() then
            sleep = 1000
            goto continue
        end

        sleep = 500

        if IsPauseMenuActive() == false then
            goto continue
        end

        _npwd:setPhoneVisible(false)
        :: continue ::
        Wait(sleep)
    end
end CreateThread(pausemenuThread)


local function blockActions()
    while controlsDisabled do
		DisableAllControlActions(1)		  
		DisableAllControlActions(2)
        EnableControlAction(0, 22, true)
        EnableControlAction(0, 30, true)
        EnableControlAction(0, 31, true)
        EnableControlAction(0, 32, true)
        EnableControlAction(0, 33, true)
        Wait(0)
    end
    collectgarbage("collect")
end

AddEventHandler('npwd:disableControlActions', function(bool)
    controlsDisabled = bool
    if not controlsDisabled then return end
    CreateThread(blockActions)
end)