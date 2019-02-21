import { Bot } from "./Bot";
import { Message, Channel } from "discord.js";

export interface AutoResponse {
    name: string;
    description: string;
    pattern: RegExp;
    permissions: Array<string>;
    zones: Array<Channel["type"]>;

    run: (bot: Bot, msg: Message) => void;
}