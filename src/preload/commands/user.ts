import { Bot } from "../../types";
import { Message, User as DiscordUser } from "discord.js";
import config from "../../../secure-config";
import textTable from "text-table";
import { User, UserModel } from "../../models/User";

export const name = "user";
export const description = "Gets profile data for a user.";
export const usage = config.PREFIX + name + " [user mention]";
export const permissions = ["SEND_MESSAGES", "EMBED_LINKS"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let target: DiscordUser;

    if (msg.mentions.users.size > 0) {
        target = msg.mentions.users.first();
    } else {
        target = msg.author;
    }

    User.findOne({
        id: target.id
    }, async (err, user: UserModel) => {
        if (err) return msg.channel.send("Error retrieving user. This is most likely a problem with the database.");

        let data = [
            ["Name", "::", target.tag],
            ["ID", "::", target.id],
            ["Avatar", "::", target.displayAvatarURL]
        ];

        msg.guild.member(target).roles.map(role => role.name).forEach((role, roleIndex) => {
            if (roleIndex == 0) {
                data.push(["Roles", "::", role]);
            } else {
                data.push(["", "", role]);
            }
        });

        if (user) {
            data.push(["Steam ID", "::", user.steamID || "NOT SET"]);
            data.push(["Recorded Logs", "::", String((user.logs || []).length)])
        }

        msg.channel.send("```" + textTable(data) + "```");
    });
}