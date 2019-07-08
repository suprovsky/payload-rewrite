import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";

export const name = "unrestrict";
export const description = "Unrestricts a command from being used in a channel. Using `#{all}` as a channel argument unrestricts the commands in all text channels.";
export const usage = `${config.PREFIX}${name} <command 1> [command 2]... [channel 1] [channel 2]...`;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES", "MANAGE_CHANNELS"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    let commands: Array<string> = [];
    let channels: Array<string> = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i].match(/^<#\d+>$/)) channels.push(args[i].slice(2, -1));
        else if (args[i].toLowerCase() == "#{all}") channels.push(...msg.guild.channels.filter(channel => channel.type == "text").map(channel => channel.id));
        else commands.push(args[i]);
    }

    if (channels.length == 0) {
        channels = [ msg.channel.id ];
    }

    let serverManager = bot.serverManager;
    let server = await serverManager.ensureServer(msg.guild.id);

    server.removeCommandRestrictions(
        channels.map(channelID => {
            return {
                channelID,
                commands
            };
        })
    );

    await server.save();

    msg.channel.send(`Unrestricted in ${channels.map(channelID => `<#${channelID}>`).join(", ")}: \`\`\`${commands.join("\n")}\`\`\``);
}