ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

local APP_NAME = 'TWITTER'

function sendTwitterMessage(method, data)
    SendNUIMessage(
        {
            app = APP_NAME,
            method = method,
            data = data
        }
    )
end


RegisterNetEvent('phone:fetchTweetsFiltered')
AddEventHandler('phone:fetchTweetsFiltered', function(searchValue)
  ESX.TriggerServerCallback('phone:fetchTweetsFiltered', function(tweets)
      sendTwitterMessage('fetchTweetsFiltered',  tweets)
  end, searchValue)
end)



  
RegisterNUICallback('phone:fetchTweetsFiltered', function(searchValue)
  TriggerEvent('phone:fetchTweetsFiltered', searchValue)
end)


RegisterNUICallback('phone:createTweet', function(data)
  sendTwitterMessage('createTweetLoading',  true)
  ESX.TriggerServerCallback('phone:createTweet', function(isSuccessful)
    sendTwitterMessage('createTweetResult',  isSuccessful)
    TriggerEvent('phone:fetchTweets')
  end, data)
end)


function getOrCreateTwitterProfile()
  ESX.TriggerServerCallback('phone:getOrCreateTwitterProfile', function(profile)
    sendTwitterMessage('getOrCreateTwitterProfile',  profile)
  end)
end

-- called directly from the UI on app load
RegisterNUICallback('phone:getOrCreateTwitterProfile', function()
  getOrCreateTwitterProfile()
end)

-- called during subsequent updates
RegisterNetEvent('phone:getOrCreateTwitterProfile')
AddEventHandler('phone:getOrCreateTwitterProfile', function()
  getOrCreateTwitterProfile()
end)

RegisterNUICallback('phone:updateTwitterProfile', function(data)
  sendTwitterMessage('updateProfileLoading',  true)
  ESX.TriggerServerCallback('phone:updateTwitterProfile', function(result)
    sendTwitterMessage('updateProfileResult',  result)
    TriggerEvent('phone:getOrCreateTwitterProfile')
  end, data)
end)

RegisterNUICallback('phone:toggleLike', function(tweetId)
  TriggerServerEvent('phone:toggleLike', tweetId)
end)