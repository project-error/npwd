# New Phone Who Dis
The original repo for NPWD
TODO

## Production Server Installation


### Configuration

This resource is highly configurable through the [config.json](./config.json). This JSON file holds configuration for the phone itself, for the apps running on it and peripheral information.

Below is the list of configuration options:

| Option                               | Default  | Description                                                                                                                    |
|--------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------|
| Locale                               | en       | The language locale used by the app. See [fivem keybinds](https://docs.fivem.net/docs/game-references/controls/) for options   |
| KeyTogglePhone                       | 288 (F1) | The keybind to open and close the app. See [fivem keybinds](https://docs.fivem.net/docs/game-references/controls/) for options |
| PhoneAsItem                          | false    | whether or not the phone is an item in game                                                                                    |
| SwimDestroy                          | false    | whether or not the phone will have a chance to be destroyed while swimming                                                     |
| RunRate                              | 10       | interval in seconds to check phone destruction                                                                                 |
| DestoryChance                        | 100      | Percent chance that phone destruction will occur                                                                               |
| DestroyPhoneReCheck                  | 3        | Time in minutes before another phone destruction attempt will happen                                                           |
| notificationPosition.horizontal      | right    | Horizontal position of phone notifications. `left`, `center` or `right`                                                        |
| notificationPosition.vertical        | bottom   | Vertical positon of phone notifications. `top` or `bottom`                                                                     |
| twitter.showNotifications            | true     | Whether or not to show twitter notifications                                                                                   |
| twitter.generateProfileNameFromUsers | true     | Whether or not the server should automtically generate a player's profile name from their user in the database                 |
| twitter.allowEdtiableProfileName     | true     | Whether or not players can edit their profile name                                                                             |
| twitter.allowDeleteTweets            | true     | Whether or not players can delete their own tweets                                                                             |
| twitter.allowReportTweets            | true     | Whether or not players can report tweets. Optional discord integration.                                                        |
| twitter.characterLimit               | 240      | Limit on how many characters tweets can contain                                                                                |
| twitter.enableAvatars                | true     | Whether or not player's can select avatars for their twitter profile                                                           |
| twitter.enableEmojis                 | true     | Whether or not player's can use emojis in tweets                                                                               |
| twitter.enableImages                 | true     | Whether or not player's can add images to tweets (external URLs)                                                               |
| twitter.maxImages                    | 3        | The maximum amount of images allowed in a tweet                                                                                |

### Discord

It is possible to perform discord integration with the phone. To configure discord add the following variables to your `server.cfg` file:

```
set discord_bot_token "YOUR_DISCORD_BOT_TOKEN"
set discord_channel_id "YOUR_DISCORD_CHANNEL_ID"
```

Current discord integrations with the phone:

- Twitter: reporting tweets


## Development

This phone is a [React](https://reactjs.org/) project with a TypeScript client/server environment.

### Prerequisites

The development environment assumes you have the following prerequisites:

1. A windows environment and Powershell as your default terminal
1. [Git for windows](https://git-scm.com/download/win) installed
1. [LTS node.js](https://nodejs.org/en/about/releases/) installed
1. [yarn](https://yarnpkg.com/) package manager installed (`npm install -g yarn`)
1. A fivem environment that is set up according to the [setting up a server instructions](https://docs.fivem.net/docs/server-manual/setting-up-a-server/) from the fivem documentation

### Development Environment

#### Steps

1. Clone the repo into your `server-data/resources/[local]` folder
1. Go into the react project: `cd phone`
1. Install node dependencies: `yarn install`
2. Install `lint-staged` globally `npm i -g lint-staged
3. Add the `new-phone-who-dis` app to your `server.cfg`
4. Start your fivem server

#### Development iteration cycle:

- If iterating on client/server Lua make your change and then `ensure new-phone-who-dis` in the fivem server terminal
- If iteration on UI changes run the project with `yarn watch` which will monitor the JavaScript project and rebuild when you make code changes and then `ensure new-phone-who-dis` after making your change
- Avoid commiting `index.html` as the development version overrides the production version
