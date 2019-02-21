import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { random } from "../../utils/random";

export const name = "rtd";
export const description = "Rolls a die with 6 sides or a die with [number] sides if specified.";
export const usage = config.PREFIX + name + " [number]";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text, dm"];

export function run(bot: Bot, msg: Message) {
    let maybeANumber = msg.content.slice(config.PREFIX.length + name.length).trim();

    if (maybeANumber.length > 0 && !Number(maybeANumber)) return msg.channel.send("Argument must be a number.");

    let randomNumber = random(1, Number(maybeANumber) || 6);

    msg.channel.send(`🎲 **${randomNumber}**`);
}