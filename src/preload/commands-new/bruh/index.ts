import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";

export default class Bruh extends Command {
    constructor() {
        super(
            "bruh",
            "Bruh."
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        await this.respond(msg, "bruh");

        return true;
    }
}