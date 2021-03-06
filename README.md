# DGG Gaming Bot

A Discord bot for the dgg gaming discord community.

## Installation

**[Node.js](https://nodejs.org) 14.0.0 or newer is required.**  
This bot uses Discord.js master version see docs [here](https://discord.js.org/#/docs/main/master/general/welcome)

Once you download the repo run `npm install` to install all the packages  
You must edit the `.env` file and put in your token and ids  
Then you can do `node bot.js` to run it.  

## Command References

| Reference   | Meaning                                           |
|-------------|---------------------------------------------------|
| {}          | Required                                          |
| ()          | Optional                                          |
| sub cmd     | A command that follows the main command (&emsp;↳) |
| duration    | number followed by `d`,`h`,`m` or `s` (eg. 10m)   |

___

## User Commands

| Command        | Arguments                                               | Description                                         |
|----------------|---------------------------------------------------------|-----------------------------------------------------|
| 0mar           |                                                         | 0MAR LMAO                                           |
| animal         | {sub cmd}                                               | Animal commands                                     |
| &emsp;↳ pic    | {animal}                                                | Random picture of the animal                        |
| &emsp;↳ fact   | {animal}                                                | Random fact of the animal                           |
| avatar         | (user)                                                  | Posts the user profile picture                      |
| bug            | {text}                                                  | Report a bug                                        |
| color          | {link}                                                  | Gets the color for an image                         |
| commands       |                                                         | Links to command list                               |
| convert        | {amount} {source} {target}                              | Converts amount from one unit to another            |
| convertlist    | (measurement)                                           | List all measurement or units of measurement        |
| currency       | {amount} {source} {target}                              | Converts amount from one currency to another        |
| define         | {phrase}                                                | Gets definition of a phrase via urban dictionary    |
| emotes         | {timeframe} {size}                                      | Shows emote useage                                  |
| fact           |                                                         | Gets a random fact                                  |
| feature        | {text}                                                  | Request a feature                                   |
| feeds          |                                                         | Lists all the feeds                                 |
| info           |                                                         | Shows uptime and ping                               |
| list           |                                                         | Shows list of temporarily roled users               |
| minesweeper    |                                                         | Starts a game of minesweeper                        |
| raw            | {input}                                                 | Shows raw input of message (what bot sees)          |
| scrabble       | {sub cmd}                                               | Scrabble commands                                   |
| &emsp;↳ create |                                                         | Creates a game of scrabble                          |
| &emsp;↳ place  | {row} {column} {direction} {word}                       | Place a word in a current scrabble word             |
| shame          |                                                         | Shows list of indefinitely roled users              |
| tictactoe      | {user}                                                  | Starts a game of tic tac toe with another user      |
| time           | {location}                                              | Gets the local time of a location                   |
| translate      | {phrase}                                                | Translates a phrase into english                    |
| trinomial      | {difficulty}                                            | Gives a factorisation trinomial question and answer |
| trivia         | {category} {difficulty}                                 | Gets a trivia question you can answer               |
| vote           | {duration} {question} {answer1} {answer2} (answer3...9) | Starts a vote for specified duration                |
| weather        | {unit} {location}                                       | Gets current weather from a location                |

___

## Specific Role Commands

| Command       | Arguments             | Description                        |
|---------------|-----------------------|------------------------------------|
| gamble        | {sub cmd}             | Gamble commands                    |
| &emsp;↳ duel  | {role} {user}         | Creates a duel with another player |
| &emsp;↳ odds  | {role} {odds}         | Basic odds gamble                  |
| &emsp;↳ horse | {role} {horse number} | Horse racing gamble                |

___

## Mod Commands

| Command          | Arguments                                   | Description                                                                        |
|------------------|---------------------------------------------|------------------------------------------------------------------------------------|
| feed             | {sub cmd}                                   | Feed commands                                                                      |
| &emsp;↳ list     |                                             | Lists all the subs in the feed of the current channel                              |
| &emsp;↳ create   |                                             | Creates a new feed in the current channel                                          |
| &emsp;↳ delete   |                                             | Deletes the feed in the current channel                                            |
| &emsp;↳ sub      | {subreddit}                                 | Adds subreddit to feed in the current channel                                      |
| &emsp;↳ unsub    | {subreddit}                                 | Removes subreddit from the feed in the current channel                             |
| &emsp;↳ interval | (seconds)                                   | Shows current interval or updates the interval for the feed in the current channel |
| mute             | {user} {duration}                           | Gives user mute role for duration                                                  |
| roles            | {sub cmd}                                   | Roles commands                                                                     |
| &emsp;↳ reload   |                                             | Reloads role channel message                                                       |
| &emsp;↳ remove   | {name}                                      | Remove a role from the roles channel                                               |
| &emsp;↳ add      | {category} {name} {role} {emoji} (position) | Adds a role to the roles channel                                                   |
| weeb             | {user} {duration}                           | Gives user weeb role for duration                                                  |
| wizard           | {user} {duration}                           | Gives user wizard role for duration                                                |

___

## Bot Manager Commands

| Command        | Arguments         | Description                       |
|----------------|-------------------|-----------------------------------|
| slash          |                   | Slash Commands                    |
| &emsp;↳ delete | (id)              | Deletes one or all slash commands |
| &emsp;↳ reload |                   | Reloads all slash commands        |
| emotesync      | {old id} {new id} | Syncs emotes in emote useage      |
