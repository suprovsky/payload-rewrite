import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";

export default class Bruh extends Command {
    constructor() {
        super(
            "bruh",
            "Bruh.",
            [
                {
                    name: "user mention",
                    description: "The user to bruh.",
                    required: false,
                    type: "string"
                }
            ]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        if (msg.mentions.users.size > 0) {
            await this.respond(msg, "bruh " + msg.mentions.users.first().toString());
        } else {
            await this.respond(msg, "bruh");
        }

        return true;
    }
}