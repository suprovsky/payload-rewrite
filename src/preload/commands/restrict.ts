import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import ServerManager from "../../lib/ServerManager";

export const name = "restrict";
export const description = "Restricts a command from being used in a channel.";
export const usage = `${config.PREFIX}${name} <command 1> [command 2]...`;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES", "ADMINISTRATOR"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    if (args.includes(name)) return msg.channel.send("Restricting this command from being used here is probably not what you want to do...");

    let serverManager = new ServerManager(bot);
    let server = await serverManager.ensureServer(msg.guild.id);

    server.addCommandRestrictions([
        { channelID: msg.channel.id, commands: args }
    ]);

    await server.save();

    msg.channel.send(`Restricted in ${msg.channel.toString()}: \`\`\`${args.join("\n")}\`\`\``);
}