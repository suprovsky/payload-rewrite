import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import got from "got";
import { sliceCmd } from "../../utils/command-parsing";

export const name = "bigtext";
export const description = "Converts your inputted text to ASCII art.";
export const usage = config.PREFIX + name + " <text>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let text = sliceCmd(msg, name);

    if (text.length == 0) return msg.channel.send("Missing <text> argument.");

    let resp = await got("http://artii.herokuapp.com/make?text=" + text);
    let body = resp.body.replace(/\s+\n/g, "");

    if (body.length > 2000 - 6) return msg.channel.send("Result will be greater than 2000 characters; can't display it sorry.");

    msg.channel.send("```" + body + "```");
}