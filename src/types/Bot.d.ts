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

import { Client, Collection, Message } from "discord.js";
import Enmap from "enmap";

/**
 * Payload Bot interface.
 */
export interface Bot extends Client {
    /**
     * Whether or not the bot's database is ready to be accessed.
     */
    isReady: boolean,

    /**
     * The bot's database.
     */
    db: Enmap,

    /**
     * A collection of commands indexed by each of their names.
     */
    commands: Collection<string, {name: string, run: Function}>,

    /**
     * A collection of automatic responses indexed by each of their names.
     */
    autoResponses: Collection<string, {name: string, pattern: RegExp, run: Function}>,

    /**
     * The bot's temporary cache.
     */
    cache: {

        /**
         * Snipe cache.
         */
        snipe: {
            [guild: string]: {
                [channel: string]: Collection<string, Message>
            }
        }
    }
}