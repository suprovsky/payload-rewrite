import { Bot } from "../../types";
import { Message } from "discord.js";

export const name = "good bot";
export const description = "Responds to your appreciation sometimes :).";
export const pattern = /^good bot$/i;
export const permissions = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let lastMessages = await msg.channel.fetchMessages({ limit: 5 });
    let lastBotMessage = lastMessages.find((message => message.author.id == bot.user.id));
    
    if (!lastBotMessage) return;

    if (Date.now() - lastBotMessage.createdTimestamp > 1000 * 60) return;

    msg.channel.send("<:SmilingWithHearts:566326252055560212>");
}

function matchMsg(msg: Message) {
    let match = msg.content.match(pattern) as RegExpMatchArray;

    return match[0];
}