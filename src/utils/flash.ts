import { Message } from "discord.js";

/**
 * Flashes a message for a specified amount of seconds.
 * @param durationMS The duration of the flashed message.
 */
export async function flash(msgPromise: Promise<Message | Message[]>, durationMS: number) {
    return new Promise(async resolve => {
        let msg = await msgPromise;

        setTimeout(async () => {
            if (Array.isArray(msg)) {
                for (let i = 0; i < msg.length; i++) {
                    await msg[i].delete();
                }

                resolve();
            } else {
                await msg.delete();

                resolve();
            }
        }, durationMS);
    });
}