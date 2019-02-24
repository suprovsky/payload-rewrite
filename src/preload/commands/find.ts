import { Bot } from "../../types";
import { Message } from "discord.js";
import { renderMessage } from "../../utils/snipe-cache";
import { Server, ServerModel } from "../../models/Server";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import config from "../../../secure-config";

export const name = "find";
export const description = "Retrieves the latest message that matches certain criteria.\n\n__Valid Criteria__\nping\ndeleted ping";
export const usage = config.PREFIX + name + " <criteria>";
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text"];

export function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));
    let criteria: string;

    if (!args[0]) return msg.channel.send("Missing criteria to use.");

    if (args[0] == "ping") {
        criteria = "any";
    } else if (args[0] == "deleted ping") {
        criteria = "deleted";
    } else {
        return msg.channel.send("Invalid criteria. Use the help command to see a list of valid criteria.");
    }

    Server.findOne({
        id: msg.guild.id
    }, async (err, server: ServerModel) => {
        if (err) return msg.channel.send("Error retrieving server info.");

        if (!server || !server.mentions || !server.mentions[msg.channel.id]) return msg.channel.send("No messages found.");

        let match = server.mentions[msg.channel.id].find(message => {
            if (criteria == "any") {
                return message.isMemberMentioned(msg.author);
            } else {
                // Discord.js's stable branch doesn't have correct typings...
                //@ts-ignore
                return message.deleted && message.isMemberMentioned(msg.author);
            }
        });

        if (!match) return msg.channel.send("No messages matching criteria found.");

        let messageData = await renderMessage(match);

        await msg.channel.send({
            files: [messageData.buffer]
        });

        if (messageData.attachments || messageData.links) {
            await msg.channel.send(messageData.attachments + "\n" + messageData.links);
        }
    });
}