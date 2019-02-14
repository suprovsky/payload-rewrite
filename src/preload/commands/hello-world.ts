import { Bot } from "../../types";
import { Message } from "discord.js";

/**
 * @command
 * [NAME] hello world
 * [DESCRIPTION] A test command that also serves as a template for other commands.
 * [USAGE] %PREFIX%%NAME%
 */

export const name = "hello world";

export function run(bot: Bot, msg: Message) {
    msg.channel.send("Hello World!");
}