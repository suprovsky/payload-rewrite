import { Message, TextChannel, Permissions, PermissionResolvable } from "discord.js";
import { Bot, Command, AutoResponse } from "../types";

export default async function handleAutoResponse(bot: Bot, msg: Message): Promise<boolean> {
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

    let autoResponse = bot.autoResponses.get(match) as AutoResponse;

    if (!autoResponse.zones.includes(msg.channel.type)) return false;

    if (msg.channel.type == "text") {
        if (!((msg.channel as TextChannel).permissionsFor(bot.user) as Permissions).has(autoResponse.permissions as PermissionResolvable)) return false;
    }

    msg.channel.startTyping();

    try {
        await autoResponse.run(bot, msg);
    } catch (err) {
        console.warn("Error while executing autoresponse " + autoResponse.name, err);
    }

    msg.channel.stopTyping(true);

    return true;
}