ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)

ESX.RegisterServerCallback('phone:fetchTweets', function(source, cb)
    print('RegisterServerCallback: phone:fetchTweets')
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    MySQL.Async.fetchAll('SELECT * FROM npwd_twitter_tweets WHERE visible = 1 ORDER BY updatedAt DESC', {}, function(tweets)
        cb(tweets)
    end)
end)


ESX.RegisterServerCallback('phone:createTweet', function(source, cb, data) 
    print('RegisterServerEvent: phone:createTweet')
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()

    MySQL.Async.execute('INSERT INTO npwd_twitter_tweets (`identifier`, `realUser`, `message`, `images`) VALUES (@identifier, @realUser, @message, @images)', 
    {  
        ['identifier'] = _identifier,
        ['realUser']  = data.realUser,
        ['message']  = data.message,
        ['images'] = data.images
    }, function(result) 
        cb(result)
    end)
end)
