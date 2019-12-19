import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message, RichEmbed } from "discord.js";
import info from "../../../config/info";

export default class Info extends Command {
    constructor() {
        super(
            "info",
            "Gets bot info."
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const embed = new RichEmbed();
            embed.setAuthor("Payload", bot.user.avatarURL);
            embed.setTitle(`Currently serving **${bot.users.size}** users in **${bot.guilds.size}** servers!`);
            embed.setDescription("Join the official Payload server for help and suggestions: https://discord.gg/pnMrgCa\n\nVisit https://payload.supra.tf/payload-docs to view available commands.\n\nInvite the bot to your server with `pls invite`.");
            embed.setFooter(`Hosted by ${(bot.users.get(info.sharkyID)!).tag}, created by sharky#5178 - https://sharky.cool | Version ${info.version}`, (bot.users.get(info.sharkyID)!).avatarURL);
        await msg.channel.send(embed);

        return true;
    }
}
