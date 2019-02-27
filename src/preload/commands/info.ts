import { Bot } from "../../types";
import { Message, RichEmbed } from "discord.js";
import config from "../../../secure-config";

export const name = "info";
export const description = "Gets bot info.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let embed = new RichEmbed();
        embed.setAuthor("Payload", bot.user.avatarURL);
        embed.setTitle(`Currently serving **${bot.users.size}** users in **${bot.guilds.size}** servers!`);
        embed.setDescription("Visit https://payload.tf/info to view available commands.\n\nInvite the bot to your server with `" + config.PREFIX + " invite`.");
    msg.channel.send(embed);
}