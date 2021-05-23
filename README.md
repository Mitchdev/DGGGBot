# DGG Gaming Bot

A Discord bot for the dgg gaming discord community.

## Command References

| Reference   | Meaning                                         |
|-------------|-------------------------------------------------|
| {}          | Required                                        |
| ()          | Optional                                        |
| `argument`  | literal (exactly what it shows)                 |
| duration    | number followed by `d`,`h`,`m` or `s` (eg. 10m) |

___

## User Commands

| Command        | Arguments                                               | Description                                         |
|----------------|---------------------------------------------------------|-----------------------------------------------------|
| !commands      |                                                         | Links to this readme                                |
| !info          |                                                         | Shows uptime & ping                                 |
| !list          |                                                         | Shows list of temporarily roled users               |
| !shame         |                                                         | Shows list of indefinitely roled users              |
| !emotes        | (`total`) (`all`)                                       | Shows emote usage                                   |
| !avatar        | (@user)                                                 | Posts the user profile picture                      |
| !raw           | {message}                                               | Shows raw input of message (what bot sees)          |
| !currency      | {ammount} {source currency} {target currency}           | Converts currency                                   |
| !define        | {phrase}                                                | Gets definition of a phrase via urban dictionary    |
| !translate     | {phrase}                                                | Translate a phrase into english                     |
| !time          | {location}                                              | Gets the local time of a location                   |
| !weather       | {unit} {location}                                       | Gets weather from a location                        |
| !roll !r       | {number}`d`{number} (`+`number) (`-`number) (`d`number) | Rolls a dice with optional modifiers                |
| !trinomial     | {`easy`/`medium`/`hard`}                                | Gives a factorisation trinomial question and answer |
| !vote          | {question`?`} {answer} `or` {answer} ... `or` (answer)  | Starts a 30s vote                                   |

___

## Mod Commands

| Command        | Arguments                                                                    | Description                                  |
|----------------|------------------------------------------------------------------------------|----------------------------------------------|
| !disable       |                                                                              | Disables the bot if it's acting up           |
| !enable        |                                                                              | Enables the bot if disabled                  |
| !mute          | {@user} {duration}                                                           | Gives mentions user mute role for duration   |
| !weeb          | {@user} {duration}                                                           | Gives mentions user weeb role for duration   |
| !wizard        | {@user} {duration}                                                           | Gives mentions user wizard role for duration |
| !add           | {`gaming`/`general`} {name} {role id/@role} {:emoji:} (position in category) | Adds a role to the roles channel             |
| !remove        | {name}                                                                       | Removes a role from the roles channel        |
| !reload        |                                                                              | Reloads roles channel if bugged              |
| !emotesync     | {old emote id} {new emote id}                                                | Syncs emotes in emote usage                  |
| !feeds         |                                                                              | Lists all the feeds                          |
| !feed list     |                                                                              | Lists all the subs in the feed               |
| !feed create   |                                                                              | Creates a new feed in current channel        |
| !feed delete   |                                                                              | Deletes feed in current channel              |
| !feed sub      | {subreddit name}                                                             | Adds subreddit to feed                       |
| !feed unsub    | {subreddit name}                                                             | Removes subreddit from feed                  |
| !feed interval | (interval in seconds)                                                        | Shows current interval or updates interval   |
