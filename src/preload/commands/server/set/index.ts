import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message } from "discord.js";

export default class Set extends Command {
    constructor() {
        super(
            "set",
            "**USING THESE COMMANDS IN A PUBLIC SERVER PUTS YOUR ACCOUNT AT RISK OF BEING HIJACKED! MAKE SURE TO USE THESE COMMANDS ONLY IN BOT DMS!**\n\nAdds a server to your list.",
            "<name> <address> <rcon password>",
            undefined,
            undefined,
            ["dm"],
            undefined,
            undefined,
            ["server"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg, 1);

        const serverName = args[0];
        const address = args[1];
        const rconPassword = args[3];

        if (!serverName) {
            return await this.fail(msg, "Missing `<name>` argument.");
        } else if (!address) {
            return await this.fail(msg, "Missing `<address>` argument.");
        } else if (!rconPassword) {
            return await this.fail(msg, "Missing `<rcon password>` argument.");
        }

        const user = await bot.userManager.getUser(msg.author.id);

        if (!user.user.servers) {
            user.user.servers = [];
        }

        if (user.user.servers.find(server => server.name == serverName)) {
            const serverIndex = user.user.servers.findIndex(server => server.name == serverName);

            user.user.servers[serverIndex] = {
                name: serverName,
                address,
                rconPassword
            };
        } else {
            user.user.servers.push({
                name: serverName,
                address,
                rconPassword
            });
        }

        await user.save();

        await this.respond(msg, `Set server \`${serverName}\` to \`${address}; ${rconPassword}\`.`);

        return true;
    }
}