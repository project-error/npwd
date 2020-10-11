------
-- Database table & column mapping. This mapping allows us to maintain
-- a framework agnostic approach where integration into custom implementations
-- is possible. This mappings default to values that work with ESX.
------
DatabaseConfig = {
    users = {
        table = 'users',
        -- columns in the table
        id = 'identifier',
        firstName = 'first_name',
        lastName = 'last_name',
        phoneNumber = 'phone_number'
    }
}

Config = {}

Config.Locale = 'en'

Config.KeyTogglePhone = 288 -- F1
Config.KeyTakeCall  = 38  -- E
Config.PhoneAsItem = false

------
--Destroy Phone
------

Config.SwimDestroy = false --only set true if you have PhoneAsItem.

Config.RunRate = 10 --SECONDS  /// Will do the initial thread every X SECONDS to check if the player is swimming so the phone can be destroyed based off the chance below.

Config.DestoryChance = 100 --PERCENT BASED /// from 0 to 100 where 100 is equal to 100% chance and 10 is equal to 10%. This is dependent on the amount above so dont set it too low.

Config.DestroyPhoneReCheck = 3 --MINUTES /// WIll wait the check for x MINUTES as they have no phone now and have been given a destroyed phone = to the number of phones they had.


------
--Twitter
------
Config.twitter = {}
Config.twitter.generateProfileNameFromUsers = true -- if the player's profile name should be generated from the users.first_name and users.last_name table
Config.twitter.characterLimit = 240  -- character limit on tweet messages
Config.twitter.allowEdtiableProfileName = true  -- whether or not players can edit their profile names
-- Config.twitter.enableLikes = true -- whether or not players can like other player's tweets and that they are visible
Config.twitter.enableAvatars = true -- whether or not player avatars are visible and editable
Config.twitter.enableEmojis = true  -- whether or not the emoji menu is available
Config.twitter.enableImages = true  -- whether or not links to images are rendered on the UI and if players can add new ones
Config.twitter.maxImages = 3 -- max amount of images that can be attached to a single tweet
