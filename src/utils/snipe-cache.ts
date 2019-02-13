import { Message, Collection } from "discord.js";
import { Bot } from "../types";

/**
 * Stores a message in the snipe cache.
 * @param bot The bot object with a snipe cache to store the message in.
 * @param message The message object to store.
 */
export function handleMessageDelete(bot: Bot, message: Message): boolean {
    if (message.author.bot) return false;

    if (!bot.cache.snipe[message.guild.id]) bot.cache.snipe[message.guild.id] = {};
    if (!bot.cache.snipe[message.guild.id][message.channel.id]) bot.cache.snipe[message.guild.id][message.channel.id] = new Collection();

    bot.cache.snipe[message.guild.id][message.channel.id].set(message.id, message);

    return true;
}

/**
 * Cleans up the snipe cache.
 * @param bot The bot object with a snipe cache to clean up.
 * @param message A message object used to determine the guild and channel cache to clean up.
 */
export function cleanCache(bot: Bot, message: Message): boolean {
    let now = new Date();

    if (!bot.cache.snipe[message.guild.id]) return false;
    if (!bot.cache.snipe[message.guild.id][message.channel.id]) return false;
    
    bot.cache.snipe[message.guild.id][message.channel.id].forEach(cachedMessage => {
        let cachedMessageDateMS = (cachedMessage.editedAt || cachedMessage.createdAt).getTime();
        let minutesDifference = (now.getTime() - cachedMessageDateMS)/60000;

        if (minutesDifference > 5) bot.cache.snipe[message.guild.id][message.channel.id].delete(cachedMessage.id);
    });

    return true;
}