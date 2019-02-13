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