# New Phone README TITLE

TODO

## Production Server Installation

TODO

## Development

This phone is a [React](https://reactjs.org/) project with a LUA client/server environment.

### Prerequisites

The development environment assumes you have the following prerequisites:

1. A windows environment and Powershell as your default terminal
1. [Git for windows](https://git-scm.com/download/win) installed
1. [LTS node.js](https://nodejs.org/en/about/releases/) installed
1. [yarn](https://yarnpkg.com/) package manager installed (`npm install -g yarn`)
1. A fivem environment that is set up according to the [setting up a server instructions](https://docs.fivem.net/docs/server-manual/setting-up-a-server/) from the fivem documentation

### Development Environment

1. Clone the repo into your `server-data/resources/[local]` folder
1. Go into the react project: `cd phone`
1. Install node dependencies: `yarn install`
2. Install `lint-staged` globally `npm i -g lint-staged
3. Add the `new-phone-who-dis` app to your `server.cfg`
4. Start your fivem server

Development iteration cycle:
- If iterating on client/server LUA make your change and then `restart new-phone-who-dis` in the fivem server terminal
- If iteration on UI changes run the project with `yarn watch` which will monitor the JavaScript project and rebuild when you make code changes and then `restart new-phone-who-dis` after making your change
