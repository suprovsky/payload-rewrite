import { Bot } from "../../types";
import { Message } from "discord.js";
import { capture, captureSelector } from "../../utils/screenshot";

export const name = "logs";
export const description = "Automatically renders logs whenever a logs link is posted.";
export const pattern = /http(s|):\/\/(www\.|)logs\.tf\/\d+/;

export function run(bot: Bot, msg: Message) {
    msg.channel.send("Found a log link! c:");
}