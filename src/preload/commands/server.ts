import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import { User, UserModel, Servers } from "../../models/User";
import Rcon from "srcds-rcon";

export const name = "server";
export const description = "list: Lists your servers.\nset: Adds a server to your list.\nremove: Removes a server from your list.\nexec: Executes a command on one of your servers.\nsetup: Automatically sets up one of your servers for a map in a certain league and gamemode.\n\nNOTES: <name> is a name you give your server to retrieve later.";
export const usage = `${config.PREFIX}${name} list\n${config.PREFIX}${name} set <name> <address> <rcon password>\n${config.PREFIX}${name} remove <name>\n${config.PREFIX}${name} exec <name> <command>\n${config.PREFIX}${name} setup <league> <gamemode> <map>`;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    User.findOne({
        id: msg.author.id
    }, (err, user: UserModel) => {
        if (err) return msg.channel.send("Error while fetching your user data.");

        // Here we go...
        // Probably going to think of a better way to do this later.
        if (!args) return msg.channel.send(`Missing initial argument. Use \`${config.PREFIX}help ${name}\` to find out how to use this command.`);

        if (!VALID_ARGUMENTS.includes(args[0])) return msg.channel.send("Invalid initial argument. Must be one of the following: `" + VALID_ARGUMENTS + "`.");

        if (args[0] == "list") {
            if (!user || !user.servers ||!user.servers.length) return msg.channel.send(`You have no servers added yet. Find out more with \`${config.PREFIX}help ${name}\``);

            let servers = user.servers.map(serverInfo => {
                return `[${serverInfo.name}]\n\t${serverInfo.address}\n\t${serverInfo.rconPassword}`
            });

            msg.channel.send(`\`\`\`AsciiDoc\n${servers.join("\n")}\n\`\`\``);
        } else if (args[0] == "set") {
            let serverName = args[1];
            let address = args[2];
            let rconPassword = args[3];

            if (!serverName) return msg.channel.send("Missing <name> argument.");
            if (!address) return msg.channel.send("Missing <address> argument.");
            if (!rconPassword) return msg.channel.send("Missing <rcon password> argument.");

            if (!user) {
                user = new User({
                    id: msg.author.id,
                    servers: []
                });
            }

            if ((user.servers as Servers).find((server => server.name == serverName))) {
                let index = (user.servers as Servers).findIndex((server => server.name == serverName));
                let server = (user.servers as Servers)[index];

                server = {name: serverName, address, rconPassword};

                (user.servers as Servers)[index] = server;
            } else {
                let server = {name: serverName, address, rconPassword};

                (user.servers as Servers).push(server);
            }

            user.save().then(() => {
                msg.channel.send(`Set server \`${serverName}\` to \`${address}; ${rconPassword}\``);
            }).catch((err => {
                msg.channel.send("Error saving server.");
            }));
        } else if (args[0] == "remove") {
            let targetServer = args[1];

            if (!targetServer) return msg.channel.send("Missing <name> argument.");

            if (!user || !user.servers) return msg.channel.send(`You have no servers added yet. Find out more with \`${config.PREFIX}help ${name}\``);

            let serverIndex = (user.servers as Servers).findIndex(server => server.name == targetServer);

            if (serverIndex < 0) return msg.channel.send(`\`${targetServer}\` does not exist under your account.`);

            user.servers.splice(serverIndex, 1);

            user.save().then(() => {
                msg.channel.send(`Removed server \`${targetServer}\` from your list.`);
            }).catch(err => {
                msg.channel.send("Error removing server.");
            })
        } else if (args[0] == "exec") {
            let targetServer = args[1];
            let command = args[2];

            if (!targetServer) return msg.channel.send("Missing <name> argument.");
            if (!command) return msg.channel.send("Missing <command> argument.");

            if (!user || !user.servers) return msg.channel.send(`You have no servers added yet. Find out more with \`${config.PREFIX}help ${name}\``);

            let server = (user.servers as Servers).find(server => server.name == targetServer);

            if (!server) return msg.channel.send(`\`${targetServer}\` does not exist under your account.`);

            let connection = Rcon({
                address: server.address,
                password: server.rconPassword
            });

            connection.connect().then(() => {
                connection.command(command).then(res => {
                    msg.channel.send("Command sent to server. Console output shown below:");

                    let responses = res.match(/.{1,1500}/g) as RegExpMatchArray;
                    responses.slice(0, 3).forEach(section => {
                        msg.channel.send("```" + section + "```");
                    });

                    connection.disconnect();
                }).catch(err => {
                    msg.channel.send("Error sending command to your server.");
                });
            }).catch(err => {
                msg.channel.send("Error connecting to your server. Make sure the address and rcon password are valid.");
            });
        } else if (args[0] == "setup") {
            let league = args[1];
            let gamemode = args[2];
            let map = args[3];

            if (!league) return msg.channel.send("Missing <league> argument.");
            if (!gamemode) return msg.channel.send("Missing <gamemode> argument.");
            if (!map) return msg.channel.send("Missing <map> argument.");
        }
    });
}

const VALID_ARGUMENTS = ["list", "set", "remove", "exec", "setup"];