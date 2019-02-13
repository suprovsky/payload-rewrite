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

import { Message, Collection } from "discord.js";
import { Bot } from "../types";

/**
 * Stores a message in the snipe cache.
 * @param bot The bot object with a snipe cache to store the message in.
 * @param message The message object to store.
 */
export function handleMessageDelete(bot: Bot, message: Message): void {
    if (message.author.bot) return;

    if (!bot.cache.snipe[message.guild.id]) bot.cache.snipe[message.guild.id] = {};
    if (!bot.cache.snipe[message.guild.id][message.channel.id]) bot.cache.snipe[message.guild.id][message.channel.id] = new Collection();

    bot.cache.snipe[message.guild.id][message.channel.id].set(message.id, message);
}

/**
 * Cleans up the snipe cache.
 * @param bot The bot object with a snipe cache to clean up.
 * @param message A message object used to determine the guild and channel cache to clean up.
 */
export function cleanCache(bot: Bot, message: Message): void {
    let now = new Date();

    if (!bot.cache.snipe[message.guild.id]) return;
    if (!bot.cache.snipe[message.guild.id][message.channel.id]) return;
    
    bot.cache.snipe[message.guild.id][message.channel.id].forEach(cachedMessage => {
        let cachedMessageDateMS = (cachedMessage.editedAt || cachedMessage.createdAt).getTime();
        let minutesDifference = (now.getTime() - cachedMessageDateMS)/60000;

        if (minutesDifference > 5) bot.cache.snipe[message.guild.id][message.channel.id].delete(cachedMessage.id);
    });
}