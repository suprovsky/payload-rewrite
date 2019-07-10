import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import LogsApiKeyCommand from "./logs-api-key";
import NotificationsCommand from "./notifications";

export class Config extends Command {
    constructor() {
        super(
            "config",
            "**USING THESE COMMANDS IN A PUBLIC SERVER PUTS YOUR ACCOUNT AT RISK OF BEING HIJACKED! MAKE SURE TO USE THESE COMMANDS ONLY IN BOT DMS!**\n"
                + "\nlogs-api-key: Sets your logs.tf API key to <key>. Your API key can be retrieved from http://logs.tf/uploader."
                + "\nnotifications: Sets your Payload update notifications level. 2 for minor, 1 for major, 0 for none.",
            "logs-api-key <key>"
                + "\nnotifications <2|1|0>",
            undefined,
            undefined,
            ["dm"],
            undefined,
            {
                "logs-api-key": new LogsApiKeyCommand(),
                "notifications": new NotificationsCommand()
            }
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        if (!args) {
            await this.respond(msg, "Invalid syntax. Type `pls help config` to learn more.");

            return false;
        }

        if (!this.subCommands[args[0]]) {
            await this.respond(msg, "Invalid config field. Type `pls help config` to learn more.");

            return false;
        }

        return await this.runSub(args[0], bot, msg);
    }
}