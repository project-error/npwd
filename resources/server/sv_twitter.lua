ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)

function fetchAllTweets(profileId, cb)
    MySQL.Async.fetchAll([[
        SELECT
            npwd_twitter_profiles.profile_name,
            npwd_twitter_profiles.avatar_url,
            npwd_twitter_tweets.*,
			npwd_twitter_likes.id IS NOT NULL AS isLiked,
            TIME_TO_SEC(TIMEDIFF( NOW(), npwd_twitter_tweets.createdAt)) AS seconds_since_tweet
        FROM npwd_twitter_tweets
        LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
        LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = @profileId
        WHERE visible = 1
        ORDER BY npwd_twitter_tweets.createdAt DESC 
        LIMIT 100
    ]],
    { profileId = profileId },
    function(tweets)
        cb(tweets)
    end)
end

function fetchTweetsFiltered(profileId, searchValue, cb)
    local searchValueParameterized = '%' .. searchValue .. '%'
    MySQL.Async.fetchAll([[
        SELECT
            npwd_twitter_profiles.profile_name,
            npwd_twitter_profiles.avatar_url,
            npwd_twitter_tweets.*,
			npwd_twitter_likes.id IS NOT NULL AS isLiked,
            TIME_TO_SEC(TIMEDIFF( NOW(), npwd_twitter_tweets.createdAt)) AS seconds_since_tweet
        FROM npwd_twitter_tweets
        LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
        LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = @profileId
        WHERE visible = 1 AND (npwd_twitter_profiles.profile_name LIKE @profile_name OR npwd_twitter_tweets.message LIKE @message)
        ORDER BY npwd_twitter_tweets.createdAt DESC 
        LIMIT 100
    ]],
    {
        profileId = profileId,
        profile_name = searchValueParameterized,
        message = searchValueParameterized
    },
    function(tweets)
        cb(tweets)
    end)
end

ESX.RegisterServerCallback('phone:fetchTweets', function(source, cb)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    
    getProfile(_identifier, function(result)
        local profile = result[1]
        fetchAllTweets(profile.id, cb)
    end)
end)

  -- search value expected to be lower case
ESX.RegisterServerCallback('phone:fetchTweetsFiltered', function(source, cb, searchValue)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    
    getProfile(_identifier, function(result)
        local profile = result[1]
        fetchTweetsFiltered(profile.id, searchValue, cb)
    end)
end)


ESX.RegisterServerCallback('phone:createTweet', function(source, cb, data) 
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()

    MySQL.Async.transaction({[[
        INSERT INTO npwd_twitter_tweets (`identifier`, `message`, `images`)
        VALUES (@identifier, @message, @images)
    ]]}, 
    {  
        identifier = _identifier,
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
        LIMIT 1
    ]], 
    { identifier = identifier }, 
    function(result)
        cb(result)
    end)
end

function getProfileName(identifier, cb)
    local defaultProfileName = ''
    if Config.twitter.generateProfileNameFromUsers == false then
        cb(defaultProfileName)
        return
    end

    -- TODO: make this query configurable
    MySQL.Async.fetchAll([[
        SELECT CONCAT(firstname, '_', lastname) AS profile_name
        FROM users
        WHERE identifier = @identifier LIMIT 1
    ]], 
    { identifier = identifier },
    function(users)
        if next(users) == nil then -- no user found with this identifier
            cb(defaultProfileName)
            return
        end

        cb(users[1].profile_name)
    end)
end

function createDefaultProfile(identifier, cb)
    getProfileName(identifier, function(profileName)
        MySQL.Async.execute([[
            INSERT INTO npwd_twitter_profiles (`identifier`, `profile_name`)
            VALUES (@identifier, @profile_name)
        ]],
        { identifier = identifier, profile_name = profileName },
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
        SET avatar_url = @avatar_url, profile_name = @profile_name, bio = @bio, location = @location, job = @job
        WHERE identifier = @identifier
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


function doesLikeExist(profileId, tweetId, cb)
    MySQL.Async.fetchAll([[
        SELECT * FROM npwd_twitter_likes
        WHERE profile_id = @profileId AND tweet_id = @tweetId
        LIMIT 1
    ]], 
    { profileId = profileId, tweetId = tweetId }, 
    function(result)
        cb(result)
    end)
end

function createLike(profileId, tweetId)
    MySQL.Async.execute([[
        INSERT INTO npwd_twitter_likes (`profile_id`, `tweet_id`)
        VALUES (@profileId, @tweetId)
    ]],
    { profileId = profileId, tweetId = tweetId })
end

function deleteLike(profileId, tweetId)
    MySQL.Async.execute([[
        DELETE FROM npwd_twitter_likes
        WHERE profile_id = @profileId AND tweet_id = @tweetId
    ]],
    { profileId = profileId, tweetId = tweetId })
end


RegisterServerEvent('phone:toggleLike')
AddEventHandler('phone:toggleLike', function(tweetId)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    
    getProfile(_identifier, function(result)
        local profile = result[1]
        doesLikeExist(profile.id, tweetId, function(result)
            if next(result) == nil then -- like doesn't exist
                createLike(profile.id, tweetId)
            else -- like does exist
                deleteLike(profile.id, tweetId)
            end
        end)
    end)
end)
