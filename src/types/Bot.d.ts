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