import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { Translate as GTranslate } from "@google-cloud/translate";
//const {GTranslate} = require('@google-cloud/translate').v2;
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
                    minLength: 2,
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
        
	const phrase = msg.toString().substr(13);

        const translator = new GTranslate({ projectId: config.GCP_ID });

        try {
            const [botchedPhrase] = await translator.translate(phrase, "en");
            await this.respond(msg, botchedPhrase);

            return true;
        } catch (err) {
		return await this.fail(msg, "Error translating.");
        }
    }
}
