# New Phone Who Dis

### Production Server Installation **(WIP)**

**Database**

*New Phone Who Dis (NPWD)* uses its own database driver compatible with `mysql-async` and `ghmattimysql`'s connection string. If you
don't utilize these resources, ensure you have this set in your console.

```
set mysql_connection_string "server=127.0.0.1;database=es_extended;userid=user;password=pass"
```

### Configuration

This resource is highly configurable through the [config.json](./config.json). This JSON file holds configuration for the phone itself, for the apps running on it and peripheral information.

Below is the list of current configuration options **(WIP)**: 

| Option                               | Default  | Description                                                                                                                    |
| ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
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
| twitter.characterLimit               | 160      | Limit on how many characters tweets can contain                                                                                |
| twitter.newLineLimit                 | 10       | Limit on how many new lines a message can contain                                                                              |
| twitter.enableAvatars                | true     | Whether or not player's can select avatars for their twitter profile                                                           |
| twitter.enableEmojis                 | true     | Whether or not player's can use emojis in tweets                                                                               |
| twitter.enableImages                 | true     | Whether or not player's can add images to tweets (external URLs)                                                               |
| twitter.maxImages                    | 3        | The maximum amount of images allowed in a tweet                                                                                |

### Discord

To configure Discord integration; add the following variables to your `server.cfg` file:

```
set discord_bot_token "YOUR_DISCORD_BOT_TOKEN"
set discord_channel_id "YOUR_DISCORD_CHANNEL_ID"
```

Current Discord integrations with the phone **(WIP)**:

- Twitter: reporting tweets

## Development

This resource is a [React](https://reactjs.org/) project with a TypeScript client/server environment.

### Prerequisites

The development environment assumes you have the following prerequisites:

1. A windows environment and Powershell as your default terminal.
1. [Git for windows](https://git-scm.com/download/win) installed
1. [LTS node.js](https://nodejs.org/en/about/releases/) installed
1. [yarn](https://yarnpkg.com/) package manager installed (`npm install -g yarn`)
1. A fivem environment that is set up according to the [setting up a server instructions](https://docs.fivem.net/docs/server-manual/setting-up-a-server/) from the fivem documentation.

### Development Environment

#### Steps

1. Clone the repo into your `server-data/resources/` folder. The path will be `server-data\resources\new-phone-who-dis`. **Don't clone the repo into a sub folder.**
1. Ensure the resource folder is named `new-phone-who-dis`.
1. Import the [sql file](https://github.com/project-error/new-phone-who-dis/blob/master/resources/import.sql) into your database.
1. Add `ensure new-phone-who-dis` to your `server.cfg`.
1. Make your configurations in the [config.json](https://github.com/project-error/new-phone-who-dis/blob/master/config.json) **before** building the phone.
1. Open **Windows Powershell** or a terminal in **Visual Studio Code**
1. Change your directiory into `new-phone-who-dis\phone` *like so*: `cd A:\FXServer\server-data\resources\new-phone-who-dis\phone`
1. Install node dependencies with `yarn install`.
1. Build in the current directory with `yarn build`.
1. Change your directiory into `new-phone-who-dis\resources` *like so*: `cd A:\FXServer\server-data\resources\new-phone-who-dis\resources`
1. Install node dependencies with`yarn install`.
1. Build in the current directory with `yarn build`.
1. Start your fivem server

#### Development iteration cycle:
- You must rebuild the resource following any changes by doing `yarn build` in the `resources` and `phone` folder.
- If iteration on UI changes run the project with `yarn watch` which will monitor the JavaScript project and rebuild when you make code changes and then do `ensure new-phone-who-dis` after making your change.
- Avoid commiting `index.html` as the development version overrides the production version

#### Important Note

By installing NPWD you agree to the use of the following diagnostic package, Sentry, (in use within the React portion of NPWD), that automatically
uploads relevant sesssion details and stack traces whenever an exception is thrown. We use these metrics to further
improve the quality of the phone. To explicitly disable this (we urge you not to as its incredibly useful metrics for us).
Please change the `SentryErrorMetrics` setting to `false` in `phone/config/default.json` and rebuild the phone.
