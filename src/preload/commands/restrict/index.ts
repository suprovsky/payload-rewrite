import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";

export default class Restrict extends Command {
    constructor() {
        super(
            "restrict",
            "Restricts a command from being used in a channel. Using `{all}` as a command argument restrics all commands and using `#{all}` as a channel argument restricts the commands in all text channels.",
            "<command> [command 2]... [channel mention] [channel mention 2]...",
            undefined,
            ["SEND_MESSAGES", "MANAGE_CHANNELS"],
            ["text"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        if (!args[0]) {
            return await this.fail(msg, "Missing <command> argument.");
        }

        let commands: string[] = [];
        let channels: string[] = [];
        let allCommands = false;
        let allChannels = false;

        for (let i = 0; i < args.length; i++) {
            if (args[i].match(/^<#\d+>$/)) channels.push(args[i].slice(2, -1));
            else if (args[i].toLowerCase() == "#{all}") {
                allChannels = true;
                channels.push(...msg.guild.channels.filter(channel => channel.type == "text").map(channel => channel.id));
            }
            else if (args[i].toLowerCase() == "{all}") {
                allCommands = true;
                commands.push(...bot.commands.filter(command => !["restrict", "unrestrict"].includes(command.name)).map(command => command.name));
            }
            else commands.push(args[i]);
        }
    
        if (channels.length == 0) {
            channels = [ msg.channel.id ];
        }
    
        if (commands.includes("restrict") || commands.includes("unrestrict")) return await this.fail(msg,"Restricting the restriction commands from being used is probably not what you want to do...");
    
        const serverManager = bot.serverManager;
        const server = await serverManager.ensureServer(msg.guild.id);
    
        server.addCommandRestrictions(
            channels.map(channelID => {
                return {
                    channelID,
                    commands
                };
            })
        );
    
        await server.save();
    
        await this.respond(msg, `Restricted in ${allChannels ? "ALL CHANNELS" : channels.map(channelID => `<#${channelID}>`).join(", ")}: \`\`\`${allCommands ? "ALL COMMANDS" : commands.join("\n")}\`\`\``);

        return true;
    }
}