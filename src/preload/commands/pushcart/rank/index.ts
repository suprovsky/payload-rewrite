import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message } from "discord.js";

export default class Rank extends Command {
    constructor() {
        super(
            "rank",
            "Shows a user's pushcart rank.",
            "[user mention]",
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            ["pushcart"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        if (!bot.leaderboard) {
            return await this.fail(msg, "Leaderboard has not yet been generated. Try again in a couple minutes.");
        }

        const targetUser = msg.mentions.users.first() || msg.author;

        const rank = bot.leaderboard.users.findIndex(user => user.id == targetUser.id) + 1;
        const feetPushed = (bot.leaderboard.users.find(user => user.id == targetUser.id) || { pushed: 0 }).pushed;
        await this.respond(msg, `\`\`\`#${rank}: ${targetUser.tag} (${feetPushed})\`\`\``);

        return true;
    }
}