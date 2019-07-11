import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { resolve } from "path";
import { CommandConstructor } from "../../../lib/Executables/Command";

export default class Reload extends Command {
    constructor() {
        super(
            "reload",
            "Reloads a command. Useful for debugging.",
            "<command>"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        if (!args[0]) {
            return await this.fail(msg, "Missing <command> argument.");
        }

        const commandName = args[0];

        if (!bot.commands.has(commandName)) {
            return await this.fail(msg, `\`${commandName}\` is not a valid command.`);
        }

        const commandPath = resolve(__dirname, "..", commandName);

        delete require.cache[require.resolve(commandPath)];

        const commandInit: CommandConstructor = require(commandPath).default;
        const command = new commandInit();

        bot.commands.set(commandName, command);

        await this.respond(msg, `Reloaded \`${commandName}\``);

        return true;
    }
}