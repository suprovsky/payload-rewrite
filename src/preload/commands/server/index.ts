import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import ExecCommand from "./exec";
import ListCommand from "./list";
import RemoveCommand from "./remove";
import SetCommand from "./set";

export default class Server extends Command {
    constructor() {
        super(
            "server",
            "**USING THESE COMMANDS IN A PUBLIC SERVER PUTS YOUR TF2 SERVERS AT RISK OF BEING HIJACKED! MAKE SURE TO USE THESE COMMANDS ONLY IN BOT DMS!**",
            "<subcommand> <subcommand args>",
            undefined,
            undefined,
            ["dm"],
            undefined,
            {
                list: new ListCommand(),
                set: new SetCommand(),
                remove: new RemoveCommand(),
                exec: new ExecCommand()
            }
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        if (!args) {
            await this.respond(msg, "Invalid syntax. Type `pls help server` to learn more.");

            return false;
        }

        if (!this.subCommands[args[0]]) {
            await this.respond(msg, "Invalid subcommand. Type `pls help server` to learn more.");

            return false;
        }

        return await this.runSub(args[0], bot, msg);
    }
}