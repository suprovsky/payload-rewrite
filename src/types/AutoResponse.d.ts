import { Bot } from "./Bot";
import { Message } from "discord.js";

export interface AutoResponse {
    name: string;
    description: string;
    pattern: RegExp;
    permissions: Array<string>;

    run: (bot: Bot, msg: Message) => void;
}