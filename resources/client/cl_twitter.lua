ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

local APP_NAME = 'TWITTER'


function sendMessage(method, data)
    SendNUIMessage(
        {
            app = APP_NAME,
            method = method,
            data = data
        }
    )
end

RegisterNetEvent('phone:fetchTweets')
AddEventHandler('phone:fetchTweets', function()
    print('RegisterNetEvent: phone:fetchTweets')
    ESX.TriggerServerCallback('phone:fetchTweets', function(tweets)
        sendMessage('fetchTweets',  tweets)
    end)
end)


RegisterNUICallback('phone:fetchTweets', function()
    print('RegisterNUICallback: phone:fetchTweets')
    TriggerEvent('phone:fetchTweets')
  end)

RegisterNUICallback('phone:createTweet', function(data)
  sendMessage('createTweetLoading',  true)
  ESX.TriggerServerCallback('phone:createTweet', function(isSuccessful)
    sendMessage('createTweetResult',  isSuccessful)
    TriggerEvent('phone:fetchTweets')
  end, data)
end)
