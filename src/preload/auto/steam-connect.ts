import { Bot } from "../../types";
import { Message, RichEmbed } from "discord.js";

export const name = "steam connect link";
export const description = "Automatically sends steam connect links when raw connect info is posted.";
export const pattern = /connect (https?:\/\/)?(\w+\.)+\w+(:\d+)?; ?password .+/;
export const permissions = ["SEND_MESSAGES", "EMBED_LINKS"];
export const zones = ["text", "dm"];

export function run(bot: Bot, msg: Message) {
    let connectInfo = msg.content.match(pattern) as RegExpExecArray;
    let parts = connectInfo[0].split(";");

    let ip = parts[0];
    let password = parts.slice(1).join(";").replace(/"|;$/g, "");

    let embed = new RichEmbed();
        embed.setDescription(`steam://connect/${ip.replace(/^connect (https?:\/\/)?/, "")}/${encodeURIComponent(password.replace(/^ ?password /, ""))}`);

    msg.channel.send(embed);
}