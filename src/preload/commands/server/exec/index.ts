import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message } from "discord.js";
import Rcon from "srcds-rcon";

export default class Exec extends Command {
    constructor() {
        super(
            "exec",
            "**USING THESE COMMANDS IN A PUBLIC SERVER PUTS YOUR ACCOUNT AT RISK OF BEING HIJACKED! MAKE SURE TO USE THESE COMMANDS ONLY IN BOT DMS!**\n\nExecutes a command on one of your servers.",
            "<name> <command>",
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

        const user = await bot.userManager.getUser(msg.author.id);

        const targetServer = args[0];
        const command = args[1];

        if (!targetServer) {
            return await this.fail(msg, "Missing <name> argument.");
        } else if (!command) {
            return await this.fail(msg, "Missing <command> argument.");
        }

        if (!user.user.servers) {
            return await this.fail(msg, "You have no servers added yet. Add them with `pls server add`.");
        }

        const server = user.user.servers.find(server => server.name == targetServer);

        if (!server) {
            return await this.fail(msg, `\`${targetServer}\` does not exist under your account.`);
        }

        const connection = Rcon({
            address: server.address,
            password: server.rconPassword
        });

        return new Promise(resolve => {
            connection.connect().then(() => {
                connection.command(`say [PAYLOAD] Command sent by ${msg.author.tag}.; ${command}`).then(async res => {
                    await this.respond(msg, "Command sent to server. Console output shown below:");

                    let responses = res.match(/.{1,1500}/g)!.slice(0, 3);
                    for (let i = 0; i < responses.length; i++) {
                        await this.respond(msg, "```" + responses[i] + "```");
                    }

                    await connection.disconnect();

                    resolve(true);
                }).catch(async () => {
                    resolve(await this.fail(msg, "Error sending command to your server."));
                });
            }).catch(async () => {
                resolve(await this.fail(msg, "Error connecting to your server. Make sure the address and rcon password are valid."));
            });
        });
    }
}