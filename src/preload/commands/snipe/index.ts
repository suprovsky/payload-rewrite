import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { getCache, channelCacheExists, renderMessage } from "../../../utils/snipe-cache";

export default class Snipe extends Command {
    constructor() {
        super(
            "snipe",
            "Retrieves the latest (or number [number]) deleted/edited message from the past 5 minutes.",
            "[number]",
            ["SEND_MESSAGES", "ATTACH_FILES"],
            undefined,
            ["text"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        if (!channelCacheExists(bot, msg) || getCache(bot, msg).size == 0) {
            return await this.fail(msg, "No messages to snipe!");
        }

        if (args[0]) {
            if (!Number(args[0]) || Math.round(Number(args[0])) < 1) {
                return await this.fail(msg, "`[number]` argument must be a number greater than 0.");
            }
        }

        msg.channel.startTyping();

        const number = Math.round(Number(args[0] || 1));

        const cache = getCache(bot, msg);

        const max = cache.size;

        if (number > max) {
            return await this.fail(msg, "Snipe cache doesn't go that far!");
        }

        const ids = cache.keyArray();
        const targetMessage = cache.get(ids[max - number])!;

        const snipeData = await renderMessage(targetMessage);

        await msg.channel.send({
            files: [snipeData.buffer]
        });

        if (snipeData.attachments || snipeData.links) {
            await msg.channel.send(snipeData.attachments + "\n" + snipeData.links);
        }

        return true;
    }
}