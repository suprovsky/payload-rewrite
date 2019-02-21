import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { random } from "../../utils/random";

export const name = "8ball";
export const description = "Asks the 8ball a question.";
export const usage = config.PREFIX + name + " <question>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text, dm"];

export function run(bot: Bot, msg: Message) {
    let question = msg.content.slice(config.PREFIX.length + name.length).trim();

    if (!question) return msg.channel.send("You must ask the 8ball a question.");

    let responses = [
        "It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes - definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",

        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        'Cannot predict now.',
        "Concentrate and ask again.",

        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful."
    ];

    msg.channel.send(`🎱 **${responses[random(0, responses.length - 1)]}**`);
}