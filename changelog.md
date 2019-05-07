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