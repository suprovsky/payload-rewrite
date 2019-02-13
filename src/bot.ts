/*
    Payload, a Discord bot made for the TF2 community.
    Copyright (C) 2019  Juan de Urtubey

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import Discord from "discord.js";
import db from "./database";
import { Command, AutoResponse, Bot } from "./types"
import { readdir } from "fs";

const bot: Bot = new Discord.Client() as Bot;
bot.isReady = false;
bot.db = db;
bot.commands = new Discord.Collection();
bot.autoResponses = new Discord.Collection();
bot.cache = {
    snipe: {}
};

/**
 * Load commands.
 */
readdir(__dirname + "/preload/commands", (err, files) => {
    if (err) {
        throw new Error("Error reading commands directory: " + err);
    }

    files.forEach(file => {
        let command: Command = require(__dirname + "/preload/commands/" + file);

        bot.commands.set(command.name, command);
    });
});

/**
 * Load automatic responses.
 */
readdir(__dirname + "/preload/auto", (err, files) => {
    if (err) {
        throw new Error("Error reading automatic responses directory: " + err);
    }

    files.forEach(file => {
        let autoResponse: AutoResponse = require(__dirname + "/preload/auto/" + file);

        bot.autoResponses.set(autoResponse.name, autoResponse);
    });
});

bot.on("ready", async () => {
    await bot.db.defer;
    bot.isReady = true;
});

export default bot;