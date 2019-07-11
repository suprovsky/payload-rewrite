import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message, User } from "discord.js";

export default class Avatar extends Command {
    constructor() {
        super(
            "avatar",
            "Retrieves a user's avatar (or yours if no users are specified).",
            [
                {
                    name: "user mention",
                    description: "The user who's avatar you want to view.",
                    required: false,
                    type: "string"
                }
            ],
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const targetUser = msg.mentions.users.first() || msg.author;

        await this.respond(msg, targetUser.displayAvatarURL);

        return true;
    }
}