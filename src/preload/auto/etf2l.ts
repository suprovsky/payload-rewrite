import { Bot } from "../../types";
import { Message } from "discord.js";
import { captureSelector } from "../../utils/screenshot";

export const name = "etf2l";
export const description = "Generates ETF2L team previews.";
export const pattern = /etf2l\.org\/teams\/\d+/;
export const permissions = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    const url = matchMsg(msg);

    let screenshotBuffer = await captureSelector("https://" + url, "#content > div > div > table.pls");

    msg.channel.send({
        files: [screenshotBuffer]
    });
}

function matchMsg(msg: Message) {
    let match = msg.content.match(pattern) as RegExpMatchArray;

    return match[0];
}