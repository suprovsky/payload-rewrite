import { Server, ServerModel } from "../../models/Server";
import * as Discord from "discord.js";
import * as Mongoose from "mongoose";

export default class UserManager {
    discordClient: Discord.Client;

    constructor(bot: Discord.Client) {
        this.discordClient = bot;
    }

    async ensureServer(guildID: string) {
        let server: ServerModel | null;
        server = await Server.findOne({ id: guildID });

        if (!server) {
            server = new Server({
                id: guildID
            });
        }

        return new ServerEditable(server);
    }
}

export class ServerEditable {
    server: ServerModel;

    constructor(model: ServerModel) {
        this.server = model;
    }

    getCommandRestrictions(): Array<{channelID: string, commands: Array<string>}> {
        return this.server.disabled || [];
    }

    addCommandRestrictions(restrictions: Array<{channelID: string, commands: Array<string>}>): Array<{channelID: string, commands: Array<string>}> {
        this.server.disabled = this.server.disabled || [];

        // Loop through each channel to match them up.
        for (let i = 0; i < restrictions.length; i++) {
            let existing = this.server.disabled.find(val => val.channelID == restrictions[i].channelID);

            if (!existing) this.server.disabled.push(restrictions[i]);
            else {
                let commandsRaw = [...existing.commands, ...restrictions[i].commands];

                existing.commands = [...new Set(commandsRaw)];
            }
        }

        return this.server.disabled;
    }

    removeCommandRestrictions(restrictions: Array<{channelID: string, commands: Array<string>}>): Array<{channelID: string, commands: Array<string>}> {
        if (!this.server.disabled) return [];

        // Loop through each channel to match them up.
        for (let i = 0; i < restrictions.length; i++) {
            let existing = this.server.disabled.find(val => val.channelID == restrictions[i].channelID);

            if (existing) {
                existing.commands = existing.commands.filter(existingCommand => !restrictions[i].commands.includes(existingCommand));
            }
        }

        return this.server.disabled;
    }

    addCartMiles(miles: number) {
        this.server.fun = this.server.fun || {
            payloadMilesPushed: 0
        };

        this.server.fun.payloadMilesPushed = this.server.fun.payloadMilesPushed || 0;

        return this.server.fun.payloadMilesPushed += miles;
    }

    async refresh() {
        this.server = (await Server.findOne({ id: this.server.id })) as ServerModel;

        return this;
    }

    async save() {
        return await this.server.save();
    }
}