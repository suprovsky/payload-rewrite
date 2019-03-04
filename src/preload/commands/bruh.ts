import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";

export const name = "bruh";
export const description = "Bruh.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    msg.channel.send("Bruh");
}