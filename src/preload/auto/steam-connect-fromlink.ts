import { Bot } from "../../types";
import { Message, RichEmbed } from "discord.js";

export const name = "steam connect info";
export const description = "Automatically sends steam connect links when raw connect info is posted.";
export const pattern = /steam:\/\/connect\/(\w+\.)+\w+(:\d+)?\/.+/;
export const permissions = ["SEND_MESSAGES", "EMBED_LINKS"];
export const zones = ["text", "dm"];

export function run(bot: Bot, msg: Message) {
    let connectLink = msg.content.match(pattern) as RegExpExecArray;
    let parts = connectLink[0].replace("steam://connect/", "").split("/");

    let ip = parts[0];
    let password = decodeURIComponent(parts[1]);

    let embed = new RichEmbed();
        embed.setDescription(`connect ${ip}; password "${password}"`);

    msg.channel.send(embed);
}