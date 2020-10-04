------
-- Database table & column mapping. This mapping allows us to maintain
-- a framework agnostic approach where integration into custom implementations
-- is possible. This mappings default to values that work with ESX.
------
DatabaseConfig = {
    userTable = 'users',
    -- all of the following columns are required to be in the userTable
    id = 'identifier', -- unique id of a player
    firstName = 'firstname', -- character's first name
    lastName = 'lastname',  -- character's last name
    phoneNumber = 'phone_number' -- character's phone number
}


Config = {}

Config.Locale = 'en'

Config.KeyTogglePhone = 288 -- F1
Config.KeyTakeCall  = 38  -- E
Config.PhoneAsItem = true

------
--Destroy Phone
------

Config.SwimDestroy = false --only set true if you have PhoneAsItem.

Config.RunRate = 10 --SECONDS  /// Will do the initial thread every X SECONDS to check if the player is swimming so the phone can be destroyed based off the chance below.

Config.DestoryChance = 100 --PERCENT BASED /// from 0 to 100 where 100 is equal to 100% chance and 10 is equal to 10%. This is dependent on the amount above so dont set it too low.

Config.DestroyPhoneReCheck = 3 --MINUTES /// WIll wait the check for x MINUTES as they have no phone now and have been given a destroyed phone = to the number of phones they had.