## Changelog
### 2.0.0
* Fixed a bug where Payload would keep typing in a channel for reasons unknown.
* Fixed ESEA match result previews.
* Fixed steam connect links being wonky with some passwords.
* Fixed the Payload user count to not include duplicate users.
* Fixed formatting for TFTV thread previews.
* Migrated from SQLite to MongoDB for data storage.
* Added log stats tracking for users who linked their Steam ID using the `link` command.
* Added the ability to use custom community IDs with the `link` command.
* Added several new commands:
    * help
    * invite
    * playercheck
    * r34
    * server
    * user
* Added ability to find out more about a command by using the help command (pls help command)
* Added the following automatic link previews:
    * etf2l teams
* Removed outdated commands:
    * status
    * exec
    * rcon
    * restrict
* Removed the `rgl` command until further notice.
* Removed the special admin syntax (**command).
### 2.0.1
* Added variety to the output of the `r34` command.
### 2.0.2
* Fixed a bug where TFTV thread previews would have the wrong post timestamp.
### 2.1.0
* Added the `changelog` command.
### 2.2.0
* Added the `choose` command.
### 2.2.1
* Updated `r34` to determine the top rated post from a smaller random sample size to increase potential results (it's hard to explain just look at `src/preload/commands/r34.ts`).
### 2.3.0
* Added the `music` command.
### 2.3.1
* Disabled the `music` command temporarily.
### 2.3.2
* Fixed a bug in the `combine` command where incorrect data would be sent to Logify resulting in an error.
### 2.3.3
* Added server querying for connect info generation.
### 2.3.4
* Added `bruh`.
### 2.3.5
* Added highlander.tf thread previews.
### 2.3.6
* Fixed URL matching for highlander.tf thread previews.
### 2.3.7
* Added case insensitivity for the command prefix.
### 2.3.8
* Added avatar URL to `user` command.
### 2.4.0
* Added `purge`.
* Payload will now show information in its status.
### 2.5.0
* Added `findping`.
### 2.5.1
* Added a good bot response.
### 2.6.0
* Added a framework for image manipulation commands!
* Added a way to remove iFunny watermarks: `nofunny`.
### 2.6.1
* Added new image modification commands:
    * `focus`
    * `sans`
* Use `pls help` on each of these commands to learn more!
### 2.6.2
* Added the `avatar` command.
### 2.6.3
* Added the `gibus` command.
### 2.6.4
* Added preparations for new log combiner update.
* Fixed `link` thinking numerical steam IDs are invalid.
### 2.7.0
* Now enforcing unique logs.tf API keys.
* Added `config`.
* Added clickable link to `logs` response.
### 2.7.1
* Reduced the character limit of forum post previews to 400 (from 1000).
    * Applies to both TFTV and HLTF forums post previews.
### 2.7.2
* Preparing for a semi-major update:
    * Added user config option for notifications.
    * Updated user database schema to include `notificationsLevel` and `latestUpdateNotifcation`.
### 2.8.0
* Added notifications.
    * You can select the level of notifications you'd like to be opted in to. Type `pls help config` for more info.
* Fixed a bug in the `config` command where a user without prior db entry creation using the command would break everything.
* Fixed `snipe` crashing the bot when scanning messages in DMs.
* Yes, I've noticed that payload.tf is down and will eventually get it back up.
### 2.8.1
* Fixed the `combine` command (finally).
### 2.9.0
* Added the `translate` command.
* Improved opt-out message for update notifications.
* Re-organized notification opt-in levels to the following:
    * 2: Send major and minor notifcations.
    * 1: Send only major notifications.
    * 0: Don't send notifications.
* Changed help and feedback text in various commands to be more clear.
* Updated localization files.
### 2.9.1
* Fixed the `translate` command having shitty regex checks and crashing the bot.
### 2.10.0
* Added the ability to restrict commands from being used in specific channels.
    * Find out more with `pls help restrict` and `pls help unrestrict`.
* Added the `pushcart` command.
### 2.10.1
* Improved the `restrict` and `unrestrict` syntax to allow for more versatility:
    * Added the ability to select channels.
    * Added the ability to select all commands with `{all}`.
    * Added the ability to select all channels with `#{all}`.
    * Example: `pls restrict pushcart #{all}`.
        * Restricts the pushcart command in all text channels.
* Added the `leaderboard` command.
    * View the global pushcart leaderboard!
* Internal changes to allow for scheduled tasks to be easier to write.
* Fixed the alignment of the gibus hat in the `gibus` command.
### 2.11.1
* Rewrote how commands are handled internally (took a long-ass time).
* Lots of command changes:
    * help
        * No longer displays long blocks of text.
        * Information for commands with subcommands is seperated by subcommand.
            * e.g. `pls help config notifications` is now valid.
    * pushcart
        * Added a daily limit of 1000 points.
        * Moved `leaderboard` and `rank` commands to be subcommands of `pushcart`.
        * Added the ability to view other users' ranks.
        * Added the `gift` subcommand. Gift points to other users!
    * restrict/unrestrict
        * Made feedback messages less spammy when using {all} tags.
    * rtd
        * Added the ability to roll multiple dice at once.
    * server
        * Cleaned up dead subcommands.
    * user
        * Fixed bug where users with no logs recorded would be missing info.
        * Added point count to the user info display.
* Internal changes:
    * Added caching for DB in all commands. Things should be faster now.
* Made feedback messages more consistent in the way things are phrased.
* `pls bruh` is 100% more bruh.
* Fixed "Payload is typing..." issues across the board.
### 2.11.2
* Fixed an issue with the `pls pushcart gift` command that would allow users to gift negative points.