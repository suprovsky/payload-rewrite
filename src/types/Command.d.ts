import { Bot } from "./Bot";
import { Message, Permissions } from "discord.js";

export interface Command {
    name: string;
    description: string;
    usage: string;
    permissions: Permissions;
    canBeExecutedBy: Permissions;

    run: (bot: Bot, msg: Message) => void;
}