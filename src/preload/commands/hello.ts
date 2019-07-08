import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";

export const name = "hello";
export const description = "A test command that also serves as a template for other commands.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    msg.channel.send("Hello World!");
}