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
            [
                {
                    name: "phrase",
                    description: "The phrase to translate.",
                    required: true,
                    type: "string",
                    minLength: 10,
                    maxLength: 100
                }
            ]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = await this.parseArgs(msg);

        if (args === false) {
            return false;
        }

        const phrase = args[0] as string;

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