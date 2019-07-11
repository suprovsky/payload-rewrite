import { Channel, PermissionString, Message } from "discord.js";
import { getArgs } from "../../utils/command-parsing";
import config from "../../../secure-config";
import { Bot } from "../../types/Bot";

declare interface NumberArgument {
    name: string;
    description: string;
    required: boolean;

    type: "number";
    min?: number;
    max?: number;
    options?: number[];
};
declare interface StringArgument {
    name: string;
    description: string;
    required: boolean;

    type: "string";
    minLength?: number;
    maxLength?: number;
    options?: string[];
};
declare interface BooleanArgument {
    name: string;
    description: string;
    required: boolean;

    type: "boolean";
}
declare type Argument = NumberArgument | StringArgument | BooleanArgument;

export abstract class Command {
    name: string;
    description: string;
    args: Argument[];
    usage: string;
    permissions: Array<PermissionString>;
    canBeExecutedBy: Array<PermissionString>;
    zones: Channel["type"][];
    requiresRoot: boolean;
    subCommands: {
        [name: string]: Command
    };
    commandLadder: string[];

    constructor(
        name: string,
        description: string,
        usage?: string,
        permissions?: Array<PermissionString>,
        canBeExecutedBy?: Array<PermissionString>,
        zones?: Array<Channel["type"]>,
        requiresRoot?: boolean,
        subCommands?: { [name: string]: Command },
        commandLadder?: Array<string>,
        args?: Argument[]
    ) {
        this.name = name;
        this.description = description;
        this.args = args || [];
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

    async parseArgs(message: Message, commandLevel?: number): Promise<Array<number | string | boolean> | false> {
        const args = this.getArgs(message, commandLevel);
        let parsedArgs: Array<number | string | boolean> = [];

        for (let i = 0; i < this.args.length; i++) {
            if (!args[i]) {
                if (this.args[i].required) {
                    return await this.fail(message, `Missing \`${this.args[i].name}\` argument.`);
                }

                break;
            }

            if (this.args[i].type == "number") {
                const argCheck = this.args[i] as NumberArgument;
                let arg: string | number = args[i];

                if (!Number(arg) || Number(arg) === Infinity) {
                    return await this.fail(message, `\`${argCheck.name}\` argument must be a number.`);
                }

                arg = Math.round(Number(arg));

                if (argCheck.max != undefined && argCheck.max < arg) {
                    return await this.fail(message, `\`${argCheck.name}\` argument must be less than ${argCheck.max + 1}.`);
                } else if (argCheck.min != undefined && argCheck.min > arg) {
                    return await this.fail(message, `\`${argCheck.name}\` argument must be greater than ${argCheck.min - 1}.`);
                }

                if (argCheck.options && !argCheck.options.includes(arg)) {
                    return await this.fail(message, `\`${argCheck.name}\` argument must be one of the following: ${argCheck.options.join(", ")}.`);
                }

                parsedArgs.push(arg);
            } else if (this.args[i].type == "string") {
                const argCheck = this.args[i] as StringArgument;
                let arg: string = args[i];

                if (argCheck.maxLength != undefined && argCheck.maxLength < arg.length) {
                    return await this.fail(message, `\`${argCheck.name}\` argument must have less than ${argCheck.maxLength + 1} characters.`);
                } else if (argCheck.minLength != undefined && argCheck.minLength > arg.length) {
                    return await this.fail(message, `\`${argCheck.name}\` argument must have more than ${argCheck.minLength - 1} characters.`);
                }

                if (argCheck.options && !argCheck.options.includes(arg)) {
                    return await this.fail(message, `\`${argCheck.name}\` argument must be one of the following: ${argCheck.options.join(", ")}.`);
                }

                parsedArgs.push(arg);
            } else if (this.args[i].type == "boolean") {
                const argCheck = this.args[i] as NumberArgument;
                let arg: string | boolean = args[i];

                if (!["true", "false"]) {
                    return await this.fail(message, `\`${argCheck.name}\` argument must be either "true" or "false".`);
                }

                arg = arg == "true" ? true : false;

                parsedArgs.push(arg);
            }
        }

        return parsedArgs;
    }

    getUsage(): string {
        if (this.commandLadder.length > 0) {
            return `${config.PREFIX}${this.commandLadder.join(" ")} ${this.name} ${this.usage}`;
        }
    
        return `${config.PREFIX}${this.name} ${this.usage}`;
    }

    getSubcommandArray(): string[] {
        return Object.keys(this.subCommands);
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

export interface CommandConstructor {
    new(): Command;
}