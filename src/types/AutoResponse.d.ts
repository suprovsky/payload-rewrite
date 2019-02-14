import { Bot } from "./Bot";
import { Message } from "discord.js";

export interface AutoResponse {
    name: string;
    description: string;
    pattern: RegExp;
    run: (bot: Bot, msg: Message) => void;
}