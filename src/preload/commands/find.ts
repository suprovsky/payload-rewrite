import { Bot } from "../../types";
import { Message } from "discord.js";
import { getCache, channelCacheExists, renderMessage } from "../../utils/snipe-cache";
import config from "../../../secure-config";

export const name = "find";
export const description = "Retrieves the latest message that matches certain criteria.";
export const usage = config.PREFIX + name + " <criteria>";
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let number: any = msg.content.slice(config.PREFIX.length + name.length).trim();

    if (!channelCacheExists(bot, msg) || getCache(bot, msg).size == 0) {
        return msg.channel.send("No messages to snipe!");
    }

    if (number.length == 0 || isNaN(number)) {
        let targetMessage = getCache(bot, msg).last();

        let snipeData = await renderMessage(targetMessage);

        await msg.channel.send({
            files: [snipeData.buffer]
        });

        if (snipeData.attachments || snipeData.links) {
            await msg.channel.send(snipeData.attachments + "\n" + snipeData.links);
        }
    } else {
        let cache = getCache(bot, msg);

        let max = cache.size;
        number = parseInt(number);

        if (number < 1) {
            return msg.channel.send("Number argument must be greater than 0.");
        }
        if (number > max) {
            return msg.channel.send("Snipe cache doesn't go that far!");
        }

        let ids = cache.keyArray();
        let targetMessage = cache.get(ids[max - number]) as Message;

        let snipeData = await renderMessage(targetMessage);

        await msg.channel.send({
            files: [snipeData.buffer]
        });

        if (snipeData.attachments || snipeData.links) {
            await msg.channel.send(snipeData.attachments + "\n" + snipeData.links);
        }
    }
}