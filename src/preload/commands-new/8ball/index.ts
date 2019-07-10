import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { random } from "../../../utils/random";

export default class EightBall extends Command {
    responses: Array<string>;

    constructor() {
        super(
            "8ball",
            "Asks the 8ball a question",
            "<question>"
        );

        this.responses = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes - definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",

            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            'Cannot predict now.',
            "Concentrate and ask again.",

            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful."
        ];
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const question = this.getArgs(msg).join(" ");

        if (!question) {
            await this.respond(msg, "You must ask the 8ball a question.");

            return false;
        }

        await this.respond(msg, `🎱 **${this.responses[random(0, this.responses.length - 1)]}**`);

        return true;
    }
}