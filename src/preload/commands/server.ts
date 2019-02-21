import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import { User, UserModel, Servers } from "../../models/User";
import Rcon from "srcds-rcon";

export const name = "hello";
export const description = "A test command that also serves as a template for other commands.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text, dm"];

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
            if (!user || !user.servers) return msg.channel.send(`You have no servers added yet. Find out more with \`${config.PREFIX}help ${name}\``);

            let servers = user.servers.map(serverInfo => {
                `[${serverInfo.name}]\n\t${serverInfo.address}\n\t${serverInfo.rconPassword}`
            });

            msg.channel.send(`\`\`\`AsciiDoc\n${servers.join("\n")}\n\`\`\``);
        } else if (args[0] == "set") {
            let serverName = args[1];
            let address = args[2];
            let rconPassword = args[3];

            if (!serverName) return msg.channel.send("Missing <name> argument.");
            if (!address) return msg.channel.send("Missing <address> argument.");
            if (!rconPassword) return msg.channel.send("Missing <RCON password> argument.");

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
        } else if (args[0] == "exec") {

        } else if (args[0] == "setup") {

        }
    });
}

const VALID_ARGUMENTS = ["list", "set", "remove", "exec", "setup"];