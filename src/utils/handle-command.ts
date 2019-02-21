import { Message, PermissionResolvable, TextChannel, Permissions } from "discord.js";
import { Bot, Command } from "../types";
import config from "../../secure-config";

export default function handleCommand(bot: Bot, msg: Message): boolean {
    if (msg.author.bot) return false;

    if (!msg.content.startsWith(config.PREFIX)) return false;

    let command = msg.content.slice(config.PREFIX.length).trim().split(" ")[0];

    if (!bot.commands.has(command)) return false;

    let executableCommand = bot.commands.get(command) as Command;
    
    if (msg.channel.type == "text") {
        let canBeExecutedBy = executableCommand.canBeExecutedBy as PermissionResolvable;
        let permissionsNeeded = executableCommand.permissions as PermissionResolvable;

        if (!((msg.channel as TextChannel).permissionsFor(msg.author) as Permissions).has(canBeExecutedBy)) return false;

        if (!((msg.channel as TextChannel).permissionsFor(bot.user) as Permissions).has(permissionsNeeded)) return false;
    }

    executableCommand.run(bot, msg);
    return true;
}