import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { random } from "../../../utils/random";

export default class RTD extends Command {
    constructor() {
        super(
            "rtd",
            "Rolls a die with 6 sides or a die with [sides] sides if specified or [amount] dice with [sides] sides if specified.",
            "[sides] [amount]"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        const sides = args[0] || 6;
        const amount = args[1] || 1;

        if (!Number(sides) || Math.round(Number(sides)) < 2) {
            return await this.fail(msg, "[sides] argument must be a number greater than 1.");
        } else if (!Number(amount) || Math.round(Number(amount)) < 1 || Math.round(Number(amount)) > 50) {
            return await this.fail(msg, "[amount] argument must be a number greater than 0 and less than or equal to 50.");
        }

        let dice: number[] = [];

        for (let i = 0; i < Math.round(Number(amount)); i++) {
            dice.push(random(1, Math.round(Number(sides))));
        }

        await this.respond(msg, dice.map(roll => `🎲 **${roll}**`).join(" | "));

        return true;
    }
}