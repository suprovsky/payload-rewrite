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
    console.log(args);

    if (args.length < 1) {
        return msg.channel.send(`Missing arguments. Use \`${config.PREFIX} help ${name}\` to find out more.`);
    }

    let amount = Number(args[0]);

    if (amount == NaN) {
        return msg.channel.send("Amount argument must be a number.");
    }

    msg.delete();

    if (msg.mentions.members.size > 0) {
        let collector = new MessageCollector(msg.channel, (memberMsg: Message) => {
            return msg.mentions.members.map(member => member.id).includes(memberMsg.author.id);
        });

        collector.on("collect", collectedMsg => {
            console.log(collectedMsg);
        });

        //msg.channel.bulkDelete(collector.collected);
    } else {
        msg.channel.bulkDelete(amount);
    }
}