import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";

export const name = "unrestrict";
export const description = "Unrestricts a command from being used in a channel.";
export const usage = `${config.PREFIX}${name} <command 1> [command 2]...`;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES", "ADMINISTRATOR"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    let serverManager = bot.serverManager;
    let server = await serverManager.ensureServer(msg.guild.id);

    server.removeCommandRestrictions([
        { channelID: msg.channel.id, commands: args }
    ]);

    await server.save();

    msg.channel.send(`Unrestricted in ${msg.channel.toString()}: \`\`\`${args.join("\n")}\`\`\``);
}