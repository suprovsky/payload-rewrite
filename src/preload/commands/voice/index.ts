import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";

export default class Hello extends Command {
    constructor() {
        super(
            "voice",
            "Makes Payload repeat a phrase to you in a voice channel.",
            [
                {
                    name: "phrase",
                    description: "",
                    type: "string",
                    required: true
                }
            ],
            ["SEND_MESSAGES", "CONNECT", "SPEAK"],
            ["SEND_MESSAGES", "SEND_TTS_MESSAGES"],
            ["text"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = await this.parseArgs(msg);

        if (args === false) {
            return false;
        }

        this.respond(msg, "ok");

        return true;
    }
}