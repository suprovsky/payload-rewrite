import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message, RichEmbed } from "discord.js";

export default class Help extends Command {
    constructor() {
        super(
            "help",
            "Find out how to use commands.",
            "<command> [subcommand] [sub-subcommand]..."
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        const commandName = args[0].toLowerCase();
        const subcommandNames = args.slice(1);

        if (!commandName || !bot.commands.has(commandName)) {
            return false;
        }

        const command = bot.commands.get(commandName)!;

        let usage: string;
        let permissionsNeeded: {
            user: string[],
            bot: string[]
        } = {
            user: [],
            bot: []
        };

        if (subcommandNames) {
            let currentCommand: Command = command;
            for (let i = 0; i < subcommandNames.length; i++) {
                currentCommand = currentCommand.subCommands[subcommandNames[i].toLowerCase()];

                if (!currentCommand) {
                    return false;
                }
            }

            usage = currentCommand.getUsage();
            permissionsNeeded = {
                user: currentCommand.canBeExecutedBy,
                bot: currentCommand.permissions
            };
        } else {
            usage = command.getUsage();
            permissionsNeeded = {
                user: command.canBeExecutedBy,
                bot: command.permissions
            };
        }

        let helpEmbed = new RichEmbed();
            helpEmbed.setTitle(command.name);
            helpEmbed.addField("Description", command.description);
            helpEmbed.addField("Usage", command.usage);
            helpEmbed.addField("Permissions Needed", `\`\`\`md\n# For User #\n${command.canBeExecutedBy.join("\n")}\n\n# For Payload #\n${command.permissions.join("\n")}\n\`\`\``);

        await msg.channel.send(helpEmbed);

        return true;
    }
}