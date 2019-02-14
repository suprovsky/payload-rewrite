import { Bot } from "../../types";
import { Message, MessageOptions } from "discord.js";
import { capture } from "../../utils/screenshot";

export const name = "logs";
export const description = "Automatically renders logs whenever a logs link is posted.";
export const pattern = /http(s|):\/\/(www\.|)logs\.tf\/\d+/;

export async function run(bot: Bot, msg: Message) {
    msg.channel.startTyping();

    let link = (msg.content.match(/http(s|):\/\/(www\.|)logs\.tf\/\d+/g) as Array<string>)[0];

    try {
        let screenshotBuffer = await capture(link, {
            top: {
                selector: "#log-header",
                edge: "top"
            },
            left: {
                selector: "#log-header",
                edge: "left"
            },
            right: {
                selector: "#log-header",
                edge: "right"
            },
            bottom: {
                selector: "#log-section-players",
                edge: "bottom"
            }
        });
    
        let messageOptions: MessageOptions = {
            files: [screenshotBuffer]
        };
    
        await msg.channel.send(messageOptions);
        msg.channel.stopTyping();
    } catch (err) {
        msg.channel.stopTyping();
    }
}