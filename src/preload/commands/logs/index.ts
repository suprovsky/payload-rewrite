import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message, User } from "discord.js";
import got from "got";
import { render } from "../../../utils/render-log";

export default class Logs extends Command {
    constructor() {
        super(
            "logs",
            "Retrieves the latest log from a user's Steam ID. Only works if the user has their accounts linked.",
            "[user mention]",
            ["SEND_MESSAGES", "ATTACH_FILES"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const targetUser = msg.mentions.users.first() || msg.author;

        msg.channel.startTyping();

        const dbUser = await bot.userManager.getUser(targetUser.id);

        if (!dbUser.user.steamID) {
            return await this.fail(msg, "User does not have their Steam ID linked. Steam IDs can be linked to your account using `pls link <Steam ID>`.");
        }

        const res = await got("http://logs.tf/api/v1/log?limit=1&player=" + dbUser.user.steamID, {
            json: true
        });
        const data = res.body;

        if (data.logs.length < 1) {
            return await this.fail(msg, "User does not have a log history.");
        }

        const logID = data.logs[data.logs.length - 1].id;
    
        const screenshotBuffer = await render("http://logs.tf/" + logID + "#" + dbUser.user.steamID);
        
        await msg.channel.send("<http://logs.tf/" + logID + "#" + dbUser.user.steamID + ">", {
            files: [screenshotBuffer]
        });

        return true;
    }
}