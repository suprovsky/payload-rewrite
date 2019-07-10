import { Channel, PermissionString, Message } from "discord.js";
import { getArgs } from "../../utils/command-parsing";
import config from "../../../secure-config";
import { Bot } from "../../types/Bot";

export abstract class Command {
    name: string;
    description: string;
    usage: string;
    permissions: Array<PermissionString>;
    canBeExecutedBy: Array<PermissionString>;
    zones: Array<Channel["type"]>;
    requiresRoot: boolean;
    subCommands: {
        [name: string]: Command
    };
    commandLadder: Array<string>;

    constructor(
        name: string,
        description: string,
        usage?: string,
        permissions?: Array<PermissionString>,
        canBeExecutedBy?: Array<PermissionString>,
        zones?: Array<Channel["type"]>,
        requiresRoot?: boolean,
        subCommands?: { [name: string]: Command },
        commandLadder?: Array<string>
    ) {
        this.name = name;
        this.description = description;
        this.usage = usage || "";
        this.permissions = permissions || ["SEND_MESSAGES"];
        this.canBeExecutedBy = canBeExecutedBy || ["SEND_MESSAGES"];
        this.zones = zones || ["text", "dm"];
        this.requiresRoot = requiresRoot || false;
        this.subCommands = subCommands || {};
        this.commandLadder = commandLadder || [];
    }

    getArgs(message: Message, commandLevel?: number): Array<string> {
        return getArgs(
            message.content.slice(
                config.PREFIX.length + this.name.length
            ).trim()
        ).slice(commandLevel || 0);
    }

    getUsage(): string {
        if (this.commandLadder.length > 0) {
            return `${config.PREFIX}${this.commandLadder.join(" ")} ${this.name} ${this.usage}`;
        }
    
        return `${config.PREFIX}${this.name} ${this.usage}`;
    }

    async respond(message: Message, response: string): Promise<Message> {
        return await message.channel.send(response) as Message;
    }

    async fail(message: Message, reason: string): Promise<false> {
        await message.channel.send(reason);

        return false;
    }

    async flash(messagePromise: Promise<Message>, durationMS?: number): Promise<void> {
        return new Promise(async resolve => {
            const message = await messagePromise;

            setTimeout(async () => {
                if (message.deletable) {
                    await message.delete();
                }

                resolve();
            }, durationMS || 5000);
        });
    }

    async runSub(subCommandName: string, bot: Bot, msg: Message): Promise<boolean> {
        return await this.subCommands[subCommandName].run(bot, msg);
    }

    abstract async run(bot: Bot, msg: Message): Promise<boolean>;
}