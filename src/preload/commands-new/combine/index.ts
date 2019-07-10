import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import got from "got";
import { render } from "../../../utils/render-log";

export default class Combine extends Command {
    constructor() {
        super(
            "combine",
            "Combines 2 or more logs into a bigger log.",
            "<map> <title> <log url> <log url 2> [log url 3]...",
            ["SEND_MESSAGES", "ATTACH_FILES"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        const map = args[0];
        const title = args[1];
        const logs = args.slice(2);

        if (!map || map.match(/logs\.tf\/\d+/)) {
            await this.respond(msg, "Invalid syntax. Make sure to specify the map and title before the log URLs. Type `pls help combine` to learn more.");

            return false;
        } else if (!title || title.match(/logs\.tf\/\d+/)) {
            await this.respond(msg, "Invalid syntax. Make sure to specify the map and title before the log URLs. Type `pls help combine` to learn more.");

            return false;
        } else if (logs.length < 2) {
            await this.respond(msg, "Invalid syntax. Make sure to specify the map and title before the log URLs. Type `pls help combine` to learn more.");

            return false;
        }

        let logIds: Array<string> = [];
        for (let i = 0; i < logs.length; i++) {
            const logId = logs[i].match(/\d+/);

            if (!logId) {
                await this.respond(msg, `\`${logs[i]}\` is not a valid log.`);

                return false;
            }

            logIds.push(logId![0]);
        }

        msg.channel.startTyping();

        const user = await bot.userManager.getUser(msg.author.id);

        if (!user.user.logsTfApiKey) {
            await this.respond(msg, "You have not set a logs.tf API key. Type `pls help config` to find out more.");

            return false;
        }

        /**
         * Initiate Logify API request.
         */

        const requestBody = {
            token: user.user.logsTfApiKey,
            title,
            map,
            ids: logIds
        };

        const res = await got("https://sharkyy.io/api/logify/v3", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            json: true,
            body: requestBody,
            throwHttpErrors: false
        });

        if (!res.body.success) {
            await this.respond(msg, "Error combining logs.");

            return false;
        }

        await this.respond(msg, "**Done!** https://logs.tf/" + res.body.log_id);

        const screenshotBuffer = await render("https://logs.tf/" + res.body.log_id);
        await msg.channel.send({
            files: [screenshotBuffer]
        });

        return true;
    }
}