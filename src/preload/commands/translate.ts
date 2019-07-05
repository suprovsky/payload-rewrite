import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { Translate } from "@google-cloud/translate";

export const name = "translate";
export const description = "Breaks a phrase in translation.";
export const usage = config.PREFIX + name + " <phrase>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    const translator = new Translate({ projectId: config.GCP_ID });

    const phrase = msg.content.slice(config.PREFIX.length + name.length);

    try {
        const [latinPhrase] = await translator.translate(phrase, "la");
        const [botchedPhrase] = await translator.translate(latinPhrase, "en");

        msg.channel.send(botchedPhrase);
    } catch (err) {
        msg.channel.send("Error translating.");
    }
}