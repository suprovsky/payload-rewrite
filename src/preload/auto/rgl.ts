import { Bot } from "../../types";
import { Message } from "discord.js";
import { capture } from "../../utils/screenshot";

export const name = "rgl";
export const description = "Generates RGL team previews.";
export const pattern = /\w+\.rgl\.gg\/Public\/Team\.aspx?t=\d+/;
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    const url = matchMsg(msg);

    let screenshotBuffer = await capture(url, {
        top: {
            selector: "div:nth-child(5) > div.col-xs-12.col-md-4",
            edge: "top"
        },
        right: {
            selector: "div:nth-child(5) > div.col-xs-12.col-md-8",
            edge: "right"
        },
        bottom: {
            selector: "div:nth-child(5) > div.col-xs-12.col-md-4",
            edge: "bottom"
        },
        left: {
            selector: "div:nth-child(5) > div.col-xs-12.col-md-4",
            edge: "left"
        }
    });

    msg.channel.send({
        files: [screenshotBuffer]
    });
}

function matchMsg(msg: Message) {
    let match = msg.content.match(pattern) as RegExpMatchArray;

    return match[0];
}