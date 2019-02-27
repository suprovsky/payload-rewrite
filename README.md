# Payload-Rewrite
God this is going to take so much time.

**READY TO GO LIVE**

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

## Changes in Payload v2
- [ ] pugging features

## TODO

### Commands
- [x] 8ball
- [x] rtd
- [x] steam linking
- [x] logs from profile
- [x] log combiner
- [x] players in a server
- [x] exec command in tf2 server
- [ ] setup tf2 server for gamemode
- [ ] pugging commands
- [x] snipe

### Automatic Functions
- [x] steam connect link
- [x] log previews
- [x] esea match previews
- [x] tftv thread previews
- [ ] ugc team previews
- [ ] esea team previews
- [x] rgl team previews
- [x] etf2l team previews