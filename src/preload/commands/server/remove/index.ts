import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message } from "discord.js";

export default class Remove extends Command {
    constructor() {
        super(
            "remove",
            "**USING THESE COMMANDS IN A PUBLIC SERVER PUTS YOUR ACCOUNT AT RISK OF BEING HIJACKED! MAKE SURE TO USE THESE COMMANDS ONLY IN BOT DMS!**\n\nRemoves a server from your list.",
            [
                {
                    name: "name",
                    description: "The name of the server to remove.",
                    required: true,
                    type: "string"
                }
            ],
            undefined,
            undefined,
            ["dm"],
            undefined,
            undefined,
            ["server"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = await this.parseArgs(msg, 1);

        if (args === false) {
            return false;
        }

        const targetServer = args[0];

        if (!targetServer) {
            return await this.fail(msg, "Missing `<name>` argument.");
        }

        const user = await bot.userManager.getUser(msg.author.id);

        if (!user.user.servers) {
            return await this.fail(msg, "You have no servers added yet. Add them with `pls server add`.");
        }

        const serverIndex = user.user.servers.findIndex(server => server.name == targetServer);

        if (serverIndex < 0) {
            return await this.fail(msg, `\`${targetServer}\` does not exist under your account.`);
        }

        user.user.servers.splice(serverIndex, 1);

        await user.save();

        await this.respond(msg, `Removed server \`${targetServer}\` from your list.`);

        return true;
    }
}