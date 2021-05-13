# DGG Gaming Bot
A Discord bot for the dgg gaming discord community.

## Command References

| Reference   | Meaning                                         |
|-------------|-------------------------------------------------|
| {}          | Required                                        |
| ()          | Optional                                        |
| `argument`  | literal (exactly what it shows)                 |
| **command** | slash command available                         |
| duration    | number followed by `d`,`h`,`m` or `s` (eg. 10m) |

___

## User Commands

| Command        | Arguments                                               | Description                                         | Example               |
|----------------|---------------------------------------------------------|-----------------------------------------------------|-----------------------|
| **!commands**  |                                                         | Links to this readme                                | !commands             |
| **!info**      |                                                         | Shows uptime & ping                                 | !info                 |
| **!list**      |                                                         | Shows list of temporarily roled users               | !list                 |
| **!shame**     |                                                         | Shows list of indefinitely roled users              | !shame                |
| !timeleft      | (@user)                                                 | Gets timeleft of a temporary role                   | !timeleft @Mitch      |
| !emotes        | (`total`) (`all`)                                       | Shows emote usage                                   | !emotes total         |
| **!raw**       | {message}                                               | Shows raw input of message (what bot sees)          | !raw @Mitch nice bot  |
| **!currency**  | {ammount} {source currency} {target currency}           | Converts currency                                   | !currency 150 nzd usd |
| **!define**    | {phrase}                                                | Gets definition of a phrase via urban dictionary    | !define New Zealand   |
| **!translate** | {phrase}                                                | Translate a phrase into english                     | !translate Hej        |
| **!time**      | {location}                                              | Gets the local time of a location                   | !time New Zealand     |
| **!weather**   | {location}                                              | Gets weather from a location                        | !weather New Zealand  |
| !roll !r       | {number}`d`{number} (`+`number) (`-`number) (`d`number) | Rolls a dice with optional modifiers                | !roll 1d6+2           |
| **!trinomial** | {`easy`/`medium`/`hard`}                                | Gives a factorisation trinomial question and answer | !trinomial medium     |

___

## Mod Commands

| Command        | Arguments                                                                    | Description                                  | Example                                     |
|----------------|------------------------------------------------------------------------------|----------------------------------------------|---------------------------------------------|
| !disable       |                                                                              | Disables the bot if it's acting up           | !disable                                    |
| !enable        |                                                                              | Enables the bot if disabled                  | !enable                                     |
| !mute          | {@user} {duration}                                                           | Gives mentions user mute role for duration   | !mute @Andlin 1h                            |
| !weeb          | {@user} {duration}                                                           | Gives mentions user weeb role for duration   | !weeb @Nezz 7d                              |
| !wizard        | {@user} {duration}                                                           | Gives mentions user wizard role for duration | !wizard @Samekonge 10s                      |
| !unmute        | {user id}                                                                    | Umutes a user from user id                   | !unmute 399186129288560651                  |
| !vote          | {question`?`} {answer} `or` {answer} ... `or` (answer)                       | Starts a 30s vote                            | !vote Pineapple on pizza? Yes or No         |
| ~~!pin~~       | ~~{message id}~~                                                             | ~~Pins message to pin channel~~              |~~!pin 816082245391089664~~                  |
| !add           | {`gaming`/`general`} {name} {role id/@role} {:emoji:} (position in category) | Adds a role to the roles channel             | !add gaming AmongUs 773111468836519936 🔪 1 |
| !remove        | {name}                                                                       | Removes a role from the roles channel        | !remove AmongUs                             |
| **!reload**    |                                                                              | Reloads roles channel if bugged              | !reload                                     |
| !feed list     |                                                                              | Lists all the subs in the feed               | !feed list                                  |
| !feed sub      | {subreddit name}                                                             | Adds subreddit to feed                       | !feed sub memes                             |
| !feed unsub    | {subreddit name}                                                             | Removes subreddit from feed                  | !feed unsub memes                           |
| !feed interval | (interval in seconds)                                                        | Shows current interval or updates interval   | !feed interval 900                          |
