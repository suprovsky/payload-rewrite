import Discord from "discord.js";
import config from "../secure-config";
import { Command, AutoResponse, Bot } from "./types"
import { readdir } from "fs";
import { handleMessageDelete, cleanCache } from "./utils/snipe-cache";
import handleCommand from "./utils/handle-command";
import handleAutoResponse from "./utils/handle-autoresponse";
import mongoose from "mongoose";
import info from "./config/info";
import { pushNotification } from "./utils/pushNotification";
import { getChangelog } from "./utils/get-changelog";

const bot: Bot = new Discord.Client() as Bot;
bot.commands = new Discord.Collection();
bot.autoResponses = new Discord.Collection();
bot.cache = {
    snipe: {},
    pings: {},
    music: {}
};

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to MongoDB.");
}).catch(() => {
    console.error("Error connecting to MongoDB. Make sure you used the correct password.");
    process.exit(1);
});

/**
 * Load commands.
 */
readdir(__dirname + "/preload/commands", (err, files) => {
    if (err) {
        throw new Error("Error reading commands directory: " + err);
    }

    console.log("Loading commands...");

    files.forEach(file => {
        let command: Command = require(__dirname + "/preload/commands/" + file);

        if (!command.name) return console.warn("\tFile " + file + " is not a valid command module.");

        bot.commands.set(command.name, command);

        console.log("\tLoaded " + command.name);
    });
});

/**
 * Load automatic responses.
 */
readdir(__dirname + "/preload/auto", (err, files) => {
    if (err) {
        throw new Error("Error reading automatic responses directory: " + err);
    }

    console.log("Loading autoresponses...");

    files.forEach(file => {
        let autoResponse: AutoResponse = require(__dirname + "/preload/auto/" + file);

        if (!autoResponse.name) return console.warn("\tFile " + file + " is not a valid autoresponse module.");

        bot.autoResponses.set(autoResponse.name, autoResponse);
        
        console.log("\tLoaded " + autoResponse.name);
    });
});

bot.on("messageDelete", msg => {
    handleMessageDelete(bot, msg);
    cleanCache(bot, msg);
});

bot.on("messageUpdate", (oldMsg, newMsg) => {
    handleMessageDelete(bot, oldMsg);
    cleanCache(bot, oldMsg);
});

bot.on("message", async msg => {
    let didHandleCommand = await handleCommand(bot, msg);
    if (!didHandleCommand) await handleAutoResponse(bot, msg);
});

bot.on("ready", () => {
    bot.user.setActivity(`payload.tf | v${info.version}`);

    let waitingInterval: NodeJS.Timeout;
    waitingInterval = setInterval(async () => {
        if (mongoose.connection.readyState === 1) {
            clearInterval(waitingInterval);

            let guilds = bot.guilds.array();

            let changelog = getChangelog(info.version);

            if (!changelog) return console.warn("Error fetching changelog!");

            for (let i = 0; i < guilds.length; i++) {
                let notif = await pushNotification(bot, guilds[i].ownerID, 1, new Discord.RichEmbed({
                    title: `Payload updated to v${info.version}!`,
                    description: "A new update has been released to Payload!",
                    fields: [
                        {
                            name: "Changelog",
                            value: `\`\`\`\n${changelog}\n\`\`\``
                        }
                    ],
                    footer: {
                        text: "To opt out of these notifications, use the `pls config notifications` command."
                    }
                }), info.version);
                console.log(`Notification: ${guilds[i].ownerID} | ${notif}`);
            }
        } else {
            console.log("Waiting for MongoDB connection...");
        }
    }, 500);

    console.log("Payload is running and listening for commands!");
});

bot.on("error", console.warn);

export default bot;