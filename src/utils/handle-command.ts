import { Message, PermissionResolvable, TextChannel, Permissions } from "discord.js";
import { Bot, Command } from "../types";
import config from "../../secure-config";

export default async function handleCommand(bot: Bot, msg: Message): Promise<boolean> {
    if (msg.author.bot) return false;

    if (!msg.content.toLowerCase().startsWith(config.PREFIX)) return false;

    let command = msg.content.slice(config.PREFIX.length).trim().split(" ")[0];

    if (!bot.commands.has(command)) return false;

    let executableCommand = bot.commands.get(command) as Command;

    if (!executableCommand.zones.includes(msg.channel.type)) return false;

    console.log("in channel");
    
    if (msg.channel.type == "text") {
        let canBeExecutedBy = executableCommand.canBeExecutedBy as PermissionResolvable;
        let permissionsNeeded = executableCommand.permissions as PermissionResolvable;

        if (!((msg.channel as TextChannel).permissionsFor(msg.author) as Permissions).has(canBeExecutedBy)) return false;

        if (!((msg.channel as TextChannel).permissionsFor(bot.user) as Permissions).has(permissionsNeeded)) return false;
    }

    try {
        await executableCommand.run(bot, msg);
    } catch (err) {
        console.warn("Error while executing command " + command, err);
    }

    msg.channel.stopTyping(true);

    return true;
}