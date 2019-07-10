import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";

export const name = "invite";
export const description = "Generates an invite link for the bot.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    const inviteLink = await bot.generateInvite(["ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "READ_MESSAGES", "READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL"]);

    msg.channel.send("✉️ " + inviteLink);
}