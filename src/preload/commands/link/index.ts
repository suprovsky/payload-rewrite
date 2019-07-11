import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { ensureSteamID } from "../../../utils/steam-id";

export default class Link extends Command {
    constructor() {
        super(
            "link",
            "Links your steam account to your Discord account.",
            "<Steam ID>"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        if (!args) {
            return await this.fail(msg, "Missing `<Steam ID>` argument.");
        }

        const steamIDTestResult = await ensureSteamID(args[0]);

        if (!steamIDTestResult) {
            return await this.fail(msg, "Invalid `<Steam ID>` argument.");
        }

        const user = await bot.userManager.getUser(msg.author.id);

        user.user.steamID = steamIDTestResult;

        await user.save();

        await this.respond(msg, `Successfully overrode old Steam ID with \`${steamIDTestResult}\` for \`${msg.author.tag}\`.`);

        return true;
    }
}