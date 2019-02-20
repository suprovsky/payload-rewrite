import config from "../../secure-config";
import { Message } from "discord.js";

export function sliceCmd(message: Message, name: string): string {
    return message.content.slice(config.PREFIX.length + name.length).trim();
}