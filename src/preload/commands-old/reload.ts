import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { Command } from "../../types/Command";

export const name = "reload";
export const description = "Reloads a command.";
export const usage = config.PREFIX + name + " <command>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];
export const requiresRoot = true;

export async function run(bot: Bot, msg: Message) {
    let commandName = msg.content.slice(config.PREFIX.length + name.length).trim().toLowerCase();

    if (!bot.commands.has(commandName)) return msg.channel.send("Command `" + commandName + "` doesn't exist.");

    let commandExecutable: Command = require("./" + commandName);

    bot.commands.set(commandName, commandExecutable);

    msg.channel.send(`Reloaded \`${commandName}\`.`);
}