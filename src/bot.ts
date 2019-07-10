import Discord from "discord.js";
import config from "../secure-config";
import { AutoResponse, Bot, ScheduledScript } from "./types";
import { Command } from "./lib/Executables/Command";
import { readdir } from "fs";
import { handleMessageDelete, cleanCache } from "./utils/snipe-cache";
import handleCommand from "./utils/handle-command";
import handleAutoResponse from "./utils/handle-autoresponse";
import mongoose from "mongoose";
import info from "./config/info";
import { pushNotification } from "./utils/push-notification";
import { getChangelog } from "./utils/get-changelog";
import UserManager from "./lib/UserManager";
import ServerManager from "./lib/ServerManager";
import { Bot as BotDoc, BotModel } from "./models/Bot";

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = config.GOOGLE_CREDENTIALS_PATH;

const bot: Bot = new Discord.Client() as Bot;
bot.scheduled = [];
bot.commands = new Discord.Collection();
bot.autoResponses = new Discord.Collection();
bot.userManager = new UserManager(bot);
bot.serverManager = new ServerManager(bot);
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
 * Load schedules scripts.
 */
readdir(__dirname + "/scheduled", (err, files) => {
    if (err) {
        throw new Error("Error reading schedule directory: " + err);
    }

    console.log("Loading scheduled scripts...");

    files.forEach(file => {
        let script: ScheduledScript = require(__dirname + "/scheduled/" + file);

        bot.scheduled.push(script);

        console.log("\tLoaded " + file);
    });
});

/**
 * Load commands.
 */
readdir(__dirname + "/preload/commands", (err, files) => {
    if (err) {
        throw new Error("Error reading commands directory: " + err);
    }

    console.log("Loading commands...");

    files.forEach(folder => {
        let command: Command = require(__dirname + "/preload/commands/" + folder);

        if (!command.name) return console.warn("\t" + folder + " is not a valid command module.");

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

            // Run scheduled scripts
            for (let i = 0; i < bot.scheduled.length; i++) {
                let script = bot.scheduled[i];

                if (script.every < 0) script.run(bot);
                else setInterval(() => script.run(bot), script.every);
            }

            let guilds = bot.guilds.array();

            let changelog = getChangelog(info.version);

            if (!changelog) return console.warn("Error fetching changelog!");

            let botDoc: BotModel | null = await BotDoc.findOne({ id: 0 });

            if (botDoc && botDoc.startupVersion && botDoc.startupVersion == info.version) return console.log("No new version.");

            for (let i = 0; i < guilds.length; i++) {
                let notif = await pushNotification(bot, guilds[i].ownerID, 2, new Discord.RichEmbed({
                    title: `Payload updated to v${info.version}!`,
                    description: "A new update has been released to Payload!\nTo opt-out of these update notifications, type `pls config notifications 1`.",
                    fields: [
                        {
                            name: "Changelog",
                            value: `\`\`\`\n${changelog}\n\`\`\``
                        }
                    ],
                    footer: {
                        text: "To find out how to opt out of these notifications, type `pls help config`."
                    }
                }), info.version);
                console.log(`Notification: ${guilds[i].ownerID} | ${notif} | ${i + 1} of ${guilds.length}`);
            }

            if (!botDoc) return console.log("No bot db entry!");

            botDoc.startupVersion = info.version;

            await botDoc.save();
        } else {
            console.log("Waiting for MongoDB connection...");
        }
    }, 500);

    console.log("Payload is running and listening for commands!");
});

bot.on("error", console.warn);

export default bot;