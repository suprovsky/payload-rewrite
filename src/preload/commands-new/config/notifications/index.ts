import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message } from "discord.js";

export default class logsApiKey extends Command {
    constructor() {
        super(
            "notifications",
            "Sets your Payload notifications level. 2 = all, 1 = major, 0 = none.",
            "<2|1|0>"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg, 1);

        if (!args[0]) {
            await this.respond(msg, "Missing notifications level. Type `pls help config` to learn more.");

            return false;
        } else if (!Number(args[0]) || ![0, 1, 2].includes(Number(args[0]))) {
            await this.respond(msg, "Invalid notifications level. Type `pls help config` to learn more.");

            return false;
        }

        const user = await bot.userManager.getUser(msg.author.id);
        user.setProp("notificationsLevel", args[0]);
        await user.save();

        await this.respond(msg, `Set notifications to \`${args[0]}\``);

        return true;
    }
}