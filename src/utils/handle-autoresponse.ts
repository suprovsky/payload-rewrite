import { Message } from "discord.js";
import { Bot, Command, AutoResponse } from "../types";
import config from "../../secure-config";

export default function handleAutoResponse(bot: Bot, msg: Message): boolean {
    if (msg.author.bot) return false;

    let match = "";
    let autoResponseKeys = bot.autoResponses.keyArray();

    for(let i = 0; i < autoResponseKeys.length; i++) {
        let autoReponse = bot.autoResponses.get(autoResponseKeys[i]) as AutoResponse;
        let pattern = autoReponse.pattern;

        if (msg.content.match(pattern)) {
            match = autoReponse.name;
            break;
        }
    }

    if (!match) return false;

    (bot.autoResponses.get(match) as AutoResponse).run(bot, msg);
    return true;
}