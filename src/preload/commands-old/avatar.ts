import { Bot } from "../../types";
import { Message, User } from "discord.js";
import config from "../../../secure-config";

export const name = "avatar";
export const description = "Retrieves the avatar for a user (or you if none specified).";
export const usage = config.PREFIX + name + " [user mention]";
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let target: User;

    if (msg.mentions.users.size > 0) {
        target = msg.mentions.users.first();
    } else {
        target = msg.author;
    }

    await msg.channel.send(target.displayAvatarURL);
}