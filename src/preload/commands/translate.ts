import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import GoogleTranslate, { Translator } from "google-translate";

export const name = "translate";
export const description = "Breaks a phrase in translation.";
export const usage = config.PREFIX + name + " <phrase>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    const translator = GoogleTranslate(config.GOOGLE_API_KEY);

    const phrase = msg.content.slice(config.PREFIX.length + name.length);

    if (!phrase.match(/^(\s+[\w,;'"\s]+[.?!]?)+$/)) return msg.channel.send("Phrase must be a valid sentence (phrase detection is experimental and might not work too well, DM sharky if any problems arise).");

    try {
        const latinPhrase = await translate(translator, phrase, "en", "la");
        const botchedPhrase = await translate(translator, latinPhrase, "la", "en");

        msg.channel.send(botchedPhrase);
    } catch (err) {
        msg.channel.send("Error translating.");
    }
}

async function translate(translator: Translator, text: string, from: string, to: string): Promise<string> {
    return new Promise((resolve, reject) => {
        translator.translate(text, from, to, (err, translation) => {
            if (err) reject(err);
            else resolve(translation.translatedText);
        });
    })
}