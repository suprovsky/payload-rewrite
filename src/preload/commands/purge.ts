import { Bot } from "../../types";
import { Message, MessageCollector } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";

export const name = "purge";
export const description = "Purges a certain number of messages sent by a user or everyone if no user is mentioned.";
export const usage = `${config.PREFIX + name} [amount] [user mention 1] [user mention 2]...`;
export const permissions = ["MANAGE_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES", "MANAGE_MESSAGES"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    if (args.length < 1) {
        return msg.channel.send(`Missing arguments. Use \`${config.PREFIX} help ${name}\` to find out more.`);
    }

    let amount = Number(args[0]);

    if (amount == NaN || amount == 0) {
        return msg.channel.send("Amount argument must be a number greater than 0.");
    }

    await msg.delete();

    let found = 0;

    let channelMessages = await msg.channel.fetchMessages();

    if (msg.mentions.members.size > 0) {
        channelMessages.filter(foundMsg =>{
            if (msg.mentions.members.map(member => member.id).includes(foundMsg.author.id)) {
                if (found == amount) return false;

                found++;
                return true;
            }

            return false;
        });

        msg.channel.bulkDelete(channelMessages);
    } else {
        msg.channel.bulkDelete(channelMessages.map(channelMessage => channelMessage.id).slice(0, amount));
    }
}