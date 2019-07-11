import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { Translate as GTranslate } from "@google-cloud/translate";
import config from "../../../../secure-config";

export default class Translate extends Command {
    constructor() {
        super(
            "translate",
            "Breaks a phrase in translation.",
            "<phrase>"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        const phrase = args[0];

        if (!phrase) {
            return await this.fail(msg, "Missing `<phrase>` argument.");
        }

        const translator = new GTranslate({ projectId: config.GCP_ID });

        try {
            const [latinPhrase] = await translator.translate(phrase, "la");
            const [botchedPhrase] = await translator.translate(latinPhrase, "en");
    
            await this.respond(msg, botchedPhrase);

            return true;
        } catch (err) {
            return await this.fail(msg, "Error translating.");
        }
    }
}