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