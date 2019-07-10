import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import info from "../../../config/info";
import { getChangelog } from "../../../utils/get-changelog";

export default class Changelog extends Command {
    constructor() {
        super(
            "changelog",
            "Retreives the changelog for the current version or [version]. Versions must follow the #.#.# format.",
            "[version]"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        const version = args[0] || info.version;

        const changelog = getChangelog(version);

        if (!changelog) {
            await this.respond(msg, "Invalid version format.");

            return false;
        }

        await this.respond(msg, "```md\n" + changelog + "\n```");

        return true;
    }
}