import { Bot } from "../../types";
import { Message, RichEmbed, User } from "discord.js";
import config from "../../../secure-config";
import info from "../../config/info";

export const name = "info";
export const description = "Gets bot info.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES", "EMBED_LINKS"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let embed = new RichEmbed();
        embed.setAuthor("Payload BETA", bot.user.avatarURL);
        embed.setTitle(`Currently serving **${bot.users.size}** users in **${bot.guilds.size}** servers!`);
        embed.setDescription("Visit https://docs.payload.tf to view available commands.");
        embed.setFooter(`Created by ${(bot.users.get(info.sharkyID) as User).tag} | Version ${info.version}`, (bot.users.get(info.sharkyID) as User).avatarURL);
    msg.channel.send(embed);
}