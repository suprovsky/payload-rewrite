import { Bot } from "./Bot";
import { Message } from "discord.js";

export interface Command {
    name: string;
    description: string;
    usage: string;
    run: (bot: Bot, msg: Message) => void;
}