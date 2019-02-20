import { Bot } from "../../types";
import { Message } from "discord.js";
import { render } from "../../utils/render-log";

export const name = "logs";
export const description = "Automatically renders logs whenever a logs link is posted.";
export const pattern = /http(s|):\/\/(www\.|)logs\.tf\/\d+/;

export async function run(bot: Bot, msg: Message) {
    let link = (msg.content.match(/http(s|):\/\/(www\.|)logs\.tf\/\d+/g) as Array<string>)[0];

    await render(link, bot, msg);
}