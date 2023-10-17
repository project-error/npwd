<div align="center">
    <img href="https://projecterror.dev" width="150" src="https://user-images.githubusercontent.com/55056068/147729117-5ab762d8-44be-48f0-bc33-a6664061b6cf.png" alt="Material-UI logo" />
</div>
<h1 align="center">NPWD</h1>

<div align="center">

[![Discord](https://img.shields.io/discord/791854454760013827?label=Our%20Discord)](https://discord.com/invite/HYwBjTbAY5)

[**Watch the NPWD Trailer**](https://www.youtube.com/watch?v=Yh8gT8wuywU)

![2-1](https://user-images.githubusercontent.com/55056068/147857192-cd8502e6-fb38-4975-b182-4aaaeadff877.png)

</div>

## Monorepo structure

### Apps

- `phone`: The React code for NPWD.
- `game`: Game releated scripts and code that runs on the client/server-side in FiveM.

### Packages

- `npwd-hooks`: Hooks used throughout external apps. Mainly to communicate with `npwd` through custom window events.
- `npwd-types`: Auto-generated types from NPWD that can be used in external apps.
- `database`: Database configuration and classes for each app
- `logger`: Logging lib with `winston`
- `config`: NPWD related config functions

## Standalone Information & Installation

We have designed _NPWD_ to be generally framework agnostic, meaning that it can easily be
integrated with both popular open source frameworks like ESX & QBCore or any arbitary
custom framework.

For further details on this system, please refer to our installation [documentation](https://projecterror.dev/docs/npwd/start/installation).

You will also need [screenshot-basic](https://github.com/project-error/screenshot-basic).

## Technical Stack and Development

_NPWD_ uses React + TypeScript to form the NUI front end and uses TypeScript (V8 runtime) for game
scripts. You can find more technical information regarding the development of this project on our docs
page [here](https://projecterror.dev/docs/npwd/dev/dev_bootstrap).

## Feature Request & Issue Reporting

Please open an issue/enhancement on our [Github Repo](https://github.com/project-error/npwd/issues/new/choose). This is the best way for us to track what needs to be resolved or improved upon.

## Features

- [Optimized](https://i.imgur.com/mN5ib42.png)
  - 0.01 ms on idle and 0.05 while in use.
- [Twitter](https://i.imgur.com/BjwovRR.png)
  - Like, reply, retweet, report and delete your own Tweets.
  - Send emojis and images directly from the phone's gallery, or from an external url. _Gifs too!_
  - NPWD features discord logging so all reported tweets will be sent to the configured webhook.
  - Log tweets directly to discord with configured webhook.
- [Matchmaker](https://i.imgur.com/46XtZ06.jpeg)
  - Like tinder but without all the bots. Swipe right into romance or rejection.
  - As of v1.0, there is no filter for sexual preference.
  - Don't want this app? Follow the documentation [here](https://projecterror.dev/docs/npwd/dev/disable_apps) to disable it.
- [Marketplace](https://user-images.githubusercontent.com/55056068/147530933-d56ceb19-0db2-471f-a8ca-7cc3986b87be.png)
  - Post an ad with/without a picture.
  - Choose a picture from your gallery or from a url.
  - Features calling/messaging icons so no need to provide your number.
- [Text Messaging](https://i.imgur.com/9vFHqhW.png)
  - Send a message or an image taken straight from the phones Gallery.
  - Group messages
- [Calling](https://i.imgur.com/7T0JbQl.png)
  - Call anyone from anywhere.
- [Camera](https://i.imgur.com/Fk6wQkg.png)
  - Take pictures of oneself or your surroundings.
  - All pictures save to the gallery where they can be retrieved with a copyable link.
  - As of v1.0, there is currently [two photo modes](https://i.imgur.com/pole8bA.jpeg) for front/rear camera.
- [Contacts](https://i.imgur.com/Qxs35rj.png)
  - Add a phone number to your contacts for easier access.
  - Supports up to 19 characters for phone number by default and easily changed within the
  - Gif support for avatar.
  - Quickly call, text, and with additional configuration send money.
- [Notes](https://i.imgur.com/0Hvvlah.png)
  - Something you want to remember in game? Make a note!
- [Calculator](https://user-images.githubusercontent.com/55056068/147531020-b7527a69-0b0e-4e81-83c7-58ad836eab23.png)
  - Peform calculations.
- [Themes](https://i.imgur.com/2DpBHuM.png)
  - Default dark theme or light theme with other themes in the works. Want to make your own? Follow our [documentation](https://projecterror.dev/docs/npwd/dev/setup#setting-up-the-theme).
  - Set within the Settings app.
- [6 Custom Cases/Frames](https://i.imgur.com/opyF0J1.png)
  - These cases were made by [DayIsKuan](https://github.com/dayiskuan)
  - Set within the Settings app.
- [Icon Sets](https://i.imgur.com/z7pyrmU.png)
  - Change between material UI icons or our custom made icons.
  - Want to make your own? Follow our [documentation](https://projecterror.dev/docs/npwd/dev/setup#adding-icons).
  - Set within the Settings app.
- [Notifications - Closed](https://i.imgur.com/j474Sc2.png)
  - While closed, only a portion of it will render to display a notification.
  - As of v1.0, this is currently used for calls, text and tweets.
- [Notifications - Open](https://i.imgur.com/33BlJn6.png)
  - While open, all notifications occur across the top of the phone.
  - View [missed notifications](https://i.imgur.com/3B4Ezyq.png) by clicking on the phone's header.
- [Streamer Mode](https://i.imgur.com/jzU075n.png)
  - A mode designed for streamers where images are hidden unless clicked.
  - This applies across all apps on the phone.
  - Easily set within the phone's setting app.
- [Settings Configuration](https://user-images.githubusercontent.com/55056068/147530852-78934a48-b478-472c-b7f4-61860e4f8479.mp4)
  - Use a slider to set ringtone and notification alert volume.
  - Copy your phone number to clipboard for easy sharing.
  - Configure a chosen ringtone or alert sound.
  - Choose betwen **twelve** languages as of v1.0.
  - Change frames, icon sets and themes.
  - Adjust Zoom (100% to 70%).
  - Filter notification preferences.
- Discord Logging
  - Follow our [documentation](https://projecterror.dev/docs/npwd/start/installation#setting-up-discord-log-integration) for intial setup.
  - Never used a webhook before? Follow Discord's [documentation](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) for creating a webhook.

## Final words

A special thanks to all the people who have helped out with the translations! You have all been amazing.

Thanks to [Ultrahacx](https://github.com/ultrahacx) for all the artwork and animations seen in the trailer and this post.
