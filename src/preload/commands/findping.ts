import { Bot } from "../../types";
import { Message } from "discord.js";
import { getPingCache, pingChannelCacheExists, renderMessage } from "../../utils/snipe-cache";
import config from "../../../secure-config";

export const name = "findping";
export const description = "Retrieves a deleted ping (if any exist in cache).";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    if (!pingChannelCacheExists(bot, msg) || getPingCache(bot, msg).size == 0) {
        return msg.channel.send("You haven't been pinged in any deleted messages.");
    }

    msg.channel.startTyping();

    let targetMessage = getPingCache(bot, msg).last();

    let msgData = await renderMessage(targetMessage);

    await msg.channel.send({
        files: [msgData.buffer]
    });

    if (msgData.attachments || msgData.links) {
        await msg.channel.send(msgData.attachments + "\n" + msgData.links);
    }
}