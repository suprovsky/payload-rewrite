import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";

export default class Invite extends Command {
    constructor() {
        super(
            "invite",
            "Generates an invite link for you to invite Payload to your server."
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const inviteLink = await bot.generateInvite(["ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "READ_MESSAGES", "READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL"]);

        await this.respond(msg, "✉️ " + inviteLink);

        return true;
    }
}