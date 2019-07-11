import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import textTable from "text-table";

export default class User extends Command {
    constructor() {
        super(
            "user",
            "Gets profile data for a user.",
            "[user mention]"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const targetUser = msg.mentions.users.first() || msg.author;

        const user = await bot.userManager.getUser(targetUser.id);

        const data = [
            ["Name", "::", targetUser.tag],
            ["ID", "::", targetUser.id],
            ["Avatar", "::", `https://sharky.cool/a/davatar/${targetUser.id}`]
        ];

        msg.guild.member(targetUser).roles.map(role => role.name).forEach((role, roleIndex) => {
            if (roleIndex == 0) {
                data.push(["Roles", "::", role]);
            } else {
                data.push(["", "", role]);
            }
        });

        data.push(["Steam ID", "::", user.user.steamID || "NOT SET"]);
        data.push(["Recorded Logs", "::", String((user.user.logs || []).length)]);

        await this.respond(msg, "```" + textTable(data) + "```");

        return true;
    }
}