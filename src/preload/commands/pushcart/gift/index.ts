import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message } from "discord.js";

export default class Gift extends Command {
    constructor() {
        super(
            "gift",
            "Gifts <amount> points to a user.",
            "<user mention> <amount>",
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            ["pushcart"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg, 2);

        let amount = Number(args[1]);
        const targetUser = msg.mentions.users.first();

        if (!amount) {
            return await this.fail(msg, "Missing `<amount>` argument.");
        } else if (!targetUser) {
            return await this.fail(msg, "Missing or invalid `<user mention>` argument.");
        }

        amount = Math.round(amount);

        if (amount < 20) {
            return await this.fail(msg, "`<amount>` cannot be lower than 20.");
        }

        const from = await bot.userManager.getUser(msg.author.id);
        const to = await bot.userManager.getUser(targetUser.id);

        if (from.getFeetPushed() < amount) {
            return await this.fail(msg, `Too many points specified. The most you can gift is ${from.getFeetPushed()}.`);
        }

        from.feetPushedTransaction(-1 * amount);
        to.feetPushedTransaction(amount);

        await Promise.all([
            from.save(),
            to.save()
        ]);

        await this.respond(msg, `🎁 ${msg.author.tag} has gifted **${amount}** points to ${targetUser.tag}!`);

        return true;
    }
}