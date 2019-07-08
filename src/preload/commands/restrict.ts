import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";

export const name = "restrict";
export const description = "Restricts a command from being used in a channel. Using `{all}` as a command argument restrics all commands and using `#{all}` as a channel argument restricts the commands in all text channels.";
export const usage = `${config.PREFIX}${name} <command 1> [command 2]... <command 1> [command 2]... [channel 1] [channel 2]...`;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES", "MANAGE_CHANNELS"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    let commands: Array<string> = [];
    let channels: Array<string> = [];
    let allCommands = false;
    let allChannels = false;

    for (let i = 0; i < args.length; i++) {
        if (args[i].match(/^<#\d+>$/)) channels.push(args[i].slice(2, -1));
        else if (args[i].toLowerCase() == "#{all}") {
            allChannels = true;
            channels.push(...msg.guild.channels.filter(channel => channel.type == "text").map(channel => channel.id));
        }
        else if (args[i].toLowerCase() == "{all}") {
            allCommands = true;
            commands.push(...bot.commands.map(command => command.name));
        }
        else commands.push(args[i]);
    }

    if (channels.length == 0) {
        channels = [ msg.channel.id ];
    }

    if (commands.includes(name)) return msg.channel.send("Restricting this command from being used here is probably not what you want to do...");

    let serverManager = bot.serverManager;
    let server = await serverManager.ensureServer(msg.guild.id);

    server.addCommandRestrictions(
        channels.map(channelID => {
            return {
                channelID,
                commands
            };
        })
    );

    await server.save();

    msg.channel.send(`Restricted in ${allChannels ? "ALL CHANNELS" : channels.map(channelID => `<#${channelID}>`).join(", ")}: \`\`\`${allCommands ? "ALL COMMANDS" : commands.join("\n")}\`\`\``);
}