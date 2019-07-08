import { Bot } from "./Bot";
import { Message, Channel } from "discord.js";

export interface Command {
    name: string;
    description: string;
    usage: string;
    permissions: Array<string>;
    canBeExecutedBy: Array<string>;
    zones: Array<Channel["type"]>;
    requiresRoot?: boolean;

    run: (bot: Bot, msg: Message) => void;
}