import { Bot } from "../../types";
import { Message } from "discord.js";
import { render } from "../../utils/render-log";
import { readFileSync } from "fs";
import config from "../../../example-config";

export const name = "logs";
export const description = "Automatically renders logs whenever a logs link is posted.";
export const pattern = /http(s|):\/\/(www\.|)logs\.tf\/\d+/;
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let link = (msg.content.match(/http(s|):\/\/(www\.|)logs\.tf\/\d+/g) as Array<string>)[0];

    let placeholder = await msg.channel.send({
        files: [
            config.files.LOADING
        ]
    }) as Message;

    let screenshotBuffer = await render(link);
    
    msg.channel.send({
        files: [screenshotBuffer]
    });
    placeholder.delete();
}