ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)

ESX.RegisterServerCallback('phone:fetchTweets', function(source, cb)
    MySQL.Async.fetchAll([[
        SELECT
            npwd_twitter_tweets.id,
            npwd_twitter_tweets.createdAt,
            npwd_twitter_tweets.likes,
            npwd_twitter_tweets.identifier,
            npwd_twitter_tweets.visible,
            npwd_twitter_tweets.images,
            npwd_twitter_tweets.message,
            npwd_twitter_profiles.profile_name,
            npwd_twitter_profiles.avatar_url,
            TIME_TO_SEC(TIMEDIFF( NOW(), npwd_twitter_tweets.createdAt)) AS seconds_since_tweet
        FROM npwd_twitter_tweets
        LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
        WHERE visible = 1
        ORDER BY npwd_twitter_tweets.createdAt DESC 
        LIMIT 75
    ]], {}, function(tweets)
        cb(tweets)
    end)
end)


ESX.RegisterServerCallback('phone:createTweet', function(source, cb, data) 
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()

    MySQL.Async.transaction({[[
        INSERT INTO npwd_twitter_tweets (`identifier`, `realUser`, `message`, `images`)
        VALUES (@identifier, @realUser, @message, @images)
    ]]}, 
    {  
        identifier = _identifier,
        realUser  = data.realUser,
        message  = data.message,
        images = data.images
    },
    function(result) 
        cb(result)
    end)
end)

function getProfile(identifier, cb)
    MySQL.Async.fetchAll([[
        SELECT * FROM npwd_twitter_profiles
        WHERE identifier = @identifier
    ]], 
    { identifier = identifier }, 
    function(result)
        cb(result)
    end)
end

function getProfileName(identifier, cb)
    local defaultProfileName = '' -- handle any edge cases where the user does not exist or their name isn't populated
    MySQL.Async.fetchAll([[
        SELECT first_name, last_name
        FROM users
        WHERE identifier = @identifier LIMIT 1
    ]], 
    { identifier = identifier },
    function(users)
        -- no user found with this identifier
       if next(users) == nil then
           cb(defaultProfileName)
           return
       end

       local first_name = users[1].first_name
       local last_name = users[1].last_name
       if (first_name == "" and last_name == "") then
            cb(defaultProfileName)
        else
            local profileName = first_name .. '_' .. last_name
            cb(profileName)
        end
    end)
end

function createDefaultProfile(identifier, cb)
    getProfileName(identifier, function(profileName)
        MySQL.Async.execute([[
            INSERT INTO npwd_twitter_profiles (`identifier`, `profile_name`)
            VALUES (@identifier, @profile_name)
        ]],
        { identifier = identifier, profileName = profileName },
        function(result)
            if result == 1 then  -- if we created the profile then return it
                getProfile(identifier, cb)
            else -- otherwise just give back the failed result
                cb(result)
            end
        end)
    end)
end

-- Retrieve a twitter profile by identifier. If it does not exist then
-- create and return it
function getOrCreateProfile(identifier, cb)
    getProfile(identifier, function(retrieveResult)
        if next(retrieveResult) == nil then -- profile does not exist, attempt to create it
            createDefaultProfile(identifier, function(createResult)
                cb(createResult)
            end)
        else -- profile does exist
            cb(retrieveResult)
        end
    end)
end

ESX.RegisterServerCallback('phone:getOrCreateTwitterProfile', function(source, cb) 
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()

    getOrCreateProfile(_identifier, function(result)
        cb(result)
    end)
end)

function updateTwitterProfile(identifier, data, cb)
    MySQL.Async.transaction({[[
        UPDATE npwd_twitter_profiles
        SET avatar_url = @avatar_url, profile_name = @profile_name, bio = @bio, location = @location, job = @job WHERE identifier = @identifier
    ]]}, 
    {  
        identifier = identifier,
        avatar_url= data.avatar_url,
        profile_name = data.profile_name,
        bio = data.bio,
        location = data.location,
        job = data.job,
    },
    function(result)
        cb(result)
    end)
end

ESX.RegisterServerCallback('phone:updateTwitterProfile', function(source, cb, data) 
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()

    updateTwitterProfile(_identifier, data, function(result)
        cb(result)
    end)
end)

