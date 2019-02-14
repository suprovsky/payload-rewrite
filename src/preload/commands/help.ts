import { Bot, Command } from "../../types";
import { Message, RichEmbed } from "discord.js";
import config from "../../../secure-config";

export const name = "help";
export const description = "Find out how to use commands.";
export const usage = config.PREFIX + name + " <command>";

export function run(bot: Bot, msg: Message) {
    let commandName = msg.content.slice(name.length).trim();

    if (commandName.length == 0) return;

    if (!bot.commands.has(commandName)) return msg.channel.send("Command `" + commandName + "` was not found.");

    let command = bot.commands.get(commandName) as Command;

    let helpEmbed = new RichEmbed();
    helpEmbed.setTitle(command.name);
    helpEmbed.addField("Description", command.description);
    helpEmbed.addField("Usage", command.usage);
    helpEmbed.setThumbnail("https://images.vexels.com/media/users/3/143553/isolated/preview/18da5bb6f3a7c09e042921571f8a0f37-red-3d-question-mark-by-vexels.png");

    msg.channel.send(helpEmbed);
}