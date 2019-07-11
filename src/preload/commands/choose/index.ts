import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { random } from "../../../utils/random";

export default class Choose extends Command {
    constructor() {
        super(
            "choose",
            "Randomly chooses <amount> options from a list.",
            "<amount> [option 1] [option 2]..."
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        const amount = args[0];
        let list = args.slice(1);

        if (!amount) {
            await this.respond(msg, "Missing `<amount>` argument.");

            return false;
        } else if (!Number(amount)) {
            await this.respond(msg, "`<amount>` argument must be a whole number.");

            return false;
        } else if (list.length < 2) {
            await this.respond(msg, "You must provide at least 2 options to choose from.");

            return false;
        }

        let chosen = [];
        for (let i = 0; i < Number(amount); i++) {
            if (list.length == 0) break;

            let chosenIndex = random(0, list.length - 1);
            chosen.push(list.splice(chosenIndex, 1));
        }

        await this.respond(msg, chosen.join(", "));

        return true;
    }
}