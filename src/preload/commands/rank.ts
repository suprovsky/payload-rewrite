import { Bot } from "../../types";
import { Message, RichEmbed } from "discord.js";
import config from "../../../secure-config";

export const name = "rank";
export const description = "Shows you your pushcart rank.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    if (!bot.leaderboard) return msg.channel.send("Leaderboard has not yet been generated. Try again in a couple minutes.");

    let rank = bot.leaderboard.users.findIndex(user => user.id == msg.author.id) + 1;
    let feetPushed = (bot.leaderboard.users.find(user => user.id == msg.author.id) || { pushed: 0 }).pushed;
    msg.channel.send(`\`\`\`#${rank}: ${msg.author.tag} (${feetPushed})\`\`\``);
}