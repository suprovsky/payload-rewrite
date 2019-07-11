import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";

export default class Purge extends Command {
    constructor() {
        super(
            "purge",
            "Purges a certain number of messages sent by a user or everyone if no user is mentioned.",
            "<amount> [user mention] [user mention 2]...",
            ["SEND_MESSAGES", "MANAGE_MESSAGES"],
            ["SEND_MESSAGES", "MANAGE_MESSAGES"],
            ["text"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        let amount: string | number = args[0];
        const users = msg.mentions.users;

        if (!amount) {
            return await this.fail(msg, "Missing `<amount>` argument.");
        }

        if (!Number(amount) || Number(amount) < 1) {
            return await this.fail(msg, "Amount argument must be a number greater than 0.");
        }

        amount = Math.round(Number(amount));

        msg.channel.startTyping();

        await msg.delete();

        const startTime = Date.now();

        let channelMessages = await msg.channel.fetchMessages({
            limit: 100
        });

        if (users.size > 0) {
            channelMessages = channelMessages.filter(foundMsg => {
                return msg.mentions.users.map(user => user.id).includes(foundMsg.author.id);
            });
        }

        channelMessages = channelMessages.filter(channelMessage => {
            return Date.now() - channelMessage.createdTimestamp < 1000 * 60 * 60 * 24 * 14;
        });

        const deletedMessages = await msg.channel.bulkDelete(channelMessages.map(channelMessage => channelMessage.id).slice(0, amount));

        await this.respond(msg, `🗑 Deleted **${deletedMessages.size}** messages in **${(Date.now() - startTime) / 1000}** seconds.`);

        return true;
    }
}