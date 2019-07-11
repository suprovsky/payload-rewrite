import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message } from "discord.js";

export default class List extends Command {
    constructor() {
        super(
            "list",
            "**USING THESE COMMANDS IN A PUBLIC SERVER PUTS YOUR ACCOUNT AT RISK OF BEING HIJACKED! MAKE SURE TO USE THESE COMMANDS ONLY IN BOT DMS!**\n\nLists your servers.",
            undefined,
            undefined,
            undefined,
            ["dm"],
            undefined,
            undefined,
            ["server"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const user = await bot.userManager.getUser(msg.author.id);

        if (!user.user.servers) {
            return await this.fail(msg, "You have no servers added yet. Add them with `pls server add`.");
        }

        await this.respond(msg,
            "```AsciiDoc\n" +
            user.user.servers.map(server => `[${server.name}]\n\t${server.address}\n\t${server.rconPassword}`).join("\n") +
            "\n```"
        );

        return true;
    }
}