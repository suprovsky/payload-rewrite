import { Message } from "discord.js";
import { Bot, Command } from "../types";
import config from "../../secure-config";

export default function handleCommand(bot: Bot, msg: Message): boolean {
    if (msg.author.bot) return false;

    if (!msg.content.startsWith(config.PREFIX)) return false;

    let command = msg.content.slice(config.PREFIX.length).trim().split(" ")[0];

    if (!bot.commands.has(command)) return false;

    (bot.commands.get(command) as Command).run(bot, msg);
    return true;
}