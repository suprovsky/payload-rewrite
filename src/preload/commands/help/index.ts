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

        let command = bot.commands.get(commandName)!;

        let usage: string;
        let permissionsNeeded: {
            user: string[],
            bot: string[]
        } = {
            user: [],
            bot: []
        };

        if (subcommandNames) {
            for (let i = 0; i < subcommandNames.length; i++) {
                command = command.subCommands[subcommandNames[i].toLowerCase()];

                if (!command) {
                    return false;
                }
            }
        }

        usage = command.getUsage();
        permissionsNeeded = {
            user: command.canBeExecutedBy,
            bot: command.permissions
        };

        let helpEmbed = new RichEmbed();
            helpEmbed.setTitle(command.name);
            helpEmbed.setDescription(command.description);
            helpEmbed.addField("Usage", usage);
            helpEmbed.addField("Permissions Needed", `\`\`\`md\n# For User #\n${permissionsNeeded.user.join("\n")}\n\n# For Payload #\n${permissionsNeeded.bot.join("\n")}\n\`\`\``);
            if (command.getSubcommandArray().length > 0) {
                helpEmbed.addField("Subcommands", command.getSubcommandArray().join(", "));
            }

        await msg.channel.send(helpEmbed);

        return true;
    }
}