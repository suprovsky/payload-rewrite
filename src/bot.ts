import Discord from "discord.js";
import Enmap from "enmap";
import db from "./database";

interface Client extends Discord.Client {
    db: Enmap
}

const bot: Client = new Discord.Client() as Client;
bot.db = db;

export default bot;