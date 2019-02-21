import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { parse } from "../../utils/parse-arguments";
import { User, UserModel } from "../../models/User";

export const name = "hello";
export const description = "A test command that also serves as a template for other commands.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text, dm"];

export function run(bot: Bot, msg: Message) {
    let args = parse(msg.content.slice(config.PREFIX.length + name.length));


    User.findOne({
        id: msg.author.id
    }, (err, user: UserModel) => {
        if (err) return msg.channel.send("Error while fetching your user data.");

        // Here we go...
        // Probably going to think of a better way to do this later.
        if (!args) return msg.channel.send(`Missing initial argument. Use \`${config.PREFIX}help ${name}\` to find out how to use this command.`);

        if (!VALID_ARGUMENTS.includes(args[0])) return msg.channel.send("Invalid initial argument. Must be one of the following: `" + VALID_ARGUMENTS + "`.");

        if (args[0] == "list") {
            
        } else if (args[0] == "set") {

        } else if (args[0] == "exec") {

        } else if (args[0] == "setup") {

        }
    });
}

const VALID_ARGUMENTS = ["list", "set", "exec", "setup"];