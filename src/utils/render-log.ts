import { capture } from "./screenshot";
import { Bot } from "../types";
import { Message, MessageOptions } from "discord.js";

export async function render(link: string, bot: Bot, msg: Message) {
    msg.channel.startTyping();

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