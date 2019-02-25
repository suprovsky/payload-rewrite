import { Bot } from "../../types";
import { Message } from "discord.js";
import { captureSelector } from "../../utils/screenshot";

export const name = "esea";
export const description = "Renders match previews for ESEA matches.";
export const pattern = /play\.esea\.net\/match\/\d+/;
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    const matchSelector = "#root > div > div.Container.sc-bdVaJa.bfOuKc.Grid.dFpchr > div.Block.sc-bdVaJa.fqwnaK > div > div > div.Block.sc-bdVaJa.hEcYPa";

    let screenshotBuffer = await captureSelector(
        "https://" + matchMsg(msg),
        matchSelector,
        {
            width: 850,
            height: 850
        }
    );

    msg.channel.send({
        files: [screenshotBuffer]
    });
}

function matchMsg(msg: Message) {
    let match = msg.content.match(pattern) as RegExpMatchArray;

    return match[0];
}