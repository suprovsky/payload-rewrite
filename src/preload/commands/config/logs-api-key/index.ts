import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message } from "discord.js";

export default class logsApiKey extends Command {
    constructor() {
        super(
            "logs-api-key",
            "Sets your logs.tf API key to <key>",
            "<key>",
            undefined,
            undefined,
            ["dm"],
            undefined,
            undefined,
            ["config"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg, 1);

        if (!args[0]) {
            await this.respond(msg, "Missing API key. Type `pls help config` to learn more.");

            return false;
        }

        const user = await bot.userManager.getUser(msg.author.id);
        user.setProp("logsTfApiKey", args[0]);
        await user.save();

        await this.respond(msg, `Set logs-api-key to \`${args[0]}\``);

        return true;
    }
}