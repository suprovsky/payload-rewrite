import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";

export default class Unrestrict extends Command {
    constructor() {
        super(
            "hello",
            "Hello World!"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        await msg.channel.send("Hello World!");

        return true;
    }
}