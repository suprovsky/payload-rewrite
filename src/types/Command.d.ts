import { Bot } from "./Bot";
import { Message } from "discord.js";

export interface Command {
    name: string;
    run: (bot: Bot, msg: Message) => void;
}